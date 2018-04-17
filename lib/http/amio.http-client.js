const axios = require('axios')
const path = require('ramda/src/path')
const is = require('ramda/src/is')
const AmioApiError = require('../api/error/amio-api.error')

class AmioHttpClient {

  createConnection(accessToken, baseUrl = 'https://api.amio.io') {
    const httpClient = axios.create({
      baseURL: baseUrl,
      headers: {}
    })

    httpClient.interceptors.request.use(config => {
      if (!config.headers['Authorization']) config.headers['Authorization'] = `Bearer ${accessToken}`

      return config
    })

    httpClient.interceptors.response.use(response => response, handleError)

    return httpClient
  }

}

function handleError (error) {
  const amioErrors = path(['response', 'data', 'errors'], error);
  if(is(Array, amioErrors)) throw new AmioApiError(error.response.data)

  throw error
}

module.exports = new AmioHttpClient()
