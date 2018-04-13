const httpClient = require('../http/amio.http-client').getInstance()
const {me, E} = require('await-trace')

class Message {

  async send(message, accessToken = '') {
    // TODO message must be an object + check required keys are present
    const headers = createHeaders(accessToken)
    return await me(() => E(), httpClient
      .post(`/v1/messages`, message, {headers})
      .then(request => request.data)
    )
  }
}

function createHeaders(accessToken) {
  const headers = {}
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`

  return headers
}

module.exports = Message
