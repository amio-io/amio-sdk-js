class Request {

  constructor(httpClient){
    this.httpClient = httpClient
  }

  createHeaders(callerMethodArgs) {
    const lastArg = [].slice.call(callerMethodArgs, -1)[0]
    return lastArg.accessToken ? {Authorization: `Bearer ${lastArg.accessToken}`} : {}
  }

}

module.exports = Request
