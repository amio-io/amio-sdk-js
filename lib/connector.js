const amioHttpClient = require('./http/amio.http-client')
const Message = require('./api/message')
const Notification = require('./api/notification')

class AmioConnector {

  constructor (opts = {}) {
    const accessToken = opts.accessToken || null
    // baseUrl may be overridden e.g. by http://localhost if we need to develop, etc. ...
    const baseUrl = opts.baseUrl || 'https://api.amio.io'
    const httpClient = amioHttpClient.createConnection(accessToken, baseUrl)

    this.messages = (new Message(httpClient))
    this.notifications = new Notification(httpClient)
  }

}

module.exports = AmioConnector
