const amioHttpClient = require('./http/amio.http-client')
const Channel = require('./api/channel.request')
const Contact = require('./api/contact.request')
const Message = require('./api/message.request')
const Notification = require('./api/notification.request')
const Settings = require('./api/settings.request')
const contentBuilder = require('./util/content/content-builder')

class AmioApi {

  constructor (opts = {}) {
    const accessToken = opts.accessToken || null
    // baseUrl may be overridden e.g. by http://localhost if we need to develop, etc. ...
    const baseUrl = opts.baseUrl || 'https://api.amio.io'
    this.httpClient = amioHttpClient.createConnection(accessToken, baseUrl)

    this.channels = new Channel(this.httpClient)
    this.contacts = new Contact(this.httpClient)
    this.contentBuilder = contentBuilder
    this.messages = new Message(this.httpClient)
    this.notifications = new Notification(this.httpClient)
    this.settings = new Settings(this.httpClient)
  }

}

module.exports = AmioApi
