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

  describe('messages', () => {
    it('send a message', async () => {
      const content = amioApi.contentBuilder.typeText('test message').build()
      const message = await amioApi.messages.send({channel, contact, content})
      expect(message).to.include.all.keys('id', 'channel', 'contact', 'content')
      expect(message.channel).to.eql({id: channel.id, type: 'facebook_messenger'})
      expect(message.contact).to.eql({id: contact.id})
      expect(message.content).to.eql({type: 'text', payload: 'test message'})
    })

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
