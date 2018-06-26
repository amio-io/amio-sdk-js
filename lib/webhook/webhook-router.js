const debug = require('debug')('amio-sdk-js:webhook-router')
const EventEmitter = require('events').EventEmitter
const xHubSignatureUtils = require('./x-hub-signature.utils')
const defaultHandlers = [
  'message_received',
  'messages_delivered',
  'messages_read',
  'message_echo',
  'postback',
  'opt_in',
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
    const webhook = req.body
    if (!xHubSignatureUtils.verifyXHubSignature(xHubSignature, JSON.stringify(webhook), this.secretToken)) {
      await this.routeEvent(createErrorEventBody('Failed to verify X-Hub-Signature.'))
      return
    }

    await this.routeEvent(webhook)
  }

  async routeEvent(webhook) {
    debug('routeEvent:', webhook.event, 'timestamp:', webhook.timestamp, 'data:', webhook.data)
    this.emit(webhook.event, webhook)

    if(this.handlers[webhook.event]) {
      await invokeHandlers(webhook, this.handlers[webhook.event])
    }
    else if (!defaultHandlers.includes(webhook.event)){
      console.error('Unsupported event type ', webhook.event, webhook.data)
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

  onOptIn(handler) {
    this.addHandler('opt_in', handler)
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

async function invokeHandlers(webhook, handlers) {
  for (const handler of handlers) {
    await handler(webhook)
  }
}

module.exports = WebhookRouter
