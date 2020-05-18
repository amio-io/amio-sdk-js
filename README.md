# amio-sdk-js
[![CircleCI](https://circleci.com/gh/amio-io/amio-sdk-js.svg?style=shield)](https://circleci.com/gh/amio-io/amio-sdk-js) [![npm version](https://badge.fury.io/js/amio-sdk-js.svg)](https://badge.fury.io/js/amio-sdk-js)

Server-side library implementing [Amio API](https://docs.amio.io/v1.0/reference) for instant messengers. It supports API calls as well as webhooks.

> Let us know how to improve this library. We'll be more than happy if you report any issues or even create pull requests. ;-)

- [Installation](#installation)
- [Quickstart](#quickstart)
  - [send a message](#send-a-message)
  - [receive a message](#receive-a-message)
- [SDK API](#sdk-api)
  - [setup & usage](#api---setup--usage)
  - [error handling](#api---error-handling)
  - [methods](#api---methods)
  - [content builders](#api---content-builders)
- [Webhooks](#webhooks)
  - [setup & usage](#webhooks---setup--usage)
  - [event types](#webhooks---event-types)
- [Missing a feature?](#missing-a-feature)

## Prerequisities
[Signup to Amio](https://app.amio.io/signup) and create a channel before using this library.

## Installation

```bash
npm install amio-sdk-js --save
```

## Quickstart

#### Send a message
```js
const AmioApi = require('amio-sdk-js').AmioApi

const amioApi = new AmioApi({
  accessToken: 'get access token at https://app.amio.io/administration/settings/api'
})

async function sendMessage() {
  const message = await amioApi.messages.send({
    channel: {id: '{CHANNEL_ID}'},
    contact: {id: '{CONTACT_ID}'},
    content: content
  })

  return message
}
```

#### Receive a message
```js
const express = require('express')
const router = express.Router()
const WebhookRouter = require('amio-sdk-js').WebhookRouter

const amioWebhookRouter = new WebhookRouter({
    secrets: {
      '{CHANNEL_ID}':'{SECRET}'
    }
})

amioWebhookRouter.onMessageReceived(function(data) {
  console.log('new message received from contact ' + data.contact.id + 'with content ' + data.content)
})

router.post('/webhooks/amio', function (req, res) {
  amioWebhookRouter.handleEvent(req, res)
})
```

## SDK API

### API - setup & usage

```js
const AmioApi = require('amio-sdk-js').AmioApi

const amioApi = new AmioApi({
  accessToken: 'get access token at https://app.amio.io/administration/settings/api'
})

// request with async/await
const message = await amioApi.messages.send({/* message */})

// request with a promise
amioApi.messages.send({/* message */})
 .then(message => ...)
```

### API - error handling
Amio API errors keep the structure described in the [docs](https://docs.amio.io/reference#errors).

##### With async/await
```js
try{
  const message = await amioApi.messages.send({/* message */})
} catch(err){
    if (err.amioApiError) {
      console.error(err.jsonify(), err)
      return
    }

    console.error(err)
}
```

##### With promises
```js
amioApi.messages.send({/* message */})
  .then(message => ...)
  .catch(err => {
    if (err.amioApiError) {
    console.error(err.jsonify(), err)
    return
  }

  console.error(err)
})
```


### API - methods
amioApi.* | Description | Links
-|-|:-:
`channels.get(channelId)` | Get information about specified channel. | [docs](https://docs.amio.io/v1.0/reference#channels-get-channel)
`channels.list(params)` | List available channels. | [docs](https://docs.amio.io/v1.0/reference#channels-list-channels), [params](https://docs.amio.io/v1.0/reference#pagination)
`channels.create(request)` | Create a new channel. | [docs](https://docs.amio.io/v1.0/reference#channels-create-channel)
`channels.update(channelId, request)` | Update specified channel. | [docs](https://docs.amio.io/v1.0/reference#channels-update-channel)
`channels.delete(channelId)` | Delete specified channel. | [docs](https://docs.amio.io/v1.0/reference#channels-delete-channel)
`contentBuilder.typeAudio(url)` | Start building Audio content. | [sdk-docs](#api---content-builders)
`contentBuilder.typeFile(url)` | Start building File content. | [sdk-docs](#api---content-builders)
`contentBuilder.typeGeneric(payload, type)` | Start building any content. | [sdk-docs](#api---content-builders)
`contentBuilder.typeImage(url)` | Start building Image content. | [sdk-docs](#api---content-builders)
`contentBuilder.typeVideo(url)` | Start building Video content. | [sdk-docs](#api---content-builders)
`contentBuilder.typeStructure()` | Start building Structure content. | [sdk-docs](#api---content-builders)
`contentBuilder.typeText(text)` | Start building Text content. | [sdk-docs](#api---content-builders)
`contacts.get(channelId, contactId)` | Get information about a contact in specified channel. | [docs](https://docs.amio.io/v1.0/reference#contacts-get-contact)
`contacts.list(channelId, params)` | List contacts for specified channel. | [docs](https://docs.amio.io/v1.0/reference#contacts-list-contacts), [params](https://docs.amio.io/v1.0/reference#pagination)
`contacts.delete(channelId, contactId)` | Delete a contact within specified channel. | [docs](https://docs.amio.io/v1.0/reference#contacts-delete-contact)
`messages.send(message)` | Send a message to a contact. | [docs](https://docs.amio.io/v1.0/reference#messages)
`messages.list(channelId, contactId, params)` | List messages for specified channel and contact. | [docs](https://docs.amio.io/v1.0/reference#messages-list-messages), [params](https://docs.amio.io/v1.0/reference#pagination)
`notifications.send(notification)` | Send a notification to a contact. | [docs](https://docs.amio.io/v1.0/reference#notifications)
`settings.get(channelId)` | Get settings for specified channel. | [docs](https://docs.amio.io/v1.0/reference#settings-get-settings)
`settings.set(channelId, setting)` | Modify settings for specified channel. | [docs](https://docs.amio.io/v1.0/reference#settings-update-settings)

### API - content builders

Use content-builders to better structure your code. The builders represent all available message types and it's up to you
pick the right builder for the right platform.

For example, you can add a location quick reply to your question:
```js
const content = amioApi.contentBuilder.typeText('Where are you now?')
  .addQuickReply('location')
  .build()

assertEquals(content, {
  type: 'text',
  payload: 'Where are you now?',
  quick_replies: [{type: 'location'}]
})
```

Then you just send the `content` in the message:
```js
amioApi.messages.send({channel, contanct, content})
```

All available builders have these methods:
- `addQuickReply(quickReply)` - adds a quick reply according to [docs](https://docs.amio.io/v1.0/reference#facebook-messenger-messages-quick-replies)
- `addQuickReply(type)` - adds a quick reply for type of *location*, *email* or *phone_number*. Suitable for quickReplies with `type` field only.
- `build()` - returns final content

Available builders are:
  - `contentBuilder.typeGeneric(payload, type)`
  - `contentBuilder.typeImage(url)`
  - `contentBuilder.typeVideo(url)`
  - `contentBuilder.typeStructure()`
    - use `.addNextStructure()` to create a [horizontal scroll](https://docs.amio.io/reference#facebook-messenger-messages-structure-horizontal-scroll)
  - `contentBuilder.typeText(text)`

#### API - content builders - horizontal scroll
```js
const content = contentBuilder.typeStructure()
        .setText('structure 1')
        .addNextStructure()
        .setText('structure 2')
        .build();

assertEquals(content, {
  type: 'structure',
  payload: [
    {text: 'structure 1'},
    {text: 'structure 2'}
  ]
})
```

## Webhooks

Central logic to handle webhooks coming from Amio is **WebhookRouter**. What does it do?
- It responds OK 200 to Amio.
- It verifies [X-Hub-Signature](https://docs.amio.io/v1.0/reference#security).
- It routes events to handlers (e.g. event `message_received` to a method registered in `amioWebhookRouter.onMessageReceived()`)

### Webhooks - setup & usage
1. Attach raw body to requests.
```js
const bodyParser = require('body-parser');
const attachRawBody = require('amio-sdk-js').attachRawBody;
app.use(bodyParser.json({
  verify: attachRawBody
}))
```


2. Setup webhook routing
```js
const express = require('express')
const router = express.Router()
const WebhookRouter = require('amio-sdk-js').WebhookRouter

const amioWebhookRouter = new WebhookRouter({
    secrets: {
      // CHANNEL_ID: SECRET
      // !!! CHANNEL_ID must be a string. The numbers can be converted to a different value
      // get CHANNEL_ID at https://app.amio.io/administration/channels/
      // get SECRET at https://app.amio.io/administration/channels/{{CHANNEL_ID}}/webhook
      '15160185464897428':'thzWPzSPhNjfdKdfsLBEHFeLWW'
    }
    // xhubEnabled: false // disables X-Hub-Signature verification, do it at your own risk only
})

// add secret dynamically
amioWebhookRouter.setSecret('48660483859995133', 'fdsafJzSPhNjfdKdfsLBEjdfks')

// error handling, e.g. x-hub-signature is not correct
amioWebhookRouter.onError(error => console.error(error))

// assign event handlers
amioWebhookRouter.onMessageReceived(webhook => console.log('a new message from contact ${data.contact.id} was received!'))
amioWebhookRouter.onMessagesDelivered(webhook => {/* TODO */})
amioWebhookRouter.onMessagesRead(webhook => {/* TODO */})
amioWebhookRouter.onMessageEcho(webhook => {/* TODO */})
amioWebhookRouter.onPostbackReceived(webhook => {/* TODO */})
amioWebhookRouter.onOptIn(webhook => {/* TODO */})

router.post('/webhooks/amio', (req, res) => amioWebhookRouter.handleEvent(req, res))

module.exports = router
```

3. Attach router to express app
```js
const amioWebhookRouter = require('path/to/amio-webhook-router.js')
app.use('/', amioWebhookRouter)
```

### Webhooks - methods

amioWebhookRouter.* | Description
-|-
`setSecret(channelId, secret)` | Pairs a `channelId` with a `secret`. Setting `secret` for the same `channelId` twice will override the previous value.
`getSecret(channelId)` | Returns a secret if found.

### Webhooks - event types

**Facebook:**
- [Message Received](https://docs.amio.io/reference#facebook-messenger-webhooks-message-received)
- [Messages Delivered](https://docs.amio.io/reference#facebook-messenger-webhooks-messages-delivered)
- [Messages Read](https://docs.amio.io/reference#facebook-messenger-webhooks-messages-read)
- [Message Echo](https://docs.amio.io/reference#facebook-messeger-webhooks-message-echo)
- [Postback Received](https://docs.amio.io/reference#facebook-messeger-webhooks-postback-received)
- [Opt-in](https://docs.amio.io/reference#facebook-messeger-webhooks-opt-in)

**Viber Bot:**
- [Message Received](https://docs.amio.io/reference#viber-webhooks-message-received)
- [Messages Delivered](https://docs.amio.io/reference#viber-webhooks-messages-delivered)
- [Messages Read](https://docs.amio.io/reference#viber-webhooks-messages-read)
- [Message Echo](https://docs.amio.io/reference#viber-webhooks-message-echo)
- [Postback Received](https://docs.amio.io/reference#viber-webhooks-postback-received)

**Viber Business Messages:**
- [Messages Delivered](https://docs.amio.io/reference#viber-business-webhooks-messages-delivered)
- [Messages Read](https://docs.amio.io/reference#viber-business-webhooks-messages-read)
- [Message Failed](https://docs.amio.io/reference#viber-business-webhooks-message-failed)
- [Message Echo](https://docs.amio.io/reference#viber-business-webhooks-message-echo)

**SMS:**
- [Message Received](https://docs.amio.io/reference#mobile-webhooks-message-received)
- [Messages Delivered](https://docs.amio.io/reference#mobile-webhooks-messages-delivered)
- [Message Failed](https://docs.amio.io/reference#mobile-webhooks-message-failed)

## Debugging

To enable logging for debugging purposes, set the following environment variable:

variable | value
---|---
process.env.DEBUG | amio-sdk-js:*

To narrow down logs even further, replace the `*` wildcard with a specific endpoint.


## Missing a feature?

File an issue or create a pull request. If you need a quick solution, use the prepared [axios http client](https://github.com/axios/axios):

```js
const amioHttpClient = require('amio-sdk-js').amioHttpClient

amioHttpClient.get('/v1/messages')
    .then(response => {
      // ...
    })
```
