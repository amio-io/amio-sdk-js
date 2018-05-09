const debug = require('debug')('amio-sdk-js:message')
const Request = require('./request')

class Message extends Request {

  constructor(httpClient) {
    super(httpClient)
  }

  list(channelId, contactId, params = {max: 10, offset: 0}, accessToken) {
    debug('list messages for contact', contactId, 'in channel', channelId, 'with params:', params)
    const headers = this.createHeaders(accessToken)

    return this.httpClient
      .get(`/v1/channels/${channelId}/contacts/${contactId}/messages`, {
        params,
        headers
      })
      .then(response => ({
        items: response.data,
        totalCount: Number.parseInt(response.headers['x-total-count'])
      }))
  }

  send(message, accessToken) {
    debug('send message:', message)
    const headers = this.createHeaders(accessToken)
    return this.httpClient
      .post('/v1/messages', message, {headers})
      .then(response => response.data)
  }
}

module.exports = Message
