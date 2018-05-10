const Request = require('./request')

class Channel extends Request {

  constructor(httpClient){
    super(httpClient)
    this.httpClient = httpClient
  }

  get(channelId, accessToken) {
    const headers = this.createHeaders(accessToken)
    return this.httpClient
      .get(`/v1/channels/${channelId}`, {headers})
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

  create(request, accessToken) {
    const headers = this.createHeaders(accessToken)

    return this.httpClient
      .post('/v1/channels', request, {headers})
      .then(response => response.data)
  }

  update(channelId, request, accessToken) {
    const headers = this.createHeaders(accessToken)
    return this.httpClient
      .patch(`/v1/channels/${channelId}`, request, {headers})
      .then(response => response.data)
  }
}

module.exports = Channel
