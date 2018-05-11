const config = require('../config')
const {AmioApi} = require('../../index')
const expect = require('chai').expect
const omit = require('ramda/src/omit')
const assoc = require('ramda/src/assoc')

const settings = {
  accessToken: config.CONNECTOR_ACCESS_TOKEN
}
const amioApi = new AmioApi(settings)

const channel = {
  id: config.CONNECTOR_CHANNEL_ID
}
const contact = {
  id: config.CONNECTOR_CONTACT_ID
}

describe('Amio API Connector', function () {

  describe('API error', () => {
    it('catch a 422 error', async () => {
      await amioApi.messages.send({}, 'wrong access token')
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

  describe('channels', () => {
    it('find a channel', async () => {
      const channelFound = await amioApi.channels.get(channel.id)

      expect(channelFound).to.include.all.keys('id', 'type', 'name', 'webhook')
      expect(channelFound.id).to.eql(channel.id)
    })

    it('list channels', async () => {
      const max = 2
      const offset = 1
      const params = {max, offset}

      const channelList = await amioApi.channels.list(params)

      expect(channelList).to.have.all.keys('items', 'totalCount')
      expect(channelList.items).to.be.an('array')
      // expect(channelList.items.some(item => item.id === channel.id)).to.be.true
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

  describe('contacts', () => {
    it('find a contact', async () => {
      const contactFound = await amioApi.contacts.get(channel.id, contact.id)

      expect(contactFound).to.include.all.keys('id', 'name')
      expect(contactFound).to.have.any.keys('gender', 'locale', 'country', 'time_zone', 'photo_url')
      expect(contactFound.id).to.eql(contact.id)
    })
  })

  describe('notifications', () => {
    it('fail to send a notification', async () => {
      const error = await amioApi.notifications.send({}).catch(e => e.amioApiError.status.code)
      expect(error).to.equal(422)
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

  describe('settings', () => {
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
