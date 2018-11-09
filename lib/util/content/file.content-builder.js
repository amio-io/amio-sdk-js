const is = require('ramda/src/is')
const CommonBuilder = require('./common.content-builder')

class FileContentBuilder extends CommonBuilder {

  constructor(url, type) {
    super({url}, type)
  }
}

module.exports = FileContentBuilder
