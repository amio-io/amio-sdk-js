const amioHttpClient = require('./http/amio.http-client')
const Message = require('./api/message')

class AmioConnector {

  constructor (opts = {}) {
    const accessToken = opts.accessToken || null
    const baseUrl = opts.baseUrl
    const httpClient = amioHttpClient.createConnection(accessToken, baseUrl)

    this.messages = new Message(httpClient)
  }

}

module.exports = AmioConnector
