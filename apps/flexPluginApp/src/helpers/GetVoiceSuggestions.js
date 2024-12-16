import axios from 'axios'

//  AJAX to retrieve TR Workflows
//
export const getVoiceSuggestions = async (language, transcript, token) => {
  console.log('in getVoiceSuggestion')

    var data = JSON.stringify({ 
        language: language,
        transcript: transcript,
        Token: token       
        });

    console.log('data', data)
  
    var config = {
        method: 'post',
        url: `${process.env.REACT_APP_SERVERLESS_DOMAIN}/realtime-voice-suggestions/ai-suggestion`,
        headers: { 
          'Content-Type': 'application/json', 
        },
        data : data
      };
    return await axios(config)
      .then(function (response) {
        // call to twilio function == success
        console.log(response.data)
        return response.data
  
      })
      .catch(function (error) {
        console.log(error);
      });
  }