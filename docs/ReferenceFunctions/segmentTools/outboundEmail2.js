exports.handler = function(context, event, callback) {
    
    const { Analytics } = require('@segment/analytics-node');

    const analytics = () => new Analytics({
      flushAt: 1,
      writeKey: context.YOUR_SEGMENT_WRITE_KEY,
    })
    .on('error', console.error);
    
    // Get the current date-time in UTC
    const nowUtc = new Date().toISOString();
    
    // Construct the event you want to track
    // Replace with your actual event data
    const segmentEvent = {
        userId: 'owl123', // Replace with the ID of the user
        event: 'Outbound Email', // Replace with your event name
        properties: {
            title: 'Airport Lounge Upgrade',
            trigger: 'Flex Agent Initiated',
            campaign: 'October 2024 lounge upgrades'
        }
    };
    
    // Send the event to Segment
    analytics().track(segmentEvent, (err) => {
        if (err) {
            console.error('Error sending event to Segment:', err);
            // Handle the error accordingly
            callback(err);
        } else {
            console.log('Event sent to Segment successfully');
            // Continue with your Twilio Function logic if necessary
            callback(null, 'Event sent to Segment successfully');
        }
    });
};