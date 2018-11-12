const CommonBuilder = require('./common.content-builder')

class FileContentBuilder extends CommonBuilder {

  constructor(url, type, quickReplies = []) {
    super({url}, type, quickReplies)
  }
}

module.exports = FileContentBuilder
