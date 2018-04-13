const amioHttpClient = require('./http/amio.http-client')

class AmioConnector {

  constructor (opts = {}) {
    const accessToken = opts.accessToken || null
    const baseUrl = opts.baseUrl
    amioHttpClient.createConnection(accessToken, baseUrl)

    const Message = require('./api/message')
    this.messages = new Message()
  }

}

module.exports = AmioConnector
