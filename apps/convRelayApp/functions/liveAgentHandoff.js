/* eslint-disable quotes */
/* eslint-disable indent */
/* eslint-disable no-unused-vars */
async function liveAgentHandoff(functionArgs) {
  const reason = functionArgs.reason;
  const gptService = functionArgs.gptService;
  const endSessionService = functionArgs.endSessionService;
  const textService = functionArgs.textService;
  const userProfile = functionArgs.userProfile;

  console.log('GPT -> called liveAgentHandoff function, reason: ', reason);

  const name = userProfile?.customerProfile?.first_name
      ? userProfile.customerProfile.first_name
      : "";
  const handOffMessage = `Let me get a live agent to assist you ${name}`;

  textService.sendText(handOffMessage, true); // Final message before handoff

  gptService.updateUserContext("assistant", "assistant", handOffMessage);

  const conversationSummary = await gptService.summarizeConversation();
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

module.exports = liveAgentHandoff;