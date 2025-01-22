import React, { useState, useEffect } from "react";
import { withTaskContext } from "@twilio/flex-ui";

import { Card } from '@twilio-paste/card';

import { Box } from '@twilio-paste/box';
import {Grid, Column } from '@twilio-paste/core/grid'
import { Heading } from '@twilio-paste/heading';
import { Paragraph } from '@twilio-paste/paragraph';
import { Text } from '@twilio-paste/text';

import { getConverstationSummary } from "../helpers/GetConversationSummary";
import client from '../utils/sdk-clients/sync/SyncClient';


const styles = {
    wrapper : {
        margin: 20
    }
}

const ConversationSummary = (props) => {

    const [message, setMessage] = useState('There is no summary available yet as the agent is about to start a conversation with the customer');
    const [transcript, setTranscript] = useState([]);

    /*
    This is where you will make a fetch call to your serverless function (sample function found in the serverless-functions
    folder in this repository). 

    Uncomment the following useEffect block of code and replace the URL with your serverless function URL, make 
    any other changes as needed. 
    */
    useEffect(() => {
        const fetchTranscriptFromSync = async () => {   
                const map = await client.map("test");
                const mapItem = await map.get(props.task.attributes.customerData.phone);
                // Get the transcript from the Sync Document                
                setTranscript(mapItem.descriptor.data.transcript);
        };

        fetchTranscriptFromSync();
    }, []);
    
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
    
    //const transcript = JSON.parse(props.task.attributes.transcriptObj);
    let layout = (
        <div style={{ width: '60%' }}>
            <Box>
                <Card padding="space70">
                    <Grid gutter="space20">
                        <Column span={10}>
                            <Heading as="h4" variant="heading40" marginBottom="space0">
                                {'Self-Service (CR) Summary'}
                            </Heading>
                        </Column>

                        <Column span={10}>
                            <Box display="flex" marginLeft="space60" justifyContent="space-between">
                                <Text as="p" marginBottom="space40" textAlign="justify">
                                    {props.task.attributes.conversationSummary}
                                </Text>
                            </Box>
                        </Column> 

                        <Column span={10}>
                            <Heading as="h4" variant="heading40" marginBottom="space0">
                                {'Conversation Transcript'}
                            </Heading>
                        </Column>

                        <Column span={10}>                            
                            {transcript.map((item) => (
                                <Box display="flex" marginLeft="space60" justifyContent="space-between" overflow="auto" maxHeight="200px">
                                    <Text as="p" marginBottom="space40" textAlign="justify" style={{ color: item.role === "user"?"#44753b":"#e31e48" }}>{(item.role === "user"?props.task.attributes.customerData.name:"Assistant") + ": " + item.content}</Text>
                                </Box>
                            ))}                            
                        </Column> 
                    </Grid>
                </Card>
            </Box>
        </div>
    )
    return layout
}
export default withTaskContext(ConversationSummary);