# amio-sdk-js

Server-side library implementing [Amio](https://amio.io/) API for instant messengers. It covers API calls and webhooks.

We'll be more than happy if you report any issues or even create pull requests ;-). Let us know how to improve this lib, thank you!

- [Installation](#installation)
- [API](#api)
  - [setup & usage](#api---setup--usage)
  - [error handling](#api---error-handling)
  - [methods](#api---methods)
- [Webhooks](#webhooks)
  - [setup & usage](#webhooks---setup--usage)
  - [event types](#webhooks---event-types) 
  

## Installation

```bash
npm install amio-sdk-js --save
```

## API 

### API - setup & usage

```js
const AmioApi = require('amio-sdk-js').AmioApi

const amioApi = new AmioApi({
    accessToken: 'get access token from https://app.amio.io/administration/settings/api'
})

// example request
amioApi.messages.send({/* message */})
```

### API - error handling
Amio API errors keep the structure described in the [docs](https://docs.amio.io/reference#errors).

```js
try{
  // ...
} catch(err){
    if (err.amioApiError) {
      console.error(err.jsonify(), err) 
      return
    }
    
    console.error(err) 
}
```

### API - methods

 REST | js | Description  
----------------------------|---|-------------
POST&nbsp;/v1/messages | `messages.send(message)` | Send a message to a contact. There are different message types for every platform ([FB](https://docs.amio.io/v1.0/reference#facebook-messenger-messages-text), [Viber](https://docs.amio.io/v1.0/reference#viber-messages-text)).


## Webhooks

Central logic to handle webhooks coming from Amio is **WebhookRouter**. What does it do?
- It responds OK 200 to Amio .
- It verifies [X-Hub-Signature](https://docs.amio.io/v1.0/reference#security).
- It routes events to handlers (e.g. event `message_received` to a method registered in `amioWebhookRouter.onMessageReceived()`)

### Webhooks - setup & usage

1. Setup **WebhookRouter**. 

```js
const WebhookRouter = require('amio-sdk-js').WebhookRouter

const amioWebhookRouter = new WebhookRouter({
    secretToken: 'get secret at https://app.amio.io/administration/channels/{{CHANNEL_ID}}/webhook'
})

// error handling
amioWebhookRouter.onError(error => console.error(error))

// assign event handlers 
amioWebhookRouter.onMessageReceived(handleMessageReceived)
amioWebhookRouter.onMessagesDelivered(handleMessageDelivered)
amioWebhookRouter.onMessagesRead(handleMessagesRead)
amioWebhookRouter.onMessageEcho(handleMessageEcho)
```

2. Route incoming requests to **WebhookRouter**. You will probably **NOT** want to use a common error handler!!!
```js
// example with Express.js 4
const express = require('express')
const router = express.Router()

// EITHER simply direct traffic to WebhookRouter
router.post('/webhooks/amio', amioWebhookRouter.handleEvent)

// OR handle errors too
router.post('/webhooks/amio', async (req, res) => {
    try {
        await amioWebhookHandler.handleEvent(req, res)
    } catch (err) {
        if (err.amioApiError) {
          console.error(err.jsonify(), err) 
          return
        }
        
        console.error(err) 
    }
})
``` 


3. Implement **event handlers**. 
```js 
amioWebhookRouter.onMessageReceived((data, timestamp) => {
    console.log('a new message from contact ${data.contact.id} was received!')
})
``` 

### Webhooks - event types

**Facebook:**
- [Message Received](https://docs.amio.io/reference#facebook-messenger-webhooks-message-received) 
- [Messages Delivered](https://docs.amio.io/reference#facebook-messenger-webhooks-messages-delivered) 
- [Messages Read](https://docs.amio.io/reference#facebook-messenger-webhooks-messages-read) 
- [Message Echo](https://docs.amio.io/reference#facebook-messeger-webhooks-message-echo) 
- [Postback Received](https://docs.amio.io/reference#facebook-messeger-webhooks-postback-received) 
- [Opt-in](https://docs.amio.io/reference#facebook-messeger-webhooks-opt-in)

**Viber:**
- [Message Received](https://docs.amio.io/reference#viber-webhooks-message-received)
- [Messages Delivered](https://docs.amio.io/reference#viber-webhooks-messages-delivered) 
- [Message Failed](https://docs.amio.io/reference#viber-webhooks-message-failed) 
- [Messages Read](https://docs.amio.io/reference#viber-webhooks-messages-read) 
- [Message Echo](https://docs.amio.io/reference#viber-webhooks-message-echo) 
- [Postback Received](https://docs.amio.io/reference#viber-webhooks-postback-received) 
