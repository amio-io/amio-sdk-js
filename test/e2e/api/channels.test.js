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

  describe('channels', () => {
    it('find a channel', async () => {
      const channelFound = await amioApi.channels.get(channel.id)

      expect(channelFound).to.include.all.keys('id', 'type', 'name', 'webhook')
      expect(channelFound.id).to.eql(channel.id)
    })

    it('list channels', async () => {
      const max = 2
      const offset = 0
      const params = {max, offset}

      const channelList = await amioApi.channels.list(params)

      expect(channelList).to.have.all.keys('items', 'totalCount')
      expect(channelList.items).to.be.an('array')
      expect(channelList.items[0]).to.include.all.keys('id', 'type', 'name', 'webhook')
      expect(channelList.totalCount).to.be.a('number')
    })

    it('refuse to create channel', async () => {
      const error = await amioApi.channels.create({}).catch(e => e.amioApiError.status.code)
      expect(error).to.equal(422)
    })

    it('return updated channel', async () => {
      const channelOriginal = await amioApi.channels.update(channel.id, {})
      expect(channelOriginal).to.be.an('object')
    })

    it('fail to delete channel', async () => {
      const error = await amioApi.channels.delete(123).catch(e => e.amioApiError.status.code)
      expect(error).to.equal(404)
    })
  })
})
