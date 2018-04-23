const Request = require('./request')

class Message extends Request {

  constructor(httpClient){
    super(httpClient)
  }

  send(message, accessToken) {
    const headers = this.createHeaders(accessToken)
    return this.httpClient
      .post('/v1/messages', message, {headers})
      .then(response => response.data)
  }
}

module.exports = Message
