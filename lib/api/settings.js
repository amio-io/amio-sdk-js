const debug = require('debug')('amio-sdk-js:settings')
const Request = require('./request')

class Settings extends Request {

  constructor(httpClient){
    super(httpClient)
  }

  get(channelId, accessToken) {
    debug('list settings for channel', channelId)
    const headers = this.createHeaders(accessToken)
    return this.httpClient
      .get(`/v1/channels/${channelId}/settings`, {headers})
      .then(response => response.data)
  }

  set(channelId, setting, accessToken) {
    debug('change setting for channel', channelId, setting)
    const headers = this.createHeaders(accessToken)
    return this.httpClient
      .patch(`/v1/channels/${channelId}/settings`, setting, {headers})
      .then(response => response.data)
  }
}

module.exports = Settings
