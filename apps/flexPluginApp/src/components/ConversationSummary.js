import React, { useState, useEffect } from "react";
import { withTaskContext } from "@twilio/flex-ui";

import { Card } from '@twilio-paste/card';

import { Box } from '@twilio-paste/box';
import {Grid, Column } from '@twilio-paste/core/grid'
import { Heading } from '@twilio-paste/heading';
import { Paragraph } from '@twilio-paste/paragraph';

import { getConverstationSummary } from "../helpers/GetConversationSummary";


const styles = {
    wrapper : {
        margin: 20
    }
}

const ConversationSummary = (props) => {

    const [message, setMessage] = useState('There is no summary available yet as the agent is about to start a conversation with the customer');

    /*
    This is where you will make a fetch call to your serverless function (sample function found in the serverless-functions
    folder in this repository). 

    Uncomment the following useEffect block of code and replace the URL with your serverless function URL, make 
    any other changes as needed. 
    */

    
    // useEffect(() => {

    //     const getSummary = async () => {
    //         console.log('getSummary')
    //         let result = await getConverstationSummary()
    //     }

    //     getSummary()

    //     // fetch('https://your-serverless-function-url.com')
    //     //   .then(response => response.json())
    //     //   .then(data => setMessage(data.message))
    //     //   .catch(error => console.error('Error:', error));
    //   }, []);
    

    let layout = (
        <div>
            <Box>
                <Card padding="space70">
                    <Grid gutter="space20">
                        <Column span={12}>
                            <Heading as="h4" variant="heading40" marginBottom="space0">
                                {'Self-Service (CR) Summary'}
                            </Heading>
                        </Column>

                        <Column span={12}>
                            <Box display="flex" marginLeft="space60" justifyContent="space-between">
                                <Paragraph marginBottom="space0">
                                    {props.task.attributes.conversationSummary}
                                </Paragraph>
                            </Box>
                        </Column>                                  
                    </Grid>
                </Card>
            </Box>
        </div>
    )
    return layout
}
export default withTaskContext(ConversationSummary);