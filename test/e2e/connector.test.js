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
    it('finds a contact', async () => {
      const contactFound = await amioApi.contacts.get(channel.id, contact.id)

      expect(contactFound).to.include.all.keys('id', 'name')
      expect(contactFound).to.have.any.keys('gender', 'locale', 'country', 'time_zone', 'photo_url')
      expect(contactFound.id).to.eql(contact.id)
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
    it('sends a message', async () => {
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
      const option = {"get_started_button": null}
      const settingsPatched = await amioApi.settings.set(channel.id, option)
      expect(settingsPatched).to.eql({})
    })
  })

})
