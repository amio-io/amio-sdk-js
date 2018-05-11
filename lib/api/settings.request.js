const Request = require('./request')

class Settings extends Request {

  constructor(httpClient){
    super(httpClient)
  }

  get(channelId, accessToken) {
    const headers = this.createHeaders(accessToken)
    return this.httpClient
      .get(`/v1/channels/${channelId}/settings`, {headers})
      .then(response => response.data)
  }

  set(channelId, setting, accessToken) {
    const headers = this.createHeaders(accessToken)
    return this.httpClient
      .patch(`/v1/channels/${channelId}/settings`, setting, {headers})
      .then(response => response.data)
  }
}

module.exports = Settings
