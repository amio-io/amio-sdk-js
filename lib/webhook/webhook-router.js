const debug = require('debug')('amio-sdk-js:webhook-router')
const EventEmitter = require('events').EventEmitter
const xHubSignatureUtils = require('./x-hub-signature.utils')
const path = require('ramda/src/path')
const isEmpty = require('ramda/src/isEmpty')
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
    if (!opts.secrets || isEmpty(opts.secrets)) throw new Error('Define at least 1 secret.')

    this.secrets = opts.secrets
    this.handlers = {}
  }

  async handleEvent(req, res) {
    res.sendStatus(200)

    const xHubSignature = req.header('X-Hub-Signature')
    const webhook = req.body
    const channelId = path(['data','channel','id'], webhook)

    if(!channelId){
      await this.routeEvent(createErrorEventBody('Failed to verify X-Hub-Signature. Couldn\'t find "webhook.data.channel.id".'))
      return
    }

    const secret = this.secrets[channelId]
    if(!secret){
      await this.routeEvent(createErrorEventBody(`Failed to verify X-Hub-Signature. Channel with id "${channelId}" is missing webhook secret.`))
      return
    }

    // TODO option to suppress XHubSignature
    if(!req.rawBody){
      const message = `Failed to verify X-Hub-Signature. req.rawBody doesn't exist. It is attached using body-parser:
                      app.use(bodyParser.json({
                        verify: attachRawBody
                      }))`;
      await this.routeEvent(createErrorEventBody(message))
      return
    }

    const rawWebhook = Buffer.from(req.rawBody).toString('utf8')
    if (!xHubSignatureUtils.verifyXHubSignature(xHubSignature, rawWebhook, secret)) {
      await this.routeEvent(createErrorEventBody(`Failed to verify X-Hub-Signature for "channel.id" ${channelId}`))
      return
    }

    await this.routeEvent(webhook)
  }

  async routeEvent(webhook) {
    const {event, data, timestamp} = webhook
    debug('routeEvent:', event, 'timestamp:', timestamp, 'data:', data)
    this.emit(event, webhook)

    if(this.handlers[event]) {
      await invokeHandlers(webhook, this.handlers[event])
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
