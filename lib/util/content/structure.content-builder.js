const is = require('ramda/src/is')
const append = require('ramda/src/append')
const clone = require('ramda/src/clone')
const CommonBuilder = require('./common.content-builder')

class StructureContentBuilder extends CommonBuilder {

  constructor() {
    super()
    this.type = 'structure'
    this.payload = []
    this.currentCard = {}
  }

  _getPayload(){
    if(this.payload.length === 0){
      return this.currentCard
    }

    return append(clone(this.currentCard), this.payload)
  }

  // TODO card is not in the docs. We are using 'message' but it's strange too. :/
  addNextCard() {
    this.payload = append(clone(this.currentCard), this.payload)
    this.currentCard = {}
    return this
  }

  setTitle(title) {
    this.currentCard.title = title
    return this
  }

  setText(text) {
    this.currentCard.text = text
    return this
  }

  addButtonPostback(title, payload){
    return this.addButton('postback', title, payload)
  }

  addButtonUrl(title, url) {
    // TODO validate url
    return this.addButton('url', title, url)
  }

  addButtonCall(title, phoneNumber){
    return this.addButton('phone', title, phoneNumber)
  }

  addButton(typeOrButton, title, payload) {
    if (!this.currentCard.buttons) this.currentCard.buttons = []

    if (is(Object, typeOrButton)) {
      this.currentCard.buttons.push(typeOrButton)
    } else {
      this.currentCard.buttons.push({
        type: typeOrButton,
        title,
        payload
      })
    }

    return this
  }


}

module.exports = StructureContentBuilder
