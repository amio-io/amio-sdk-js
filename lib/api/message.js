const Request = require('./request')

class Message extends Request {

  constructor(httpClient){
    super()
    this.httpClient = httpClient
  }

  send(message, accessToken = '') {
    const headers = this.createHeaders(accessToken)
    return this.httpClient
      .post(`/v1/messages`, message, {headers})
      .then(request => request.data)
  }
}

module.exports = Message
