const last = require('ramda/src/last')

class Request {

  constructor(httpClient) {
    this.httpClient = httpClient
  }

  _createHeaders(callerMethodArgs) {
    const accessToken = last(callerMethodArgs)
    return accessToken ? {Authorization: `Bearer ${accessToken}`} : {}
  }

}

module.exports = Request
