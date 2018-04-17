const config = require('../config')
const {AmioApi} = require('../../index')
const expect = require('chai').expect
const omit = require('ramda/src/omit')
const assoc = require('ramda/src/assoc')

let amioApi = null

describe('Amio API Connector', function () {

  before(() => {
    const settings = {
      baseUrl: config.CONNECTOR_API_BASE_URL
    }
    amioApi = new AmioApi(settings)
  })

  describe('API error', () => {
    it('catches a 422 error', async () => {
      await amioApi.messages.send({})
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
    it('send a message', async () => {
      const channel = {
        id: config.CONNECTOR_CHANNEL_ID
      }
      const contact = {
        id: config.CONNECTOR_CONTACT_ID
      }
      const content = {
        type: 'text',
        payload: 'Test message from Amio SDK'
      }
      const metadata = {
        note: 'Sent by test in Amio SDK'
      }
      const sentMessage = await amioApi.messages.send({
        channel, contact, content, metadata
      }, config.CONNECTOR_ACCESS_TOKEN)

      expect(sentMessage.id).to.exist

      expect(omit('id', sentMessage)).to.eql({
        channel: assoc('type', 'facebook_messenger', channel),
        contact,
        content,
        metadata
      })
    })
  })


})
