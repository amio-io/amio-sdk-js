const debug = require('debug')('amio-sdk-js:request.channel')
const Request = require('./request')

class Channel extends Request {

  constructor(httpClient){
    super(httpClient)
  }

  get(channelId, accessToken) {
    debug('get() channel', channelId)
    const headers = this.createHeaders(accessToken)
    return this.httpClient
      .get(`/v1/channels/${channelId}`, {headers})
      .then(response => response.data)
  }

  list(params = {max: 10, offset: 0}, accessToken) {
    debug('list() channels with params:', params)
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
    debug('create() channel:', request)
    const headers = this.createHeaders(accessToken)

    return this.httpClient
      .post('/v1/channels', request, {headers})
      .then(response => response.data)
  }

  update(channelId, request, accessToken) {
    debug('update() channel', channelId, 'with data:', request)
    const headers = this.createHeaders(accessToken)
    return this.httpClient
      .patch(`/v1/channels/${channelId}`, request, {headers})
      .then(response => response.data)
  }

  delete(channelId, accessToken) {
    debug('delete() channel', channelId)
    const headers = this.createHeaders(accessToken)
    return this.httpClient
      .patch(`/v1/channels/${channelId}`, {headers})
      .then(response => response.data)
  }
}

module.exports = Channel
