const is = require('ramda/src/is')
const merge = require('ramda/src/merge')
const isEmpty = require('ramda/src/isEmpty')

class CommonContentBuilder {

  constructor(payload = {}, type = null) {
    this.type = type
    this.payload = payload
    this.quickReplies = []
  }

  _getPayload(){
    return this.payload
  }

  addQuickReply(quickReply) {
    if (is(Object, quickReply)) {
      this.quickReplies.push(quickReply)
    } else {
      this.quickReplies.push({
        type: quickReply
      })
    }
    return this
  }

  build() {
    const content = this._resolveContent()

    if (isEmpty(this.quickReplies)) return content

    return merge(content, {quick_replies: this.quickReplies})
  }

  _resolveContent(){
    if(this.content) return this.content

    return {
      type: this.type,
      payload: this._getPayload()
    }
  }

}

module.exports = CommonContentBuilder
