const Request = require('./request')

class Notification extends Request{

  constructor(httpClient){
    super()
    this.httpClient = httpClient
  }

  send(notification, accessToken = '') {
    const headers = this.createHeaders(accessToken)
    return this.httpClient
      .post('/v1/notifications', notification, {headers})
      .then(response => response.data)
  }
}

module.exports = Notification
