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

describe('Amio API', function () {

  describe('contacts', () => {
    it('find a contact', async () => {
      const contactFound = await amioApi.contacts.get(channel.id, contact.id)

      expect(contactFound).to.include.all.keys('id', 'name')
      expect(contactFound.id).to.eql(contact.id)
    })

    it('list contacts', async () => {
      const max = 2
      const offset = 0
      const params = {max, offset}

      const contactList = await amioApi.contacts.list(channel.id, params)

      expect(contactList).to.have.all.keys('items', 'totalCount')
      expect(contactList.items).to.be.an('array')
      expect(contactList.items[0]).to.include.all.keys('id', 'name')
      expect(contactList.totalCount).to.be.a('number')
    })

    it('fail to delete contact', async () => {
      const contactNotFound = await amioApi.contacts.delete(channel.id, 123).catch(e => e.amioApiError.status.code)
      expect(contactNotFound).to.equal(404)
    })
  })
})
