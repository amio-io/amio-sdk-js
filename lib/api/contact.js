const Request = require('./request')

class Contact extends Request {

  constructor(httpClient){
    super()
    this.httpClient = httpClient
  }

  get(channel_id, contact_id, accessToken = '') {
    const headers = this.createHeaders(accessToken)
    return this.httpClient
      .get(`/v1/channels/${channel_id}/contacts/${contact_id}`, {headers})
      .then(response => response.data)
  }

  list(channel_id, accessToken = '') {
    const headers = this.createHeaders(accessToken)
    return this.httpClient
      .get(`/v1/channels/${channel_id}/contacts`, {headers})
      .then(response => response.data)
  }

  delete(channel_id, contact_id, accessToken = '') {
    const headers = this.createHeaders(accessToken)
    return this.httpClient
      .delete(`/v1/channels/${channel_id}/contacts/${contact_id}`, {headers})
      .then(response => response.data)
  }
}

module.exports = Contact
