const is = require('ramda/src/is')
const clone = require('ramda/src/clone')
const merge = require('ramda/src/merge')
const isEmpty = require('ramda/src/isEmpty')


class ContentBuilder {

  static typeStructure() {
    return new StructureBuilder()
  }

  static typeText(text) {
    return new TextBuilder(text)
  }
}

class CommonBuilder {

  constructor() {
    this.type = null
    this.payload = null
    this.quickReplies = []
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
    const result = {
      type: this.type,
      payload: this.payload
    }

    if (isEmpty(this.quickReplies)) return result

    return merge(result, {quick_replies: this.quickReplies})
  }

}

class TextBuilder extends CommonBuilder {
  constructor(text) {
    super()
    this.type = 'text'
    this.payload = text
  }
}

class StructureBuilder extends CommonBuilder {

  constructor() {
    super()
    this.type = 'structure'
    this.payload = {}
  }

  setTitle(title) {
    this.payload.title = title
    return this
  }

  setText(text) {
    this.payload.text = text
    return this
  }

  addButtonPostback(title, payload){
    return this.addButton('postback', title, payload)
  }

  addButtonUrl(title, url) {
    return this.addButton('url', title, url)
  }

  addButton(typeOrButton, title, payload) {
    if (!this.payload.buttons) this.payload.buttons = []

    if (is(Object, typeOrButton)) {
      this.payload.buttons.push(typeOrButton)
    } else {
      this.payload.buttons.push({
        type: typeOrButton,
        title,
        payload
      })
    }

    return this
  }

}

module.exports = ContentBuilder
