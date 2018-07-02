const debug = require('debug')('amio-sdk-js:request.settings')
const Request = require('./request')

class Settings extends Request {

  constructor(httpClient){
    super(httpClient)
  }

  get(channelId) {
    debug('get() settings for channel', channelId)
    const headers = this._createHeaders(arguments)
    return this.httpClient
      .get(`/v1/channels/${channelId}/settings`, {headers})
      .then(response => response.data)
  }

  set(channelId, setting) {
    debug('set() a setting for channel', channelId, setting)
    const headers = this._createHeaders(arguments)
    return this.httpClient
      .patch(`/v1/channels/${channelId}/settings`, setting, {headers})
      .then(response => response.data)
  }
}

module.exports = Settings
