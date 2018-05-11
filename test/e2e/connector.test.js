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
    it('catches a 422 error', async () => {
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

  describe('contacts', () => {
    it('find a contact', async () => {
      const contactFound = await amioApi.contacts.get(channel.id, contact.id)

      expect(contactFound).to.include.all.keys('id', 'name')
      expect(contactFound).to.have.any.keys('gender', 'locale', 'country', 'time_zone', 'photo_url')
      expect(contactFound.id).to.eql(contact.id)
    })

    it('list contacts', async () => {
      const max = 2
      const offset = 1
      const params = {max, offset}

      const contactList = await amioApi.contacts.list(channel.id, params)

      expect(contactList).to.have.all.keys('items', 'totalCount')
      expect(contactList.items).to.be.an('array')
      expect(contactList.items[0]).to.include.all.keys('id', 'name')
      expect(contactList.totalCount).to.be.a('number')
    })

    it('fails to delete contact', async () => {
      const contactNotFound = await amioApi.contacts.delete(channel.id, 123).catch(e => e.amioApiError.status.code)
      expect(contactNotFound).to.equal(404)
    })
  })

  describe('notifications', () => {
    it('send a notification', async () => {

      const type = 'typing_on'
      const notification = await amioApi.notifications.send({
        channel, contact, type
      })

      expect(notification).to.eql({
        channel: {
          id: channel.id,
          type: notification.channel.type
        },
        contact, type
      })
    })
  })

  describe('messages', () => {
    it('send a message', async () => {
      const content = {
        type: 'text',
        payload: 'Test message from Amio SDK'
      }
      const metadata = {
        note: 'Sent by test in Amio SDK'
      }
      const sentMessage = await amioApi.messages.send({
        channel, contact, content, metadata
      })

      expect(sentMessage.id).to.exist

      expect(omit('id', sentMessage)).to.eql({
        channel: {
          id: channel.id,
          type: sentMessage.channel.type
        },
        contact, content, metadata
      })
    })

    it('lists messages', async () => {
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
    it('returns settings', async () => {
      const settingsFound = await amioApi.settings.get(channel.id)
      expect(settingsFound).to.be.an('object')
    })

    it('patches settings', async () => {
      const settingsPatched = await amioApi.settings.set(channel.id, {})
      expect(settingsPatched).to.be.an('object')
      })
  })

})
