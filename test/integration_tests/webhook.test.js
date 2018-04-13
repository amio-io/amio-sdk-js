const  WebhookRouter = require('../../index').WebhookRouter
const xHubSignatureUtils = require('./../../lib/x-hub-signature.utils')
const expect = require('chai').expect
const moment = require('moment')

let webhookRouter = null

describe('Webhooks', function () {

  before(function () {
    const settings = {
      appSecret: 'test-secret'
    }
    webhookRouter = new WebhookRouter(settings)
  })

  it('EVENT message_received', (done) => {
    const event = 'message_received'
    const testTimestamp = '2016-10-06T13:42:48Z'
    const messageId = '151730312500791'
    const webhookEvent = getTestMessageEvent(event, testTimestamp, messageId)

    testWebhook(webhookRouter.onMessageReceived.bind(webhookRouter), testTimestamp, webhookEvent, done)
  })

  it('EVENT message_echo', done => {
    const event = 'message_echo'
    const testTimestamp = '2016-11-06T13:42:48Z'
    const messageId = '151730312500800'
    const webhookEvent = getTestMessageEvent(event, testTimestamp, messageId)

    testWebhook(webhookRouter.onMessageEcho.bind(webhookRouter), testTimestamp, webhookEvent, done)
  })

  it('EVENT message_delivered', done => {
    const testTimestamp = '2016-11-06T13:42:48Z'
    const messageId = '151730312500800'
    const webhookEvent = getTestMessagesDeliveredEvent(testTimestamp, messageId)

    testWebhook(webhookRouter.onMessagesDelivered.bind(webhookRouter), testTimestamp, webhookEvent, done)
  })


  it('EVENT message_read', done => {
    const testTimestamp = '2016-11-06T13:42:48Z'
    const lastReadTimestamp = moment()
    const webhookEvent = getTestMessagesReadEvent(testTimestamp, lastReadTimestamp)

    testWebhook(webhookRouter.onMessagesRead.bind(webhookRouter), testTimestamp, webhookEvent, done)
  })
})

function verifyWebhookEvent(testTimestamp, eventData, done) {
  return async (data, timestamp) => {
    expect(timestamp).to.eql(testTimestamp)
    expect(data).to.eql(eventData)
    done()
  }
}

function getTestMessageEvent (event, timestamp, id) {
  return {
    event,
    timestamp,
    data: {
      id,
      channel: {
        id: '151730312500791',
        type: 'facebook_messenger',
        name: 'Amio Tests'
      },
      contact: {
        id: '1419024554891329'
      },
      content: {
        type: 'text',
        payload: 'Test message'
      }
    }
  }
}

function getTestMessagesDeliveredEvent (timestamp, id) {
  return {
    event: 'messages_delivered',
    timestamp,
    data: {
      channel: {
        id: '151730312500791',
        type: 'facebook_messenger',
      },
      contact: {
        id: '1419024554891329'
      },
      messages: [{id}]
    },
  }
}

function getTestMessagesReadEvent (timestamp, lastReadTimestamp) {
  return {
    event: 'messages_read',
    timestamp: timestamp,
    data: {
      channel: {
        id: '151730312500791',
        type: 'facebook_messenger',
      },
      contact: {
        id: '1419024554891329'
      },
      last_read_timestamp: lastReadTimestamp
    }
  }
}

function testWebhook(onMethod, testTimestamp, webhookEvent, done) {
  onMethod(verifyWebhookEvent(testTimestamp, webhookEvent.data, done))
  const req = {
    header: () => xHubSignatureUtils.calculateXHubSignature('test-secret', JSON.stringify(webhookEvent)),
    body: webhookEvent
  }
  const res = {sendStatus: () => {}}
  webhookRouter.handleEvent(req, res)
}
