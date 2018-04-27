const Request = require('./request')

class Settings extends Request {

  constructor(httpClient){
    super(httpClient)
    this.httpClient = httpClient
  }

  get(channelId, accessToken) {
    const headers = this.createHeaders(accessToken)
    return this.httpClient
      .get(`/v1/channels/${channelId}/settings`, {headers})
      .then(response => response.data)
  }

  set(channelId, option, accessToken) {
    const headers = this.createHeaders(accessToken)
    return this.httpClient
      .patch(`/v1/channels/${channelId}/settings`, option, {headers})
      .then(response => response.data)
  }

  list(params = {max: 10, offset: 0}, accessToken) {
    const headers = this.createHeaders(accessToken)

    return this.httpClient
      .get(`/v1/channels`, {
        params,
        headers
      })
      .then(response => ({
        items: response.data,
        totalCount: Number.parseInt(response.headers['x-total-count'])
      }))
  }
}

module.exports = Settings
