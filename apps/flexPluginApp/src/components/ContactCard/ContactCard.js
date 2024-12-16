import React from "react";
import { withTaskContext } from "@twilio/flex-ui";

import { Flex as PasteFlex } from '@twilio-paste/flex';
import { Card } from '@twilio-paste/card';
import { Avatar } from '@twilio-paste/avatar';
import { Box } from '@twilio-paste/box';
import {Grid, Column } from '@twilio-paste/core/grid'
import { Heading } from '@twilio-paste/heading';
import { Tooltip } from '@twilio-paste/tooltip';
import { Button } from '@twilio-paste/button';
import { ListItem, UnorderedList } from '@twilio-paste/list';
import { Text } from '@twilio-paste/text';
import { Separator } from '@twilio-paste/separator';
import { Paragraph } from '@twilio-paste/paragraph';
import { Stack } from '@twilio-paste/stack';

import { EmailIcon } from '@twilio-paste/icons/cjs/EmailIcon';
import { CopyIcon } from '@twilio-paste/icons/esm/CopyIcon';
import { CallIcon } from '@twilio-paste/icons/esm/CallIcon';

import StarIcon from '@mui/icons-material/Star';


const styles = {
    wrapper : {margin: 20},
}

const ContactCard = (props) => {


    const handleCopySegmentId = (e) => {

    }

    if (props.task) {

    let layout = (
        <div>
            <Box>
                <Card padding="space70">
                    <Grid gutter="space20">
                        <Column span={2}>
                        <Avatar size="sizeIcon100" name={props.task.attributes.customerData.name} />
                        </Column>

                        <Column span={10}>
                        <Box display="flex" marginLeft="space60" justifyContent="space-between">
                            <Heading as="h2" variant="heading30" marginBottom="space0">
                            { props.task.attributes.customerData.name}
                            </Heading>
                            <Box>
                            <Tooltip text="Copy Segment ID.">
                                <Button variant="secondary" size="small" onClick={(e) => handleCopySegmentId()}>
                                <CopyIcon decorative />
                                </Button>
                            </Tooltip>
                            </Box>
                        </Box>
                        <UnorderedList marginBottom="space0" listStyleType="">
                            <ListItem>
                            <PasteFlex vAlignContent="center">
                                <StarIcon sx={{ color: '#FFD700', width: '1.25rem', height: '1.25rem' }} />
                                <Text as={'div'} marginLeft="space30">
                                {props.task.attributes.customerData.loyaltyTier}
                                </Text>
                            </PasteFlex>
                            </ListItem>
                            <ListItem>
                            <PasteFlex>
                                <EmailIcon decorative />
                                <Text as={'div'} marginLeft="space30">
                                {props.task.attributes.customerData.email}
                                </Text>
                            </PasteFlex>
                            </ListItem>

                            <ListItem>
                            <PasteFlex>
                                <CallIcon decorative />
                                <Text as={'div'} marginLeft="space30">
                                {props.task.attributes.customerData.phoneNumber}
                                </Text>
                            </PasteFlex>
                            </ListItem>
                        </UnorderedList>
                        </Column> 
                        <Column span={12}>
                        <Separator orientation={'horizontal'} verticalSpacing="space40" />
                        <Stack orientation={'vertical'} spacing={'space20'}>
                        <Heading as={'h2'} variant={'heading40'} marginBottom="space0">
                            Closest Store
                        </Heading>
                        <Paragraph marginBottom="space0">{'1234 Happy Canyon Way'}</Paragraph>
                        <Paragraph marginBottom="space0">
                            {'Somewhere, CA 80210'}
                        </Paragraph>
                        </Stack>                            
                        </Column>                                 
                    </Grid>
                </Card>
            </Box>


        </div>
    )
    return layout

    } else {
        let layout = (
            <div>
                <Text>
                    {'No task yet!'}
                </Text>
            </div>
        )
        return layout
    }

}
export default withTaskContext(ContactCard)