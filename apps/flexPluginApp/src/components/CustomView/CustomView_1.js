import React, { useState, useEffect } from "react";

import { Card } from '@twilio-paste/card';

import { Box } from '@twilio-paste/box';
import {Grid, Column } from '@twilio-paste/core/grid'
import { Heading } from '@twilio-paste/heading';
import { Paragraph } from '@twilio-paste/paragraph';

const styles = {
    wrapper : {
        margin: 20
    }
}

const CustomView_1 = (props) => {

    const [message, setMessage] = useState('This is a custom component that can display any custom view of customer or external data.');

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
                                {'Custom View 1'}
                            </Heading>
                        </Column>

                        <Column span={12}>
                            <Box display="flex" marginLeft="space60" justifyContent="space-between">
                                <Paragraph marginBottom="space0">
                                    {message}
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
export default CustomView_1;