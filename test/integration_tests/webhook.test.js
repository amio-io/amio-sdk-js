const {AmioWebhookHandler} = require('../../index')
const expect = require('chai').expect

let amioWebhookHandler = null

describe('Webhooks', function () {

  before(function () {
    const settings = {
      appSecret: 'test-secret'
    }
    amioWebhookHandler = new AmioWebhookHandler(settings)
  })

  it('EVENT message_received', (done) => {
    const event = 'message_received'
    const testTimestamp = '2016-10-06T13:42:48Z'
    const messageId = '151730312500791'
    const messageReceivedEvent = getTestMessageEvent(event, testTimestamp, messageId)
    const messageReceivedEventData = messageReceivedEvent.data

    amioWebhookHandler.onMessageReceived((data, timestamp) => {
      expect(timestamp).to.eql(testTimestamp)
      expect(data).to.eql(messageReceivedEventData)
      done()
    })

    amioWebhookHandler.routeEvent(messageReceivedEvent)
  })

  it('EVENT message_echo', (done) => {
    const event = 'message_echo'
    const testTimestamp = '2016-11-06T13:42:48Z'
    const messageId = '151730312500800'
    const messageEchoEvent = getTestMessageEvent(event, testTimestamp, messageId)
    const messageEchoEventData = messageEchoEvent.data

    amioWebhookHandler.onMessageEcho((data, timestamp) => {
      expect(timestamp).to.eql(testTimestamp)
      expect(data).to.eql(messageEchoEventData)
      done()
    })

    amioWebhookHandler.routeEvent(messageEchoEvent)
  })

  it('EVENT message_delivered', (done) => {
    const testTimestamp = '2016-11-06T13:42:48Z'
    const messageId = '151730312500800'
    const messageDeliveredEvent = getTestMessagesDeliveredEvent(testTimestamp, messageId)
    const messageDeliveredEventData = messageDeliveredEvent.data

    amioWebhookHandler.onMessagesDelivered((data, timestamp) => {
      expect(timestamp).to.eql(testTimestamp)
      expect(data).to.eql(messageDeliveredEventData)
      done()
    })

    amioWebhookHandler.routeEvent(messageDeliveredEvent)
  })

  it('EVENT message_read', (done) => {
    const testTimestamp = '2016-11-06T13:42:48Z'
    const messageReadEvent = getTestMessagesReadEvent(testTimestamp)
    const messageReadEventData = messageReadEvent.data

    amioWebhookHandler.onMessagesRead((data) => {
      expect(data).to.eql(messageReadEventData)
      done()
    })

    amioWebhookHandler.routeEvent(messageReadEvent)
  })
})

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

function getTestMessagesReadEvent (lastReadTimestamp) {
  return {
    event: 'messages_read',
    timestamp: '2016-10-06T13:42:48Z',
    data: {
      channel: {
        id: '151730312500791',
        type: 'facebook_messenger',
      },
      contact: {
        id: '1419024554891329'
      },
      last_read_timestamp: lastReadTimestamp
    },
  }
}
