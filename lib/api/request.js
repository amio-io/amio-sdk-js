const last = require('ramda/src/last')
const prop = require('ramda/src/prop')

class Request {

  constructor(httpClient){
    this.httpClient = httpClient
  }

  createHeaders(callerMethodArgs) {
    const lastArg = last(callerMethodArgs)
    if (lastArg && prop('accessToken', lastArg)) return {Authorization: `Bearer ${lastArg.accessToken}`}
    return {}
  }

}

module.exports = Request
