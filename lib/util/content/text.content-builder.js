const is = require('ramda/src/is')
const CommonBuilder = require('./common.content-builder')

class TextContentBuilder extends CommonBuilder {
  constructor(text) {
    super()
    this.type = 'text'
    this.payload = text
  }
}

module.exports = TextContentBuilder
