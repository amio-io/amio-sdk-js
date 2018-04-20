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
      // const
      //   channel_id = channel.id,
      //   contact_id = contact.id

      const contactFound = await amioApi.contacts.get(channel.id, contact.id)

      expect(contactFound).to.include.all.keys('id', 'name')
      expect(contactFound).to.have.any.keys('gender', 'locale', 'country', 'time_zone', 'photo_url')
      expect(contactFound.id).to.eql(contact.id)
    })

    it('lists all contacts', async () => {
      const contactList = await amioApi.contacts.list(channel.id)

      expect(contactList).to.be.an('array')
    })

    it.skip('deletes a contact', async () => {
      const contactDeleted = await amioApi.contacts.delete(channel.id, contact.id)

      expect(contactDeleted).to.be.null
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
  })


})
