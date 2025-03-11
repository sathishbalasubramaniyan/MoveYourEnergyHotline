# Move your Energy Hotline

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
