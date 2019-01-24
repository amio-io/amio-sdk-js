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

describe('Amio API Connector', function () {

  describe('notifications', () => {
    it('fail to send a notification', async () => {
      const error = await amioApi.notifications.send({}).catch(e => e.amioApiError.status.code)
      expect(error).to.equal(422)
    })
  })
})
