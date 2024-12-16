
import React from "react";

import { withTaskContext } from "@twilio/flex-ui";

import NoActiveTask from "./NoActiveTask";
import RetailView from "./RetailView";

const styles = {
    wrapper : { margin: 20, width:'75%'}
}

const RetailWrapper = (props) => {

    const task = props.task

    // if (props.task) {
    //      console.log('task exist', props.task)
    // } else {
    //     console.log( 'task no exist')
    // }


    let layout = (
        <div style={styles.wrapper}>
            { 
            (task === undefined)? 
                <NoActiveTask key={"noActiveTask"} /> 
                : <RetailView key={"retailView"} /> 
            }

            {/* <RetailView key={"retailView"} />  */}

        </div>
    )

    return layout
}
export default withTaskContext(RetailWrapper)