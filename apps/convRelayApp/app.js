/* eslint-disable indent */
/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
/* eslint-disable semi */
require('dotenv').config();
require('colors');
require('log-timestamp');


const express = require('express');
const ExpressWs = require('express-ws');

const { GptService } = require('./services/gpt-service');
const { TextService } = require('./services/text-service');

//  CFA: Added to support agent handoff
// eslint-disable-next-line quotes
const { EndSessionService } = require("./services/end-session-service");
const { recordingService } = require('./services/recording-service');

const { getProfileTraits } = require('./services/segment-service');

// const { prompt, userProfile, orderHistory } = require('./services/prompt');

// Import helper functions
const {
  processUserInputForHandoff,
  handleLiveAgentHandoff
} = require("./functions/helper-functions")

const { getLatestRecord } = require('./services/airtable-service');

const app = express();
ExpressWs(app);

const PORT = process.env.PORT || 3000;


const test = async() => {
  record = await getLatestRecord();
  console.log('Get latest record ', record);
}



// Declare global variable
let gptService; 
let textService;
let endSessionService;
let record;
// Add this code after creating the Express app

app.get('/monitor', (req, res) => {
  // eslint-disable-next-line no-undef
  res.sendFile(__dirname + '/monitor.html');
});

// Initialize an array to store logs
const logs = [];

// Method to add logs
function addLog(level, message) {
    console.log(message);
    const timestamp = new Date().toISOString();
    logs.push({ timestamp, level, message });
}

// Route to retrieve logs
app.get('/logs', (req, res) => {
    res.json(logs);
});


app.post('/incoming', async (req, res) => {
  try {
    logs.length = 0; // Clear logs
    addLog('info', 'incoming call started');
    
    // Get latest record from airtable
    record = await getLatestRecord();
    // console.log('Get latest record ', record);

    // Initialize GPT service 
    gptService = new GptService(record.model);

    let prompt = record.sys_prompt;

    const currentDate = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    prompt = prompt.replace("{{currentDate}}", currentDate);
    
    gptService.userContext.push({ 'role': 'system', 'content': prompt });
    //gptService.userContext.push({ 'role': 'system', 'content': record.profile });
    //gptService.userContext.push({ 'role': 'system', 'content': record.orders });
    //gptService.userContext.push({ 'role': 'system', 'content': record.inventory });
    //gptService.userContext.push({ 'role': 'system', 'content': record.example });
    gptService.userContext.push({ 'role': 'system', 'content': `You can speak in many languages, but use default language ${record.language} for this conversation from now on! Remember it as the default language, even you change language in between. treat en-US and en-GB etc. as different languages.`});
    

    addLog('info', `language : ${record.language}, voice : ${record.voice}`);
    

    // const response = 
    // `<Response>
    //   <Connect action="${process.env.CONNECT_ACTION_URI}">
    //     <ConversationRelay url="wss://${process.env.SERVER}/sockets" dtmfDetection="true" voice="${record.voice}" language="${record.language}" transcriptionProvider="${record.transcriptionProvider}">
    //       <Language code="fr-FR" ttsProvider="google" voice="fr-FR-Neural2-B" />
    //       <Language code="es-ES" ttsProvider="google" voice="es-ES-Neural2-B" />
    //       <Language code="en-GB" ttsProvider="amazon" voice="Olivia-Generative" transcriptionProvider="Deepgram"/>
    //     </ConversationRelay>
    //   </Connect>
    // </Response>`;
    const response = `<Response>
      <Connect action="${process.env.CONNECT_ACTION_URI}">
          <ConversationRelay 
            url="wss://${process.env.SERVER}/sockets" 
            voice="en-AU-Neural2-A" 
            dtmfDetection="true" 
            interruptByDtmf="true" 
            debug="true"
          />
      </Connect>
    </Response>`;
    res.type('text/xml');
    res.end(response.toString());
  } catch (err) {
    console.log(err);
  }
});

app.ws('/sockets', (ws) => {
  try {
    ws.on('error', console.error);
    // Filled in from start message
    let callSid;

    textService = new TextService(ws);

    // CFA: Added to support agent handoff
    endSessionService = new EndSessionService(ws)

    let interactionCount = 0;
    let dtmfDigits = '';
    
    // Incoming from MediaStream
    ws.on('message', async function message(data) {
      const msg = JSON.parse(data);
      console.log(msg);
      if (msg.type === 'setup') {
        addLog('convrelay', `convrelay socket setup ${msg.callSid}`);
        callSid = msg.callSid;        
        gptService.setCallInfo('customer phone number', msg.from);

        gptService.setTextService(textService);
        gptService.setEndSessionService(endSessionService);
        const userId = msg.from.substring(1);
        const profileTraits = await getProfileTraits(userId);
        const profile = {};
        profile.customerProfile = profileTraits;
        gptService.setUserProfile(profile);

        gptService.userContext.push({ 'role': 'system', 'content': JSON.stringify(profile) });

        //trigger gpt to start 
        gptService.completion('hello', interactionCount);
        interactionCount += 1;

        if(record.recording){
        recordingService(textService, callSid).then(() => {
            console.log(`Twilio -> Starting recording for ${callSid}`.underline.red);
          });
        }
      }  
      
      if (msg.type === 'prompt') {
        addLog('convrelay', `convrelay -> GPT (${msg.lang}) :  ${msg.voicePrompt} `);
  
        const trimmedVoicePrompt = msg.voicePrompt.trim()
        //const shouldHandoff = await processUserInputForHandoff(trimmedVoicePrompt)

        //addLog('convrelay', `convrelay -> should handoff: (${trimmedVoicePrompt} : ${shouldHandoff})`)

        // CFA: Added to support agent handoff
        //  lines: 153 - 163
        //
        // live agent handoff
        // if (shouldHandoff) {
        //   handleLiveAgentHandoff(
        //     gptService,
        //     endSessionService,
        //     textService,
        //     // userProfile,
        //     record.profile,
        //     trimmedVoicePrompt
        //   );
        //   return;         
        // }
        gptService.completion(msg.voicePrompt, interactionCount);
        interactionCount += 1;
      } 
      
      if (msg.type === 'interrupt') {
        addLog('convrelay', 'convrelay interrupt: utteranceUntilInterrupt: ' + msg.utteranceUntilInterrupt + ' durationUntilInterruptMs: ' + msg.durationUntilInterruptMs);
        gptService.interrupt();
        // console.log('Todo: add interruption handling');
      }

      if (msg.type === 'error') {
        addLog('convrelay', 'convrelay error: ' + msg.description);
        
        // console.log('Todo: add error handling');
      }

      if (msg.type === 'dtmf') {
        addLog('convrelay', 'convrelay dtmf: ' + msg.digit);
        dtmfDigits = `${dtmfDigits}${msg.digit}`
        if (dtmfDigits.length === 4) {
          gptService.completion(dtmfDigits, interactionCount);
          interactionCount += 1;
          dtmfDigits = '';
        }
        
        //console.log('Todo: add dtmf handling');
      }

    });
      
    gptService.on('gptreply', async (gptReply, final, icount) => {
      console.log(`Interaction ${icount}: GPT -> TTS: ${gptReply}`.green );
      //addLog('info', gptReply);
      addLog('gpt', `GPT -> convrelay: Interaction ${icount}: ${gptReply}`);
      textService.sendText(gptReply, final);
    });

    gptService.on('tools', async (functionName, functionArgs, functionResponse) => {
      
      addLog('gpt', `Function ${functionName} with args ${functionArgs}`);
      addLog('gpt', `Function Response: ${functionResponse}`);

      if(functionName == 'changeLanguage' && record.changeSTT){
        addLog('convrelay', `convrelay ChangeLanguage to: ${functionArgs}`);
        let jsonObj = JSON.parse(functionArgs);
        textService.setLang(jsonObj.language);
        // gptService.userContext.push({ 'role': 'assistant', 'content':`change Language to ${functionArgs}`});
      }
      
    });

  } catch (err) {
    console.log(err);
  }
});

app.listen(PORT);
console.log(`Server running on port ${PORT}`);
