/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
const twilio = require('twilio');
require('dotenv').config();

async function verifySend(functionArgs) {
  const phone = functionArgs.phone;
  console.log('GPT -> called verifySend function, phone:', phone);

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = twilio(accountSid, authToken);
  
  
  // code block for Verify simulation using SMS for testing with dev phone, as dev phone cannot receive Verify OTPs
  //let code = "8591"; // Temp hack to avoid filtering, as I am using a Twilio number with dev phone as the from number for testing.

  // const min = 1000;
  // const max = 9999;
  // const code = Math.floor(Math.random() * (max - min + 1)) + min;
  // Send the code using Twilio Messaging. To replace later with Twilio Verify SMS

  //console.log(`[VerifySend] Sending code: ${code} to: ${phone} from: ${process.env.FROM_NUMBER}`);

  // await client.messages.create({
  //   to: phone,
  //   from: process.env.FROM_NUMBER,
  //   body: `Your OTP is: ${code}`
  // });

  // console.log(`[VerifySend] Verification code sent successfully`);

  // return `Verification code sent successfully and the generated verification code is ${code}`;

  // Verify code block when testing with a real phone

  const verification = await client.verify.v2
    .services("VAaafecd05115fc6a172efd811441590e7")
    .verifications.create({
      channel: "sms",
      to: phone
    });

  console.log(`[VerifySend] Verification code sent successfully`);
  return `Verification code sent successfully`;
}

module.exports = verifySend;