class Message {

  constructor(httpClient){
    this.httpClient = httpClient
  }

  send(message, accessToken = '') {
    // TODO message must be an object + check required keys are present
    const headers = createHeaders(accessToken)
    return this.httpClient
      .post(`/v1/messages`, message, {headers})
      .then(request => request.data)
  }
}

function createHeaders(accessToken) {
  const headers = {}
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`

  return headers
}

module.exports = Message
