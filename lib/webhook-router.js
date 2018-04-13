const EventEmitter = require('events').EventEmitter
const xHubSignatureUtils = require('./x-hub-signature.utils')
const {me, E} = require('await-trace')

class WebhookRouter extends EventEmitter {

  constructor(opts = {}) {
    super()
    if (!opts.appSecret) throw new Error('Missing app secret token.')

    this.appSecret = opts.appSecret
    this.handlers = {}
  }

  async handleEvent(req, res) {
    res.sendStatus(200)

    const xHubSignature = req.header('X-Hub-Signature')
    const body = req.body
    if (!xHubSignatureUtils.verifyXHubSignature(xHubSignature, JSON.stringify(body), this.appSecret)) {
      await me(() => E(), this.routeEvent(createErrorEventBody('Failed to verify X-Hub-Signature.')))
      return
    }

    await me(() => E(), this.routeEvent(body))
  }

  async routeEvent({event, data, timestamp}) {
    this.emit(event, data, timestamp)

    if(this.handlers[event]) {
      await me(() => E(), invokeHandlers(data, timestamp, this.handlers[event]))
    } else {
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
    await me(() => E(), handler(data, timestamp))
  }
}

module.exports = WebhookRouter
