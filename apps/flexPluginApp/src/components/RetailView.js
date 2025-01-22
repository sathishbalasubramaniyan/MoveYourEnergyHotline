import React from "react";

import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@twilio-paste/tabs';
import { Table, THead, Tr, Th, TBody, Td, TFoot} from '@twilio-paste/core/table'
import {Grid, Column } from '@twilio-paste/core/grid'
import { Separator } from '@twilio-paste/separator';

import ContactCard from "./ContactCard/ContactCard";
import ConversationSummary from "./ConversationSummary"

import CustomView_1 from "./CustomView/CustomView_1";
import CustomView_2 from "./CustomView/CustomView_2"

import CustomView_Crm from "./CustomView/CustomView_Crm";
import CustomView_Search from "./CustomView/CustomView_Search";



const orders = [
    {orderNumber: 12345, orderDate : '12/20/2023', amount : '$98.98', trackingNumber: '12345vx87gh123',orderItems : [
        { item: 1, description: 'Twilio Geometric Chucks', size: '12', amount: '$49.99', quantity: '1'},
        { item: 2, description: 'Twilio Inifinity Watch', size: '', amount: '$49.99', quantity: '1'},
    ]}
]

const styles = {
    tableWrapper: {width: '100%'},
    adjust: {width: '75%'},
    convSummary: { width: '80%', marginBottom: 20},
    table : {
        border : '1px solid #ededed',
    },
    orderRow : { border : '1px solid #ededed', height: 30 },
    orderCell: {width: '25%', border : '1px solid #ededed', padding: 10},
    orderHeading: { fontSize : 24},
    orderTitle: {fontSize : 14 },

    orderItemRow : { border : '1px solid #ededed', height: 30 },
    orderItemCell: {width: '20%', border : '1px solid #ededed', padding: 10, textAlign: 'left'},
    orderItemHeading: { fontSize : 24},
  
}

const RetailView = (props) => {

    console.log('transcription', process.env.USE_TRANSCRIPTION)

    let layout = (
        <div style={styles.adjust}>
            <Tabs baseId="retail-tabs">
                <TabList aria-label="details-tab">
                    <Tab>Details</Tab>                 
                </TabList>

                <TabPanels>
                    {/* Customer Details Panel Here */}
                    <TabPanel>

                        <Grid gutter="space30">
                                
                                <Column span={10}>
                                    <div style={styles.convSummary}>
                                    <ConversationSummary />

                                    </div>
                                    
                                </Column>                                
                        </Grid>
                        <Separator orientation={'horizontal'} verticalSpacing="space40" />
                    </TabPanel>                    
                </TabPanels>

            </Tabs>
        </div>
    )
    return layout
}
export default RetailView