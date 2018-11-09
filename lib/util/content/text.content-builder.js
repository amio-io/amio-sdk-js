const is = require('ramda/src/is')
const CommonBuilder = require('./common.content-builder')

class TextContentBuilder extends CommonBuilder {
  constructor(text) {
    super(text, 'text')
  }
}

module.exports = TextContentBuilder
