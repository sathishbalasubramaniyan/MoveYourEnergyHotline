/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
const twilio = require('twilio');

async function verifyCode(functionArgs) {
  const phone = functionArgs.phone;
  const code = functionArgs.code;
  const generatedCode = functionArgs.generated_verification_code; //This is a temp hack to test with a dev phone, as Twilio numbers filter OTPs. Will be replaced with Twilio Verify later, when testing with a real phone number

  console.log('GPT -> called verifyCode function, phone: ', phone);
  console.log('GPT -> called verifyCode function, code: ', code);
  console.log('GPT -> called verifyCode function, generated code: ', generatedCode);

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = twilio(accountSid, authToken);
  
  //Temp hack. To replace later with Twilio Verify code verification.
  if (code === generatedCode) {
    console.log(`[VerifyCode] Verification status success`);
    return JSON.stringify({verification_status: "success"});
  } else {
    console.log(`[VerifyCode] Verification status failed`);
    return JSON.stringify({verification_status: "failed"});
  }
}

module.exports = verifyCode;