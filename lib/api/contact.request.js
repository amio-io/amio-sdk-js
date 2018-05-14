const debug = require('debug')('amio-sdk-js:request.contact')
const Request = require('./request')

class Contact extends Request {

  constructor(httpClient){
    super(httpClient)
  }

  get(channelId, contactId, accessToken) {
    debug('get() contact', contactId, 'in channel', channelId)
    const headers = this.createHeaders(accessToken)
    return this.httpClient
      .get(`/v1/channels/${channelId}/contacts/${contactId}`, {headers})
      .then(response => response.data)
  }

  list(channelId, params = {max: 10, offset: 0}, accessToken) {
    debug('list() contacts in channel', channelId)
    const headers = this.createHeaders(accessToken)

    return this.httpClient
      .get(`/v1/channels/${channelId}/contacts`, {
        params,
        headers
      })
      .then(response => ({
        items: response.data,
        totalCount: Number.parseInt(response.headers['x-total-count'])
      }))
  }

  delete(channelId, contactId, accessToken) {
    debug('delete() contact', contactId, 'in channel', channelId)
    const headers = this.createHeaders(accessToken)
    return this.httpClient
      .get(`/v1/channels/${channelId}/contacts/${contactId}`, {headers})
      .then(response => response.data)
  }
}

module.exports = Contact
