const Request = require('../../lib/api/request')
const expect = require('chai').expect

function requestHeaders() {
  const request = new Request()
  return request._createHeaders(arguments)
}

describe('Amio API Request', function () {
  describe('create headers', () => {
    it('return empty object - empty arguments', async () => {
      const headers = requestHeaders()
      expect(headers).to.eql({})
    })

    it('return empty object - no token found', async () => {
      const headers = requestHeaders(1)
      expect(headers).to.eql({})
    })

    it('return proper header with token', async () => {
      const headers = requestHeaders({accessToken: 'test'})
      expect(headers).to.eql({Authorization: 'Bearer test'})
    })
  })
})
