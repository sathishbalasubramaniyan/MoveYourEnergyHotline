
const { OpenAI } = require('openai');

exports.handler = async function(context, event, callback) {
    let ret = {}


    const response = new Twilio.Response();
    response.appendHeader('Access-Control-Allow-Origin', '*');
    response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
    response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

    // get passed parameters
    // const { messages, language } = event;
    const language  = event.language
    const transcript = event.transcript

    const openai = new OpenAI({
      apiKey: context.OPENAI_API_KEY,
    });


    // if (!language || !transcript) {
    //     throw new Error('Missing LANGUAGE or TRANSCRIPT parameters.');
    //   }  
    
    try {
        const formatMessage = (message, direction) => ({
          role: direction.includes('inbound') ? 'user' : 'assistant',
          content: message,
        });
    
        const prompt = [];
        transcript.forEach(({ message }) => prompt.push(formatMessage(message, 'user')));
    
        prompt.push({
          role: 'system',
          content: `Always respond with a json array containing one or more objects with keys "suggestion" and "title", always complete both fields. You are a customer service agent assistant. Here is the call transcript so far, make a recommendation to the agent with the next best action or suggestion. Use the customers language where possible.`,
        });
    
        const result = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: prompt,
        });
    

        let suggestions = [];
        let success = false;
        if (result.choices[0].message.content) {
          let suggestionsJson = result.choices[0].message.content?.trim();
          try {
            suggestions = JSON.parse(suggestionsJson);
            success = true;
          } catch (err) {
            success = false;
            console.log('Error parsing results from AI', err);
          }

          ret = {status : success, data : suggestions, blah: true }    
          response.setBody(ret);
          return callback(null, response);
        }
    
        // throw new Error('Unable to fetch message recommendation.');
      } catch (error) {
        console.log('in error', error.message);
        ret = { status: "error", data: error.message}
        callback(null, response.setBody(ret))
      }    

}