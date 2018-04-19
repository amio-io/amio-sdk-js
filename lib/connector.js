const amioHttpClient = require('./http/amio.http-client')
const Message = require('./api/message')
const Notification = require('./api/notification')

class AmioConnector {

  constructor (opts = {}) {
    const accessToken = opts.accessToken || null
    const baseUrl = opts.baseUrl || 'https://api.amio.io' // TODO find out if we have cases when we need to override baseUrl
    const httpClient = amioHttpClient.createConnection(accessToken, baseUrl)

    this.messages = new Message(httpClient)
    this.notifications = new Notification(httpClient)
  }

}

module.exports = AmioConnector
