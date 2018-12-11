const contentBuilder = require('../../lib/util/content/content-builder')
const expect = require('chai').expect

const quickReply = {type: 'location'}
const quick_replies = [quickReply]
const url = 'https://amio.io';

describe('contentBuilder', () => {

  describe('FileBuilder', () => {
    it('creates an audio content', () => {
      const content = contentBuilder.typeAudio(url)
        .addQuickReply(quickReply)
        .build()

      expect(content).to.eql({
        type: 'audio',
        payload: {url: url},
        quick_replies
      })
    })

    it('creates an image content', () => {
      const content = contentBuilder.typeImage(url)
        .addQuickReply(quickReply)
        .build()

      expect(content).to.eql({
        type: 'image',
        payload: {url},
        quick_replies
      })
    })

    it('creates a video content', () => {
      const content = contentBuilder.typeVideo(url)
        .addQuickReply(quickReply)
        .build()

      expect(content).to.eql({
        type: 'video',
        payload: {url},
        quick_replies
      })
    })

    it('creates a file content', () => {
      const content = contentBuilder.typeFile(url)
        .addQuickReply(quickReply)
        .build()

      expect(content).to.eql({
        type: 'file',
        payload: {url},
        quick_replies
      })
    })
  })

  describe('GenericBuilder', () => {
    it('creates an empty message', () => {
      const content = contentBuilder.typeGeneric()
        .build();

      expect(content).to.eql({
        type: null,
        payload: {}
      })
    })

    it('creates a non-empty message', () => {
      const content = contentBuilder.typeGeneric('xxx', 'text')
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
      const content = contentBuilder.typeText(payload)
        .addQuickReply(quickReply)
        .build()

      expect(content).to.eql({type: 'text', payload, quick_replies})
    })
  })

  describe('StructureBuilder', () => {

    it('1 structure with all fields', () => {
      const content = contentBuilder.typeStructure()
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

    it('2 structures', () => {
      const content = contentBuilder.typeStructure()
        .setText('structure 1')
        .addNextStructure()
        .setText('structure 2')
        .build();

      expect(content).to.eql({
        type: 'structure',
        payload: [
          {text: 'structure 1'},
          {text: 'structure 2'}
        ]
      })
    })


  })

})
