const config = require('../../config')
const {AmioApi} = require('../../../index')
const expect = require('chai').expect

const settings = {
  accessToken: config.AMIO_ACCESS_TOKEN
}
const amioApi = new AmioApi(settings)

const channel = {
  id: config.AMIO_CHANNEL_ID
}
const contact = {
  id: config.AMIO_CONTACT_ID
}

describe('Amio API', function () {

  describe('API error', () => {
    it('wrong access token', async () => {
      await amioApi.messages.send({}, {accessToken: 'wrong access token'})
        .then(() => {
          throw new Error('exception was expected')
        })
        .catch(e => {
          expect(e.amioApiError).not.to.equal(null)
          expect(e.jsonify()).to.eql({
            timestamp: e.amioApiError.timestamp,
            status: {
              code: 401,
              message: "Unauthorized"
            },
            errors: [{
              message: 'Wrong accessToken.'
            }]
          })
        })
    })
  })
})
