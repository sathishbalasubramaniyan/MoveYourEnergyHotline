// This is a Twilio Function to send an SMS Verify OTP to a phone number

exports.handler = function(context, event, callback) {
    // Access the Twilio Verify Service SID from your environment variables
    const VERIFY_SERVICE_SID = context.VERIFY_SERVICE_SID;

    // Twilio's Node.js helper library is already available in Twilio Functions
    const client = context.getTwilioClient();

    // The phone number to send the OTP to, passed as a parameter to the function
    const to = event.to;

    // Ensure the 'to' parameter is provided
    if (!to) {
        return callback('The "to" parameter is required.', null);
    }

    // Use the Verify API to send the OTP
    client.verify.services(VERIFY_SERVICE_SID)
        .verifications
        .create({ to: to, channel: 'sms' })
        .then(verification => {
            console.log(`Sent verification: ${verification.sid}`);
            // Respond with success message
            callback(null, { success: true, message: 'OTP sent successfully.', sid: verification.sid });
        })
        .catch(error => {
            console.error(error);
            // Respond with error message
            callback({ success: false, message: 'Failed to send OTP.', error: error });
        });
};