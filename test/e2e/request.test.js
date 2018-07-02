const Request = require('../../lib/api/request')
const expect = require('chai').expect

describe('Amio API Request', function () {
  describe('create headers', () => {
    it('return empty object - empty arguments', async () => {
      function requestHeaders() {
        const request = new Request()
        return request.createHeaders(arguments)
      }
      const headers = requestHeaders()
      expect(headers).to.be.an('object').that.is.empty
    })

    it('return empty object - no token found', async () => {
      function requestHeaders() {
        const request = new Request()
        return request.createHeaders(arguments)
      }
      const headers = requestHeaders(1)
      expect(headers).to.be.an('object').that.is.empty
    })

    it('return proper header with token', async () => {
      function requestHeaders() {
        const request = new Request()
        return request.createHeaders(arguments)
      }
      const headers = requestHeaders({accessToken: 'test'})
      expect(headers).to.be.an('object').that.has.all.keys('Authorization')
    })
  })
})
