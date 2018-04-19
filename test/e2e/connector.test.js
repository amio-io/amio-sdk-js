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

  describe('notifications', () => {
    it('send a notification', async () => {

      const type = 'typing_on'
      const notification = await amioApi.notifications.send({
        channel, contact, type
      })

      expect(notification).to.eql({
        channel: assoc('type', 'facebook_messenger', channel),
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
        channel: assoc('type', 'facebook_messenger', channel),
        contact, content, metadata
      })
    })
  })


})
