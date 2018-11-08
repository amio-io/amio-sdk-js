const ContentBuilder = require('../../lib/util/content-builder')
const expect = require('chai').expect

const quickReply = {type: 'location'}
const quick_replies = [quickReply]
const url = 'https://amio.io';

describe('ContentBuilder', () => {

  describe('FileBuilder', () => {
    it('creates an audio content', () => {
      const content = ContentBuilder.typeAudio(url)
        .addQuickReply(quickReply)
        .build()

      expect(content).to.eql({
        type: 'audio',
        payload: url,
        quick_replies
      })
    })

    it('creates an image content', () => {
      const content = ContentBuilder.typeImage(url)
        .addQuickReply(quickReply)
        .build()

      expect(content).to.eql({
        type: 'image',
        payload: url,
        quick_replies
      })
    })

    it('creates a video content', () => {
      const content = ContentBuilder.typeVideo(url)
        .addQuickReply(quickReply)
        .build()

      expect(content).to.eql({
        type: 'video',
        payload: url,
        quick_replies
      })
    })

    it('creates a file content', () => {
      const content = ContentBuilder.typeFile(url)
        .addQuickReply(quickReply)
        .build()

      expect(content).to.eql({
        type: 'file',
        payload: url,
        quick_replies
      })
    })
  })

  describe('GenericBuilder', () => {
    it('creates an empty message', () => {
      const content = ContentBuilder.typeGeneric()
        .build();

      expect(content).to.eql({
        type: null,
        payload: {}
      })
    })

    it('creates a non-empty message', () => {
      const content = ContentBuilder.typeGeneric('xxx', 'text')
        .addQuickReply(quickReply)
        .build();

      expect(content).to.eql({
        type: 'text',
        payload: 'xxx',
        quick_replies
      })
    })
  })

  describe('TextBuilder', () => {
    it('Text and QuickReply', () => {
      const payload = 'text';
      const content = ContentBuilder.typeText(payload)
        .addQuickReply(quickReply)
        .build()

      expect(content).to.eql({type: 'text', payload, quick_replies})
    })
  })

  describe('StructureBuilder', () => {

    it('1 card with all fields', () => {
      const content = ContentBuilder.typeStructure()
        .setText('text')
        .setTitle('title')
        .addButtonPostback('postback', 'payload')
        .addButtonUrl('url', url)
        .addButtonCall('phone', '+0123456789')
        .addQuickReply(quickReply)
        .build();

      expect(content).to.eql({
        type: 'structure',
        payload: {
          text: 'text',
          title: 'title',
          buttons: [
            {type: 'postback', title: 'postback', payload: 'payload'},
            {type: 'url', title: 'url', payload: url},
            {type: 'phone', title: 'phone', payload: '+0123456789'},
          ]
        },
        quick_replies
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
