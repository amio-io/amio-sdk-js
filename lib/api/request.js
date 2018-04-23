class Request {

  constructor(httpClient){
    this.httpClient = httpClient
  }

  createHeaders(accessToken) {
    const headers = {}
    if (accessToken) headers.Authorization = `Bearer ${accessToken}`

    return headers
  }

}

module.exports = Request
