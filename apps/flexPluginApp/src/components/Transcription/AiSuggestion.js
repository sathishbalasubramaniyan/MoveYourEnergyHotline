
import { useEffect, useState } from 'react';
import { Manager } from '@twilio/flex-ui'
import { withTaskContext } from '@twilio/flex-ui';
import SuggestionCard from './SuggestionCard';

import {getVoiceSuggestions} from '../../helpers/GetVoiceSuggestions'

import { Stack, Badge } from '@twilio-paste/core';

const AiSuggestions = (props) => {
  const [blocking, setBlocking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);

  const manager = Manager.getInstance()

  useEffect(() => {
    setBlocking(true);
    const timer = setTimeout(() => setBlocking(false), 5000);
    return () => clearTimeout(timer);
  }, [suggestions]);



  useEffect( async() => {
    if (blocking) {
      console.log('Blocking new requests for AI suggestions');
      return;
    }

    if (props.transcript && props.transcript.length <= 0) {
      console.log('Not enough transcript turns');
      return;
    }

    console.log('Getting AI suggestion');
    setLoading(true);
    await getVoiceSuggestions('en', props.transcript, manager.user.token)
        .then ((ai_suggestion) => {
            console.log('aiSuggestion', ai_suggestion, ai_suggestion.data.suggestions.length)
            if (ai_suggestion.status == true && ai_suggestion.data.suggestions.length > 0 )
                console.log('in setSuggestions')
                setSuggestions(ai_suggestion.data.suggestions)

        })
        .catch( (err) => console.warn('Error getting voice AI suggestion', err))
        .finally( () => setLoading(false))

  }, [props.transcript]);

  if (!suggestions || Object.hasOwn(suggestions, 'map')) return <></>;

  return (
    <Stack orientation={'vertical'} spacing={'space20'}>
      <Stack orientation={'horizontal'} spacing={'space20'}>
        {loading && (
          <Badge as="span" variant={'new'}>
            Fetching AI Suggestions...
          </Badge>
        )}
        {blocking && (
          <Badge as="span" variant={blocking ? 'warning' : 'success'}>
            {blocking ? 'Waiting...' : 'Ready'}
          </Badge>
        )}
      </Stack>
      {suggestions === null || (Object.hasOwn(suggestions, 'map') && <></>)}
      {suggestions.map((item, idx) => (
        <SuggestionCard suggestion={item} key={`ai-suggestion-${idx}`} />
      ))}
    </Stack>
  );
};

export default withTaskContext(AiSuggestions);