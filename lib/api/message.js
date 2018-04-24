const Request = require('./request')

class Message extends Request {

  constructor(httpClient) {
    super(httpClient)
  }

  list(channelId, contactId, max = 10, offset = 0, accessToken) {
    const headers = this.createHeaders(accessToken)

    const params = {max, offset}
    return this.httpClient
      .get(`/v1/channels/${channelId}/contacts/${contactId}/messages`, {
        params,
        headers
      })
      .then(response => ({
        items: response.data,
        totalCount: response.headers['x-total-count']
      }))
  }

  send(message, accessToken) {
    const headers = this.createHeaders(accessToken)
    return this.httpClient
      .post('/v1/messages', message, {headers})
      .then(response => response.data)
  }
}

module.exports = Message
