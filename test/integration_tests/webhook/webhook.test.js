const WebhookRouter = require('../../../index').WebhookRouter
const xHubSignatureUtils = require('../../../lib/webhook/x-hub-signature.utils')
const expect = require('chai').expect
const moment = require('moment')

let webhookRouter = null
const channelIdOk = '151730312500791'

describe('Webhooks', function () {

  before(function () {
    const settings = {
      secrets: {
        [channelIdOk]: 'test-secret'
      }
    }
    webhookRouter = new WebhookRouter(settings)
  })

  it('ERROR: default secret: wrong secret for a channel', async () => {
    const webhookEvent = createError(channelIdOk, `Failed to verify X-Hub-Signature for "channel.id" ${channelIdOk}`)
    webhookRouter = new WebhookRouter({
      secrets: {
        [channelIdOk]: 'test-secret'
      }
    })
    await testError(webhookRouter.onError.bind(webhookRouter), webhookEvent, 'wrong-secret')
  })

  it('ERROR: default secret: secret not set for a channel', async () => {
    const channelId = 'non-existent-channel-id'
    const webhookEvent = createError(channelId, `Failed to verify X-Hub-Signature. Channel with id "non-existent-channel-id" is missing webhook secret.`)
    webhookRouter = new WebhookRouter({
      secrets: {
        [channelIdOk]: 'test-secret'
      }
    })
    await testError(webhookRouter.onError.bind(webhookRouter), webhookEvent, 'wrong-secret')
  })

  it('ERROR: addSecret(): wrong secret for a channel', async () => {
    const webhookEvent = createError(channelIdOk, `Failed to verify X-Hub-Signature for "channel.id" ${channelIdOk}`)
    webhookRouter = new WebhookRouter()
    webhookRouter.addSecret(channelIdOk, 'test-secret')
    await testError(webhookRouter.onError.bind(webhookRouter), webhookEvent, 'wrong-secret')
  })

  it('ERROR: addSecret(): secret not set for a channel', async () => {
    const channelId = 'non-existent-channel-id'
    const webhookEvent = createError(channelId, `Failed to verify X-Hub-Signature. Channel with id "non-existent-channel-id" is missing webhook secret.`)
    webhookRouter = new WebhookRouter()
    webhookRouter.addSecret(channelIdOk, 'test-secret')
    await testError(webhookRouter.onError.bind(webhookRouter), webhookEvent, 'wrong-secret')
  })

  it('ERROR no secret specified', async () => {
    const webhookRouter = new WebhookRouter()
    const webhookEvent = createEvent('message_echo')
    const req = mockRequest(webhookEvent, 'wrong')

    try{
      webhookRouter.handleEvent(req, mockResponse())
      throw Error('test should have failed')
    } catch(e){
      expect(e.message).to.equal('Define at least 1 secret.')
    }
  })

  it('XHubSignature is disabled - signature is wrong but success callback is dispatched anyway', async () => {
    const webhookRouter = new WebhookRouter({xhubEnabled: false})
    const webhookEvent = createEvent('message_echo')
    const req = mockRequest(webhookEvent, 'wrong')
    setTimeout(() => webhookRouter.handleEvent(req, mockResponse()), 0)

    // expect - if test timeouts, one of the on* methods was probably not called
    await new Promise(resolve => webhookRouter.onMessageEcho(resolve))
  })

  it('EVENT message_received', async () => {
    const event = 'message_received'
    const testTimestamp = '2016-10-06T13:42:48Z'
    const messageId = '151730312500791'
    const webhookEvent = createEvent(event, testTimestamp, messageId)

    await testWebhook(webhookRouter.onMessageReceived.bind(webhookRouter), testTimestamp, webhookEvent)
  })

  it('EVENT message_echo', async () => {
    const event = 'message_echo'
    const testTimestamp = '2016-11-06T13:42:48Z'
    const messageId = '151730312500800'
    const webhookEvent = createEvent(event, testTimestamp, messageId)

    await testWebhook(webhookRouter.onMessageEcho.bind(webhookRouter), testTimestamp, webhookEvent)
  })

  it('EVENT message_delivered', async () => {
    const testTimestamp = '2016-11-06T13:42:48Z'
    const messageId = '151730312500800'
    const webhookEvent = createEventMessagesDelivered(testTimestamp, messageId)

    await testWebhook(webhookRouter.onMessagesDelivered.bind(webhookRouter), testTimestamp, webhookEvent)
  })


  it('EVENT message_read', async () => {
    const testTimestamp = '2016-11-06T13:42:48Z'
    const lastReadTimestamp = moment()
    const webhookEvent = createEventMessagesRead(testTimestamp, lastReadTimestamp)

    await testWebhook(webhookRouter.onMessagesRead.bind(webhookRouter), testTimestamp, webhookEvent)
  })

  it('EVENT notification', async () => {
    const testTimestamp = '2016-11-06T13:42:48Z'
    const webhookEvent = createEventNotification(testTimestamp)

    await testWebhook(webhookRouter.onNotificationReceived.bind(webhookRouter), testTimestamp, webhookEvent)
  })

  it('EVENT postback', async () => {
    const testTimestamp = '2016-11-06T13:42:48Z'
    const webhookEvent = createEventPostback(testTimestamp)

    await testWebhook(webhookRouter.onPostbackReceived.bind(webhookRouter), testTimestamp, webhookEvent)
  })

  it('EVENT opt_in', async () => {
    const testTimestamp = '2016-11-06T13:42:48Z'
    const webhookEvent = OptIn(testTimestamp)

    await testWebhook(webhookRouter.onOptIn.bind(webhookRouter), testTimestamp, webhookEvent)
  })
})

function verifyWebhookEvent(testTimestamp, eventData, cb) {
  return async webhook => {
    expect(webhook.timestamp).to.eql(testTimestamp)
    expect(webhook.data).to.eql(eventData)
    cb()
  }
}

function verifyError(eventData, cb) {
  return async webhook => {
    expect(webhook.data.error).to.eql(eventData.error)
    cb()
  }
}

function createEvent(event, timestamp, id) {
  return {
    event,
    timestamp,
    data: {
      id,
      channel: {
        id: channelIdOk,
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

function createEventNotification(timestamp) {
  return {
    event: 'notification',
    timestamp,
    data: {
      channel: {
        id: channelIdOk,
        type: 'facebook_messenger',
      },
      contact: {
        id: '1419024554891329'
      },
      type: 'custom',
      payload: {}
    }
  }
}

function createEventPostback(timestamp) {
  return {
    event: 'postback',
    timestamp,
    data: {
      channel: {
        id: channelIdOk,
        type: 'facebook_messenger',
      },
      contact: {
        id: '1419024554891329'
      },
      postback: {
        payload: 'test payload'
      }
    }
  }
}

function createEventMessagesDelivered(timestamp, id) {
  return {
    event: 'messages_delivered',
    timestamp,
    data: {
      channel: {
        id: channelIdOk,
        type: 'facebook_messenger',
      },
      contact: {
        id: '1419024554891329'
      },
      messages: [{id}]
    },
  }
}

const OptIn = (timestamp) => ({
  event: 'opt_in',
  timestamp,
  data: {
    channel: {
      id: channelIdOk,
      type: 'facebook_messenger'
    },
    contact: {
      id: '1419024554891329'
    },
    opt_in: {
      type: 'send_to_messenger',
      payload: 'test payload'
    }
  }
})

function createEventMessagesRead(timestamp, lastReadTimestamp) {
  return {
    event: 'messages_read',
    timestamp: timestamp,
    data: {
      channel: {
        id: channelIdOk,
        type: 'facebook_messenger',
      },
      contact: {
        id: '1419024554891329'
      },
      last_read_timestamp: lastReadTimestamp
    }
  }
}

function createError(channelId, error, event = 'webhook_error') {
  return {
    event,
    timestamp: '2016-10-06T13:42:48Z',
    data: {
      channel: {
        id: channelId
      },
      error
    }
  }
}

function testError(onMethod, webhookEvent, secret) {
  return new Promise(async resolve => {
    await onMethod(verifyError(webhookEvent.data, resolve))
    const req = mockRequest(webhookEvent, secret)
    const res = mockResponse()

    webhookRouter.handleEvent(req, res)
  })
}

function testWebhook(onMethod, testTimestamp, webhookEvent, secret = 'test-secret') {
  return new Promise(async resolve => {
    onMethod(verifyWebhookEvent(testTimestamp, webhookEvent.data, resolve))
    const req = mockRequest(webhookEvent, secret)
    const res = mockResponse()

    webhookRouter.handleEvent(req, res)
  })
}

function mockResponse() {
  const statusHolder = {}

  return {
    sendStatus: status => statusHolder.status = status,
    getStatus: () => statusHolder.status
  }
}

function mockRequest(webhookEvent, secret) {
  return {
    header: () => xHubSignatureUtils.calculateXHubSignature(secret, JSON.stringify(webhookEvent)),
    body: webhookEvent,
    rawBody: Buffer.from(JSON.stringify(webhookEvent), 'utf-8')
  }
}
