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
        event: 'Virtual-Agent Interaction', // Replace with your event name
        properties: {
            Summary: 'The virtual agent helped Bill activate his new credit card. Bill then inquired about his credit limit - asking if it is the same as it was earlier and to increase it if it is. The virtual agent transfered Bill to a live agent for this inquiry.',
            Disposition: 'Credit Limit Inquiry',
            Sentiment: 'Positive',
            Timestamp: nowUtc 
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