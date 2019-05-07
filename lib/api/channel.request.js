const debug = require('debug')('amio-sdk-js:request.channel')
const Request = require('./request')

class Channel extends Request {

  constructor(httpClient){
    super(httpClient)
  }

  get(channelId) {
    debug('get() channel', channelId)
    const headers = this._createHeaders(arguments)
    return this.httpClient
      .get(`/v1/channels/${channelId}`, {headers})
      .then(response => response.data)
  }

  list(params = {max: 10, offset: 0}) {
    debug('list() channels with params:', params)
    const headers = this._createHeaders(arguments)

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

  create(request) {
    debug('create() channel:', request)
    const headers = this._createHeaders(arguments)

    return this.httpClient
      .post('/v1/channels', request, {headers})
      .then(response => response.data)
  }

  update(channelId, request) {
    debug('update() channel', channelId, 'with data:', request)
    const headers = this._createHeaders(arguments)
    return this.httpClient
      .patch(`/v1/channels/${channelId}`, request, {headers})
      .then(response => response.data)
  }

  delete(channelId) {
    debug('delete() channel', channelId)
    const headers = this._createHeaders(arguments)
    return this.httpClient
      .delete(`/v1/channels/${channelId}`, {headers})
      .then(() => true)
  }
}

module.exports = Channel
