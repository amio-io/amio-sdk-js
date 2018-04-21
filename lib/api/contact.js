const Request = require('./request')

class Contact extends Request {

  constructor(httpClient){
    super(httpClient)
    this.httpClient = httpClient
  }

  get(channel_id, contact_id, accessToken = '') {
    const headers = this.createHeaders(accessToken)
    return this.httpClient
      .get(`/v1/channels/${channel_id}/contacts/${contact_id}`, {headers})
      .then(response => response.data)
  }
}

module.exports = Contact
