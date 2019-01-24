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

  describe('API error', () => {
    it('catch a 422 error', async () => {
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

  describe('messages', () => {
    it('fail to send a message', async () => {
      const error = await amioApi.messages.send({}).catch(e => e.amioApiError.status.code)
      expect(error).to.equal(422)
    })

    it('list messages', async () => {
      const max = 2
      const offset = 1
      const params = {max, offset}

      const messageList = await amioApi.messages.list(channel.id, contact.id, params)

      expect(messageList).to.have.all.keys('items', 'totalCount')
      expect(messageList.items).to.be.an('array')
      expect(messageList.items).to.have.length(max)
      expect(messageList.items[0].channel.id).to.equal(channel.id)
      expect(messageList.items[0].contact.id).to.equal(contact.id)
      expect(messageList.items[0]).to.include.all.keys('id', 'sent', 'read', 'direction', 'delivered', 'channel', 'contact', 'content')
      expect(messageList.totalCount).to.be.a('number')
    })
  })
})
