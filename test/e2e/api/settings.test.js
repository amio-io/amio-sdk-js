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

  // Skipping the tests that gets rate limited often
  describe.skip('settings', () => {
    it('return settings', async () => {
      const settingsFound = await amioApi.settings.get(channel.id)
      expect(settingsFound).to.be.an('object')
    })

    it('patch settings', async () => {
      const settingsPatched = await amioApi.settings.set(channel.id, {})
      expect(settingsPatched).to.be.an('object')
      })
  })

})
