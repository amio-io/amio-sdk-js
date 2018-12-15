const WebhookRouter = require('../../index').WebhookRouter
const xHubSignatureUtils = require('../../lib/webhook/x-hub-signature.utils')
const expect = require('chai').expect
const moment = require('moment')
const timeout = ms => new Promise(res => setTimeout(res, ms))

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

  it('ERROR wrong secret for a channel', done => {
    const webhookEvent = createError(channelIdOk, `Failed to verify X-Hub-Signature for "channel.id" ${channelIdOk}`)
    webhookRouter = new WebhookRouter({
      secrets: {
        [channelIdOk]: 'test-secret'
      }
    })
    testError(webhookRouter.onError.bind(webhookRouter), webhookEvent, done, 'wrong-secret')
  })

  it('ERROR secret not set for a channel', done => {
    const channelId = 'non-existent-channel-id'
    const webhookEvent = createError(channelId, `Failed to verify X-Hub-Signature. Channel with id "non-existent-channel-id" is missing webhook secret.`)
    webhookRouter = new WebhookRouter({
      secrets: {
        [channelIdOk]: 'test-secret'
      }
    })
    testError(webhookRouter.onError.bind(webhookRouter), webhookEvent, done, 'wrong-secret')
  })

  it('ERROR no secret specified', () => {
    expect(() => new WebhookRouter()).to.throw('Define at least 1 secret.')
    expect(() => new WebhookRouter({})).to.throw('Define at least 1 secret.')
    expect(() => new WebhookRouter({secrets: {}})).to.throw('Define at least 1 secret.')
    expect(() => new WebhookRouter({secrets: {'channel': 'secret'}})).to.not.throw()
  })

  it('EVENT message_received', (done) => {
    const event = 'message_received'
    const testTimestamp = '2016-10-06T13:42:48Z'
    const messageId = '151730312500791'
    const webhookEvent = createEventMessageReceived(event, testTimestamp, messageId)

    testWebhook(webhookRouter.onMessageReceived.bind(webhookRouter), testTimestamp, webhookEvent, done)
  })

  it('EVENT message_echo', done => {
    const event = 'message_echo'
    const testTimestamp = '2016-11-06T13:42:48Z'
    const messageId = '151730312500800'
    const webhookEvent = createEventMessageReceived(event, testTimestamp, messageId)

    testWebhook(webhookRouter.onMessageEcho.bind(webhookRouter), testTimestamp, webhookEvent, done)
  })

  it('EVENT message_delivered', done => {
    const testTimestamp = '2016-11-06T13:42:48Z'
    const messageId = '151730312500800'
    const webhookEvent = createEventMessagesDelivered(testTimestamp, messageId)

    testWebhook(webhookRouter.onMessagesDelivered.bind(webhookRouter), testTimestamp, webhookEvent, done)
  })


  it('EVENT message_read', done => {
    const testTimestamp = '2016-11-06T13:42:48Z'
    const lastReadTimestamp = moment()
    const webhookEvent = createEventMessagesRead(testTimestamp, lastReadTimestamp)

    testWebhook(webhookRouter.onMessagesRead.bind(webhookRouter), testTimestamp, webhookEvent, done)
  })

  it('EVENT postback', done => {
    const testTimestamp = '2016-11-06T13:42:48Z'
    const webhookEvent = createEventPostback(testTimestamp)

    testWebhook(webhookRouter.onPostbackReceived.bind(webhookRouter), testTimestamp, webhookEvent, done)
  })

  it('EVENT opt_in', done => {
    const testTimestamp = '2016-11-06T13:42:48Z'
    const webhookEvent = OptIn(testTimestamp)

    testWebhook(webhookRouter.onOptIn.bind(webhookRouter), testTimestamp, webhookEvent, done)
  })
})

function verifyWebhookEvent(testTimestamp, eventData, done) {
  return async webhook => {
    expect(webhook.timestamp).to.eql(testTimestamp)
    expect(webhook.data).to.eql(eventData)
    done()
  }
}

function verifyError(eventData, done) {
  return async webhook => {
    expect(webhook.data.error).to.eql(eventData.error)
    done()
  }
}

function createEventMessageReceived(event, timestamp, id) {
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

function createError(channelId, error) {
  return {
    event: 'webhook_error',
    data: {
      channel: {
        id: channelId
      },
      error
    }
  }
}

async function testError(onMethod, webhookEvent, done, secret) {
  await onMethod(verifyError(webhookEvent.data, done))
  const Readable = require('stream').Readable;
  const req = {
    header: () => xHubSignatureUtils.calculateXHubSignature(secret, JSON.stringify(webhookEvent)),
    body: webhookEvent,
    rawBody: Buffer.from(JSON.stringify(webhookEvent), 'utf-8')
  }
  const res = {
    sendStatus: () => {
    }
  }
  await webhookRouter.handleEvent(req, res)
    .catch(e => {
      done(e)
    })

}

async function testWebhook(onMethod, testTimestamp, webhookEvent, done, secret = 'test-secret') {
  await timeout(100)
  onMethod(verifyWebhookEvent(testTimestamp, webhookEvent.data, done))
  const req = {
    header: () => xHubSignatureUtils.calculateXHubSignature(secret, JSON.stringify(webhookEvent)),
    body: webhookEvent,
    rawBody: Buffer.from(JSON.stringify(webhookEvent), 'utf-8')
  }
  const res = {
    sendStatus: () => {
    }
  }
  await webhookRouter.handleEvent(req, res)
    .catch(e => {
      done(e)
    })
}
