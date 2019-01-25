const last = require('ramda/src/last')

class Request {

  constructor(httpClient) {
    this.httpClient = httpClient
  }

  _createHeaders(callerMethodArgs) {
    const lastArg = last(callerMethodArgs)
    return lastArg && lastArg.accessToken ? {Authorization: `Bearer ${lastArg.accessToken}`} : {}
  }

}

module.exports = Request
