class Request {

  createHeaders(accessToken) {
    const headers = {}
    if (accessToken) headers.Authorization = `Bearer ${accessToken}`

    return headers
  }

}

module.exports = Request