const CommonBuilder = require('./content/common.content-builder')
const TextBuilder = require('./content/text.content-builder')
const StructureBuilder = require('./content/structure.content-builder')
const FileBuilder = require('./content/file.content-builder')


class ContentBuilder extends CommonBuilder {

  static startContent() {
    return new ContentBuilder()
  }

  constructor(){
    super(null, null)
  }

  addQuickReply(quickReply){
    return super.addQuickReply(quickReply)
  }

  typeImage(url){
    return new FileBuilder(url, 'image', this.quickReplies)
  }

  typeAudio(url){
    return new FileBuilder(url, 'audio', this.quickReplies)
  }

  typeVideo(url){
    return new FileBuilder(url, 'video', this.quickReplies)
  }

  typeFile(url){
    return new FileBuilder(url, 'file', this.quickReplies)
  }

  typeGeneric(payload = {}, type = null){
    return new CommonBuilder(payload, type, this.quickReplies)
  }

  typeStructure() {
    return new StructureBuilder(this.quickReplies)
  }

  typeText(text) {
    return new TextBuilder(text, this.quickReplies)
  }
}

module.exports = ContentBuilder.startContent
