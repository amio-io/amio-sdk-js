const debug = require('debug')('amio-sdk-js:contact')
const Request = require('./request')

class Contact extends Request {

  constructor(httpClient){
    super(httpClient)
  }

  get(channelId, contactId, accessToken) {
    debug('get contact', contactId, 'in channel', channelId)
    const headers = this.createHeaders(accessToken)
    return this.httpClient
      .get(`/v1/channels/${channelId}/contacts/${contactId}`, {headers})
      .then(response => response.data)
  }
}

module.exports = Contact
