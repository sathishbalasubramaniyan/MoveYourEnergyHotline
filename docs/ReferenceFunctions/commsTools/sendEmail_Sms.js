const sgMail = require('@sendgrid/mail');

exports.handler = async function(context, event, callback) {

    const twilioClient = context.getTwilioClient();

    sgMail.setApiKey(context.SENDGRID_API_KEY);

     try {
        const msg = {
        to: 'ecdemo2024@gmail.com',
        from: 'agent@kmaiti2.flexninjamountain.com',
        templateId: "d-bd6a48e5c25946f69af49a7fdfc22e62",
        subject: "Your airport lounge upgrade, Bill!"
      };
      
    //Send email
       sgMail.send(msg)
      .then(() => {
         console.log("Email sent successfully.");

    //Send sms
        twilioClient.messages.create({
                to: context.TO_PHONE_NUMBER,
                from: context.TWILIO_PHONE_NUMBER, // Your Twilio phone number in environment variables
                body: 'Hello Bill! Owl Bank here! It looks like your new credit card was delivered today, do you need help activating it?'
        }).then(() => {
            console.log('SMS successfully sent');
            callback(null, 'Email and SMS sent successfully');
        })
        .catch((error) => {
            console.log("Sms not sent successfully:", error.code);
            callback(error);         
        });

       })
      .catch(err => {
           console.log("Email not successful.")
           callback(err);
      });
        

  } catch (error) {
    console.error('Error:', error);
     callback(error);
  }
};