const debug = require('debug')('amio-sdk-js:webhook-router')
const EventEmitter = require('events').EventEmitter
const xHubSignatureUtils = require('./x-hub-signature.utils')
const defaultHandlers = [
  'message_received',
  'messages_delivered',
  'messages_read',
  'message_echo',
  'postback',
  'webhook_error'
]

class WebhookRouter extends EventEmitter {

  constructor(opts = {}) {
    super()
    if (!opts.secretToken) throw new Error('Missing app secret token.')

    this.secretToken = opts.secretToken
    this.handlers = {}
  }

  async handleEvent(req, res) {
    res.sendStatus(200)

    const xHubSignature = req.header('X-Hub-Signature')
    const body = req.body
    if (!xHubSignatureUtils.verifyXHubSignature(xHubSignature, JSON.stringify(body), this.secretToken)) {
      await this.routeEvent(createErrorEventBody('Failed to verify X-Hub-Signature.'))
      return
    }

    await this.routeEvent(body)
  }

  async routeEvent({event, data, timestamp}) {
    debug('route event:', event, 'timestamp:', timestamp, 'data:')
    this.emit(event, data, timestamp)

    if(this.handlers[event]) {
      await invokeHandlers(data, timestamp, this.handlers[event])
    }
    else if (!defaultHandlers.includes(event)){
      console.error('Unsupported event type ', event, data)
    }

  }

  addHandler(event, handler) {
    if(!this.handlers[event]) {
      this.handlers[event] = []
    }

    this.handlers[event].push(handler)
  }

  onMessageReceived(handler) {
    this.addHandler('message_received', handler)
  }

  onMessagesDelivered(handler) {
    this.addHandler('messages_delivered', handler)
  }

  onMessagesRead(handler) {
    this.addHandler('messages_read', handler)
  }

  onMessageEcho(handler) {
    this.addHandler('message_echo', handler)
  }

  onPostbackReceived(handler) {
    this.addHandler('postback', handler)
  }

  onError(handler) {
    this.addHandler('webhook_error', handler)
  }

}

function createErrorEventBody(error) {
  return {
    event: 'webhook_error',
    data: {
      error
    },
    timestamp: (new Date()).toISOString()
  }
}

async function invokeHandlers(data, timestamp, handlers) {
  for (const handler of handlers) {
    await handler(data, timestamp)
  }
}

module.exports = WebhookRouter
