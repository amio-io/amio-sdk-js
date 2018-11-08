const is = require('ramda/src/is')
const merge = require('ramda/src/merge')
const isEmpty = require('ramda/src/isEmpty')
const CommonBuilder = require('./content/common.content-builder')
const TextBuilder = require('./content/text.content-builder')
const StructureBuilder = require('./content/structure.content-builder')
const FileBuilder = require('./content/file.content-builder')


class ContentBuilder {

  static typeImage(url){
    return new FileBuilder(url, 'image')
  }

  static typeAudio(url){
    return new FileBuilder(url, 'audio')
  }

  static typeVideo(url){
    return new FileBuilder(url, 'video')
  }

  static typeFile(url){
    return new FileBuilder(url, 'file')
  }

  static typeGeneric(payload = {}, type = null){
    return new CommonBuilder(payload, type)
  }

  static typeStructure() {
    return new StructureBuilder()
  }

  static typeText(text) {
    return new TextBuilder(text)
  }
}

module.exports = ContentBuilder
