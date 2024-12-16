import React from "react";

import { Box } from '@twilio-paste/box';
import { Card } from '@twilio-paste/card';
import { Column, Grid } from '@twilio-paste/grid';
import { Heading } from '@twilio-paste/heading';
import { Paragraph } from '@twilio-paste/paragraph';
import { Stack } from '@twilio-paste/stack';
import { Text } from '@twilio-paste/text';



const styles = {
    wrapper: { margin: 20, width:'100%'}
}


const NoActiveTask = (props) => {

    let layout = (
        <div style={styles.wrapper}>
            {/* <Stack orientation="vertical" spacing={'space0'}> */}
            <Grid gutter="space30" marginTop="space100">
            <Column span={2}>&nbsp;</Column>
                <Column span={6} >

                    <Card padding="space70">
                        <Text as="div">
                        <Heading as="h2" variant="heading20">
                            {"No Active Tasks"}
                        </Heading>
                        <Paragraph>
                            “Do not worry if you have built your castles in the air. They are where they should be. Now put the foundations under them.”
                        </Paragraph>
                        <Paragraph marginBottom="space0">-- Henry David Thoreau</Paragraph>
                        </Text>
                    </Card>
                    <Box display="flex" justifyContent="center">
                        <img src={"../images/noActiveTask.png"} height={"200px"} />
                    </Box>
                
                </Column>
                <Column span={3}>&nbsp;</Column>
            </Grid>


            {/* </Stack> */}
        </div>
    )

    return layout
}

export default NoActiveTask