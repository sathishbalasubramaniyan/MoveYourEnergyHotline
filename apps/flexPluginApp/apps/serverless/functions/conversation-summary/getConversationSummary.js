/*
This code retrieves a Twilio Sync List and prepares a formatted input to OpenAi 
to summarize the conversation between a customer & IVR/agent 
*/


const OpenAI = require('openai');

exports.handler = async (context, event, callback) => {
    const response = new Twilio.Response();
  
    response.appendHeader("Access-Control-Allow-Origin", "*");
    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS, POST, GET");
    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
    response.appendHeader("Content-Type", "application/json");

    callback(null, response.setBody({status: 'success'}))
  
    const twilioSyncServiceSid = context.TRANSCRIPT_SYNC_SERVICE_SID;
    console.log("Incoming event to store document", event);
  
    if (!event.CallSid) {
      const error = "Missing CallSid data";
      response.setBody({ message: error });
      response.setStatusCode(400);
      return callback(null, response);
    }
  
    const listUniqueName = "Transcript-" + event.CallSid;
    const client = context.getTwilioClient();
  
    console.log("Using Sync service with SID", twilioSyncServiceSid);
    console.log("List Unique ID", listUniqueName);
  
    try {
      // Check if list exists and update
      client.sync.v1
        .services(twilioSyncServiceSid)
        .syncLists(listUniqueName)
        .syncListItems.list({ limit: 50 })
        .then(async (syncListItems) => {
          
          // Create the transcript
          let transcript = '';
          syncListItems.forEach((item, index) => {
            let data = item.data;
            let customerText = data.ResolvedInput ? data.ResolvedInput : '';
            let agentText = data.ReplyText ? data.ReplyText : '';
            
            if(index === 0 && customerText === '') {
              transcript += `VirtualAgent: ${agentText}\n`;
            } else {
              transcript += `Customer: ${customerText}\n`;
              transcript += `VirtualAgent: ${agentText}\n`;
            }
          });
          
        console.log(transcript);

        // Initialize OpenAI object with API key from environment variables
        const openai = new OpenAI({ apiKey: context.OPENAI_API_KEY });

        try {
            // Create a summary using GPT-3.5 Turbo
            const gptResponse = await openai.chat.completions.create({
                messages: [
                    { role: 'user', content: `Summarize the following transcript:\n${transcript}` }
                ],
                model: 'gpt-3.5-turbo',
            });

            const summary = gptResponse.choices[0].message.content;
            console.log("Summary:", summary);

            response.setBody({ transcript, summary });
            callback(null, response);
          } catch (err) {
              console.error('Error calling OpenAI API:', err);
              callback(err);
          }
        })
        .catch(async (error) => {
          console.log("Error getting list items");
          callback(error.message);
        });
    } catch (err) {
      console.log("Oh shoot. Something went really wrong, check logs", err);
      callback(err);
    }
};