# amio-sdk-js
Server-side library implementing [Amio](https://amio.io/) API for instant messengers. It covers API calls and webhooks.

[![CircleCI](https://circleci.com/gh/amio-io/amio-sdk-js.svg?style=shield)](https://circleci.com/gh/amio-io/amio-sdk-js) [![npm version](https://badge.fury.io/js/amio-sdk-js.svg)](https://badge.fury.io/js/amio-sdk-js)

Let us know how to improve this library. We'll be more than happy if you report any issues or even create pull requests. ;-)

- [Installation](#installation)
- [API](#api)
  - [setup & usage](#api---setup--usage)
  - [error handling](#api---error-handling)
  - [methods](#api---methods)
- [Webhooks](#webhooks)
  - [setup & usage](#webhooks---setup--usage)
  - [event types](#webhooks---event-types) 
- [Missing a feature?](#missing-a-feature)
  
## Prerequisities

You need to [create an account](https://app.amio.io/signup) before you can use this library.

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
amioApi.* | Description | Links
-|-|:-:
`channels.get(channelId)` | Get information about specified channel. | [docs](https://docs.amio.io/v1.0/reference#channels-get-channel)
`channels.list(params)` | List available channels. | [docs](https://docs.amio.io/v1.0/reference#channels-list-channels), [params](https://docs.amio.io/v1.0/reference#pagination)
`channels.create(request)` | Create a new channel. | [docs](https://docs.amio.io/v1.0/reference#channels-create-channel)
`channels.update(channelId, request)` | Update specified channel. | [docs](https://docs.amio.io/v1.0/reference#channels-update-channel)
`channels.delete(channelId)` | Delete specified channel. | [docs](https://docs.amio.io/v1.0/reference#channels-delete-channel)
`contacts.get(channelId, contactId)` | Get information about a contact in specified channel. | [docs](https://docs.amio.io/v1.0/reference#contacts-get-contact)
`contacts.list(channelId, params)` | List contacts for specified channel. | [docs](https://docs.amio.io/v1.0/reference#contacts-list-contacts), [params](https://docs.amio.io/v1.0/reference#pagination)
`contacts.delete(channelId, contactId)` | Delete a contact within specified channel. | [docs](https://docs.amio.io/v1.0/reference#contacts-delete-contact)
`messages.send(message)` | Send a message to a contact. | [docs](https://docs.amio.io/v1.0/reference#messages)
`messages.list(channelId, contactId, params)` | List messages for specified channel and contact. | [docs](https://docs.amio.io/v1.0/reference#messages-list-messages), [params](https://docs.amio.io/v1.0/reference#pagination)
`notifications.send(notification)` | Send a notification to a contact. | [docs](https://docs.amio.io/v1.0/reference#notifications)
`settings.get(channelId)` | Get settings for specified channel. | [docs](https://docs.amio.io/v1.0/reference#settings-get-settings)
`settings.set(channelId, setting)` | Modify settings for specified channel. | [docs](https://docs.amio.io/v1.0/reference#settings-update-settings)

## Webhooks

Central logic to handle webhooks coming from Amio is **WebhookRouter**. What does it do?
- It responds OK 200 to Amio.
- It verifies [X-Hub-Signature](https://docs.amio.io/v1.0/reference#security).
- It routes events to handlers (e.g. event `message_received` to a method registered in `amioWebhookRouter.onMessageReceived()`)

### Webhooks - setup & usage

```js
const express = require('express')
const router = express.Router()
const WebhookRouter = require('amio-sdk-js').WebhookRouter

const amioWebhookRouter = new WebhookRouter({
    secrets: {
      // CHANNEL_ID: SECRET
      // get CHANNEL_ID at https://app.amio.io/administration/channels/
      // get SECRET at https://app.amio.io/administration/channels/{{CHANNEL_ID}}/webhook
      '15160185464897428':'thzWPzSPhNjfdKdfsLBEHFeLWW',
      '48660483859995133':'fdsafJzSPhNjfdKdfsLBEjdfks'
    }
})

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
