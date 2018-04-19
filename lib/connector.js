const amioHttpClient = require('./http/amio.http-client')
const Message = require('./api/message')
const Notification = require('./api/notification')

class AmioConnector {

  constructor (opts = {}) {
    const accessToken = opts.accessToken || null
    const baseUrl = opts.baseUrl
    const httpClient = amioHttpClient.createConnection(accessToken, baseUrl)

    this.messages = new Message(httpClient)
    this.notifications = new Notification(httpClient)
  }

}

module.exports = AmioConnector
