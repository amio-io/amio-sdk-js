const WebhookRouter = require('../../index').WebhookRouter
const xHubSignatureUtils = require('../../lib/webhook/x-hub-signature.utils')
const expect = require('chai').expect
const moment = require('moment')

let webhookRouter = null

describe('Webhooks', function () {

  before(function () {
    const settings = {
      secretToken: 'test-secret'
    }
    webhookRouter = new WebhookRouter(settings)
  })

  it('EVENT message_received', async () => {
    const event = 'message_received'
    const testTimestamp = '2016-10-06T13:42:48Z'
    const messageId = '151730312500791'
    const webhookEvent = createEventMessageReceived(event, testTimestamp, messageId)

    await testWebhook(webhookRouter.onMessageReceived.bind(webhookRouter), testTimestamp, webhookEvent)
  })

  it('EVENT message_echo', async () => {
    const event = 'message_echo'
    const testTimestamp = '2016-11-06T13:42:48Z'
    const messageId = '151730312500800'
    const webhookEvent = createEventMessageReceived(event, testTimestamp, messageId)

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

function createEventMessageReceived (event, timestamp, id) {
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

function createEventPostback(timestamp) {
  return {
    event: 'postback',
    timestamp,
    data: {
      channel: {
        id: '151730312500791',
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

function createEventMessagesDelivered (timestamp, id) {
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

const OptIn = (timestamp) => ({
  event: 'opt_in',
  timestamp,
  data: {
  channel: {
    id: '151730312500791',
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

function createEventMessagesRead (timestamp, lastReadTimestamp) {
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

const Handler = () => async (data, timestamp) => ({data, timestamp})

async function testWebhook(onMethod, testTimestamp, webhookEvent) {
  onMethod(Handler())
  const req = {
    header: () => xHubSignatureUtils.calculateXHubSignature('test-secret', JSON.stringify(webhookEvent)),
    body: webhookEvent
  }
  const res = {sendStatus: () => {}}
  const {data, timestamp} = await webhookRouter.handleEvent(req, res)

  expect(timestamp).to.eql(testTimestamp)
  expect(data).to.eql(webhookEvent.data)
}
