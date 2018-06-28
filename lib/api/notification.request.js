const debug = require('debug')('amio-sdk-js:request.notification')
const Request = require('./request')

class Notification extends Request {

  constructor(httpClient) {
    super(httpClient)
  }

  send(notification) {
    debug('send() notification:', notification)
    const headers = this.createHeaders(arguments)
    return this.httpClient
      .post('/v1/notifications', notification, {headers})
      .then(response => response.data)
  }
}

module.exports = Notification
