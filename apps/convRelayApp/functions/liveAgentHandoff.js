/* eslint-disable quotes */
/* eslint-disable indent */
/* eslint-disable no-unused-vars */
require('dotenv').config();
const AccessToken = require('twilio').jwt.AccessToken;
const SyncGrant = AccessToken.SyncGrant;
const TwilioSync = require('twilio-sync');
let syncClient = null;
async function liveAgentHandoff(functionArgs) {
  const reason = functionArgs.reason;
  const gptService = functionArgs.gptService;
  const endSessionService = functionArgs.endSessionService;
  const textService = functionArgs.textService;
  const userProfile = functionArgs.userProfile;
  syncClient = new TwilioSync.Client(getToken());

  console.log('GPT -> called liveAgentHandoff function, reason: ', reason);

  const name = userProfile?.customerProfile?.first_name
      ? userProfile.customerProfile.first_name
      : "";
  const handOffMessage = `Let me get a live agent to assist you ${name}`;

  textService.sendText(handOffMessage, true); // Final message before handoff

  gptService.updateUserContext("assistant", "assistant", handOffMessage);

  const userContext = gptService.getUserContext();

  console.log("Transcript:",JSON.stringify(userContext));

  const transcriptArr = userContext.filter(function(item) {
    return ((item.role === "user" || item.role === "assistant") && (item.content.length > 0 && !(item.content.startsWith("customer phone number:")) && (item.content !== "hello")))?true:false;
  });

  const conversationSummary = await gptService.summarizeConversation();
  createMap(userProfile?.customerProfile?.phone, transcriptArr);

  setTimeout(() => {
    // End the session and include the conversation summary in the handoff data

    endSessionService.endSession({
      reasonCode: "live-agent-handoff",
      reason: reason,
      conversationSummary: conversationSummary,
      customerData: userProfile
    });
  }, 1000); // 1 second delay
  
}

function getToken() {
    const identity = "test";
  
    const syncGrant = new SyncGrant({
          serviceSid: process.env.TWILIO_DEFAULT_SERVICE_SID
      });
  
    const token = new AccessToken(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_API_KEY,
        process.env.TWILIO_API_SECRET,
        { identity }
    );
  
    token.addGrant(syncGrant);
    token.identity = identity;
    return token.toJwt();
  }

  async function createMap(phone, transcript) {
	const map = await syncClient.map("test");
	const mapItem = await map.set(phone, {transcript});
	console.log("Map Item set in liveAgentHandOff: "+ JSON.stringify(mapItem.descriptor.data.transcript));
}

module.exports = liveAgentHandoff;