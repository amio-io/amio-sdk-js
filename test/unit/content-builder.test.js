const ContentBuilder = require('../../lib/util/content-builder')
const expect = require('chai').expect


describe('ContentBuilder', () => {

  describe('GenericBuilder', () => {





  })

  describe('TextBuilder', () => {})

  describe('StructureBuilder', () => {

    it('1 card with all fields', () => {
        const content = ContentBuilder.typeStructure()
          .setText('text')
          .setTitle('title')
          .addButtonPostback('postback', 'payload')
          .addButtonUrl('url', 'https://amio.io')
          .addButtonCall('phone', '+0123456789')
          .addQuickReply('xxx')
          .build();

        expect(content).to.eql({
          type: 'structure',
          payload: {
            text: 'text',
            title: 'title',
            buttons: [
              {type: 'postback', title: 'postback', payload: 'payload'},
              {type: 'url', title: 'url', payload: 'https://amio.io'},
              {type: 'phone', title: 'phone', payload: '+0123456789'},
            ]
          },
          quick_replies: [{type: 'xxx'}]
        })
    })

    it('2 cards', () => {
        const content = ContentBuilder.typeStructure()
          .setText('text')
          .addNextCard()
          .setText('text2')
          .build();

        expect(content).to.eql({
          type: 'structure',
          payload: [
            {text: 'text'},
            {text: 'text2'}
          ]
        })
    })


  })

})
