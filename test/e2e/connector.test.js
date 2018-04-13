const {AmioConnector} = require('../../index')
const expect = require('chai').expect
const config = require('../config')
const omit = require('ramda/src/omit')
const assoc = require('ramda/src/assoc')

let amioConnector = null

describe('Connector', function () {

  before(() => {
    const settings = {
      baseUrl: config.CONNECTOR_API_BASE_URL
    }
    amioConnector = new AmioConnector(settings)
  })

  it('Send Message', async () => {
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
    const sentMessage = await amioConnector.sendMessage(channel, contact, content, metadata, config.CONNECTOR_ACCESS_TOKEN)

    expect(sentMessage.id).to.exist

    expect(omit('id', sentMessage)).to.eql({
      channel: assoc('type', 'facebook_messenger', channel),
      contact,
      content,
      metadata
    })
  }).timeout(10000) // send message takes from 5s to 10s

})
