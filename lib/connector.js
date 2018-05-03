const amioHttpClient = require('./http/amio.http-client')
const Channel = require('./api/channel')
const Contact = require('./api/contact')
const Message = require('./api/message')
const Notification = require('./api/notification')
const Settings = require('./api/settings')

class AmioConnector {

  constructor (opts = {}) {
    const accessToken = opts.accessToken || null
    // baseUrl may be overridden e.g. by http://localhost if we need to develop, etc. ...
    const baseUrl = opts.baseUrl || 'https://api.amio.io'
    const httpClient = amioHttpClient.createConnection(accessToken, baseUrl)

    this.channels = new Channel(httpClient)
    this.contacts = new Contact(httpClient)
    this.messages = new Message(httpClient)
    this.notifications = new Notification(httpClient)
    this.settings = new Settings(httpClient)
  }

}

module.exports = AmioConnector
