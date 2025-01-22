# Twilio SKO 2025 Hackathon: Move your Energy Hotline

This repository contains prototype packages for a "Move your Energy hotline" use case built using the following Twilio products
- Conversation Relay
- Verify SMS 
- Segment
- Flex Unified Profiles
- Messaging
- Sync

Instructions to deploy this demo to your Twilio account and run the app are available starting from the Prerequisites section onwards.



## Business Case

A common reason why customers call an energy retailer is to move their energy plans when moving homes. These calls are usually attended by a human agent, the agent would typically authenticate the customer first, collect the details of the move (address, moving date, plan type - electricity/gas) and organise the move. This would typically involve updating these details in the retailer's system of record such as a CRM system. This use case is ripe for automation using AI agents as many of these steps lend themselves well to automation. The "Move your Energy Hotline" does exactly that, it automates the steps in a move. The demo assumes that the energy retailer is using Segment as their CDP and hence a profile of the customer would already exist in the CDP when the customer calls into organize their move. The retailer's CRM system would likely be set up as a source to the CDP to sync user profile attributes to the CDP (outside the scope of this demo). Assuming such a setup, this demo implements the following steps when a customer calls into organize their move.
- Authenticate the customer first by verifying their full name and date of birth against the profile in the CDP. For additional security, the demo also implements Twilio Verify SMS by sending and verifying an OTP sent to the registered mobile number.
- Collect the details of the move - moving date, new address and the new energy plan type (electricity only/electricity & gas).
- Organizes the move by persisting these details gathered during the conversation as traits in the CDP and scheduling a "move" event in the CDP. (In a real-world deployment, these details would typically be synced to a Segment destination, which can be any system of record such as the CRM system itself). Then a confirmation SMS is sent to the customer summarizing the details of the move.
- At any time during the conversation, the virtual agent can transfer the call to a contact center agent in Twilio Flex with a summary of the conversation as well as the conversation transcript, if it does not know how to handle a customer request or if the customer explicitly asks to speak to a human.

Segment Unified Profiles is integral to this use case. The virtual agent personalizes the conversation based on the Segment profile which is provided as context to the LLM during the setup of Conversation Relay. In addition to greeting the customer by name, it guides the customer to select the right energy plan type at the new location based on their current energy plan in the Segment profile. Then the agent persists the conversational data as traits and events back in Segment.

The same Segment profile also powers Flex Unified Profiles, so that the contact center agent has access to the same details as the virtual agent. The contact center agent can see the relevant traits from the Segment profile in the Flex UI, AI generated customer highlights based on these traits, the external activities/Segment events (such as the "move" event) created in Segment by the virtual agent and in addition, a summary of the customer conversation with the virtual agent along with the entire conversation transcript displayed in the Flex UI through a custom plugin. This ensures that the contact center agent has the complete context necessary to serve the customer in a single pane of glass, if at all the call is transferred to the contact center. 

The obvious business benefits of this use case are
- High call containment rate for customers calling to organize their move.
- Reduced Average Handle Time for calls transferred to the contact center for organizing moves.
- Improved agent satisfaction leading to better contact center efficiency.
- Increased customer satisfaction due to personalized and faster service with reduced wait times.

## Use case scalability

While this use case is focussed on existing customers moving homes, there are many other adjacent use cases that this use case can scale to. A few of them are:

- Customers wanting to buy a new energy plan as part of moving homes. The virtual agent can provide details of available plans from relevant knowledge sources and guide the customer through purchasing a new plan including processing payment, along with organizing their move.
- Similar to the above, but a brand new prospect calling to purchase a new energy plan or transfer their energy plan from another retailer.
- A customer calling in for support regarding their existing energy plan or make changes to their existing plan, such as adding Solar to their plan.
- An existing customer calling to switch to a cheaper plan, where the virtual agent can analyze their consumption patterns/usage and provide options for cheaper plans based on relevant knowledge sources. For example, the virtual agent may advise them to switch to time-of-use tariff from flat tariff, based on their usage patterns.
- A customer calling in to know strategies to reduce their energy bill where the virtual agent can guide them with personalized tips to reduce their energy consumption referring to relevant configured knowledge sources. The virtual agent may also approve discounts for long-standing customers based on configured business rules.
- Proactively make an outbound call to assist customers when important events occur. For example, when a power surge event is sent to the CDP, make an automated outbound call to the customer to help troubleshoot/resolve the issue. 

Many of these use cases can re-use components from this demo such as the authentication framework, personalization based on Segment profiles, writing events and traits from the interaction back to Segment and leveraging Flex Unified Profiles to provide rich context to contact center agents. In fact, many of these components, the virtual agent authentication framework in particular (LLM prompts & tools integrating with Segment and Verify) can be re-used beyond energy use cases, when an existing customer calls an organization.


## Customizations

This section documents the additional customizations built for this use case on top of the [base repo](https://github.com/Kunalmighty/SKO25Flex/) from which this repo has been forked

- A base authentication framework to authenticate existing customers on inbound calls. This is a combination of LLM prompts and tools to verify the name and date of birth based on the CDP profile. After that, the tools "verifySend" and "verifyCode" are used to send a code to the customer's registered mobile number and verify the code. There are two flavours of OTP verification in the repo - One uses Twilio Verify SMS (to be used with real phone numbers in production) and the other is a Verify simulation built using plain SMS messaging. The latter is handy to test with Twilio numbers using tools such as the Twilio dev phone, as Twilio numbers filter codes sent from standard Verify templates. In the simulation, a tool generates a code and sends it to the customer's phone via SMS using a free-form template. The generated code is passed to the LLM. At the verification step, the LLM passes both the generated code and the code given by the customer to the VerifyCode tool for verification. This is meant to be used only for testing purposes during development and not in production. Production deployments should use Twilio Verify.

- The live agent handoff process has been revamped. The original repo checks the transcript of the customer utterance against phrases such as "live agent", "real person", "transfer me to a human" etc to determine whether to transfer to Flex. This approach has many disadvantages - for example, the customer may speak an unexpected phrase to request transfer to a live agent, which wouldn't match with any of the phrases checked and hence the call won't be transferred. It cannot be used to transfer the call to Flex when the customer does not explicitly ask for it, for example, when the LLM does not know how to handle a customer request. This repo moves the live agent handoff decision to the LLM by making it a part of the LLM prompt, instead of programmatically determining it in code. The LLM would make a call to the "liveAgentHandoff" tool when it decides that the call should be transferred to a live agent. This makes the live agent hand off process robust and overcomes the mentioned disadvantages.

- DTMF support - This repo adds support for DTMF. The customer can either type the digits of the verification code sent to their phone using the phone's dialpad or say the code during the verification process.

- A scheduleMove tool has been added. The LLM passes the details of the move (moving date, new address and new energy plan) to the tool. The tool updates these details as traits in the CDP profile and also adds a "Move Scheduled" event in the CDP. These traits and events would be displayed to the Flex agent if the call is transferred to Flex. The tool then sends an SMS confirmation with the details of the move to the customer. In a real deployment, this tool would update these details in the system of record such as a CRM system

- An energy surge event has also been added to the CDP and surfaced in Flex to show how the Flex agent can proactively bring up issues beyond the initial purpose of the customer's call in the conversation to assist the customer with, thus increasing customer satisfaction.

- The entire transcript of the conversation between the customer and the virtual agent is stored in Twilio Sync. It is retrieved from Twilio Sync and displayed below the conversation summary in the Flex UI. Both Conversation Relay and the Flex plugin have been enhanced to support storing and retrieving transcripts using Twilio Sync. It uses the default Sync service available in the Twilio console. The repo thus illustrates a pattern to pass transcripts from Conversation Relay to Flex and display them in Flex. In production, it is recommended to use a database to store and retrieve transcripts, as Twilio Sync has size limitations (as real-world conversations can be much longer resulting in lengthy transcripts). 

## Challenges with Voice AI for this use case

We uncovered a few challenges with using Voice AI pertaining to this use case (and other similar use cases)

- Transcribing and validating lengthy and complex names with different formats, complex spellings spoken in different languages and accents could be a challenge particularly during the authentication process. A failure to do this with reasonable accuracy could result in increased handoffs to a live agent during authentication.

- Similarly, transcribing and validating addresses could also be challenging, particularly with global deployments as address formats vary throughout the world. Some countries have long addresses and addresses can be spoken in multiple ways (Unit 1, 45 Falcon Street or 1/45 Falcon Street), state names can be abbreviated or expanded (NSW or New South Wales), Street and suburb names can be long and complex, addresses can be spoken in different languages and accents and so on. The problem gets compounded when the collected address needs to be matched against an address validation tool, which could be a requirement in production use cases. 

## Recommendations to Twilio product team

- Having specific functionality to collect names and addresses, such as prebuilt [name](https://cloud.google.com/dialogflow/cx/docs/concept/prebuilt-component/name-collection) and [address](https://cloud.google.com/dialogflow/cx/docs/concept/prebuilt-component/address-collection) components supported by Google Dialog Flow would help in use cases such as these. Integrating with an address validation API when collecting the address would also be a useful feature to have (Google DF's prebuilt address component uses the [Google Address Validation API](https://mapsplatform.google.com/maps-products/address-validation/?utm_experiment=13102154&product_exp_arm=13102154) to validate addresses when they are collected) to globally deploy use cases such as these.

## Multiple LLMs

We implemented the use case using both Chat GPT and DeepSeek LLMs. The DeepSeek implementation is in this [forked repo](https://github.com/kslamet/SKO25Flex/tree/main). The readme of that repo has a high level comparison of both the LLMs based on our testing of this use case.

## Architecture

This is the typical architecture that reflects the communications between the Flex UI (plugin) and the Twilio Cloud (Serverless Functions).

There are three (3) primary parts of this demonstration package.  They are:
- Conversation Relay Websocket server ( apps >> convRelayApp ) node process;
- Twilio Function for agent handoff ( Twilio CLI serverless process); and
- Flex Plugin ( apps >> flexPluginApp ) (Twilio CLI Flex plugin process).

>NOTE: In a development/testing environment there are three (3) processes running to support a demonstration in DEV.  These are: (1) The CR websocket server (node application) runs locally on port 3000; (2) A separate process is used to host the Twilio Function responsible for agentHandoff.  This uses the Twilio CLI and runs on port 3001; and (3) A final process is used to start the Flex UI with the plugin.  This also uses the Twilio CLI and Flex plugin running on port 3002.

&nbsp;

![Typical Twilio Architecture](/images/convRelayFlexArch.jpg)  
&nbsp;

## Prerequisites

- Twilio CLI (command line interface) : [CLI Quickstart Guide](https://www.twilio.com/docs/twilio-cli/quickstart)
- Twilio Serverless & Flex Plugin : [CLI Plugins](https://www.twilio.com/docs/twilio-cli/plugins)
- A New Flex Account
- Code editor of choice ( e.g. Visual Studio Code)


## Configure/Test/Deploy

Perform the following steps to configure, test and deploy this Twilio Flex plugin and supporting Twilio Functions.  
&nbsp;

### Step 1 : Create a new Flex Account

Use the Twilio Console to create a new Flex Account

&nbsp;

### Step 2 : Install Twilio CLI (command line interface)


1. Install CLI using the official [Twilio CLI Quickstart](https://www.twilio.com/docs/twilio-cli/quickstart)
2. Install the CLI plugins for serverless and Flex [CLI Plugins](https://www.twilio.com/docs/twilio-cli/plugins)
3. Create a [CLI profile](https://www.twilio.com/docs/twilio-cli/general-usage))

```
twilio profiles:create
```

4. Set CLI active profile

```
twilio profiles:use <ProfileName>
```

&nbsp;

### Step 3 : Install/Config of the Conversation Relay App ( socket server )

Follow the instructions in the [README](/apps/convRelayApp/README.md) file for the CR App.

### Step 4: Install/Config of the Flex Plugin

Follow the instructions in the [README](/apps/flexPluginApp/README.md) file for the Flex Plugin App.

### Step 5 (Optional): Import the example Studio Flow

There is a example [Studio Flow](/docs/studio.json) that can be used to redirect the incoming call to the Conversation Relay socket server.  Use this JSON file to import the example flow into your project.

The screenshot below illustrate this flow. Set the URI location of your websocket server.

![IncomingCallStudioFlow](/images/IncomingCallStudioFlow.jpg) 

>NOTE: Specify the URI location of your websocket server in the Studio Variable Widget.

&nbsp;

### Step 6: Launch Conversation Relay Socket Server

Use the following command to launch the CR websocket server in a local development (DEV) mode from within the root folder 'apps >> convRelayApp' :

``` 
npm run dev
```
> NOTE: This command should launch the ConvRelayApp node application on port 3000.

&nbsp;

### Step 7. Launch Twilio Functions (agenthandoff)

Use the following command to launch the Twilio server functions locally.

>NOTE: Specify that this should run on port 3001.

```
cd serverless-cr
twilio serverless start
```
&nbsp;

### Step 8. Launch the Twilio Flex Plugin

Use the following command to launch the Twilio Flex plugin locally from within the folder 'apps/flexPluginApp':

> NOTE: Specify that this should run on port 3002.

```
cd flexPluginApp
twilio flex:plugins:start
```

>NOTE: Choose port 3002 to run this Flex Plugin on.

&nbsp;
