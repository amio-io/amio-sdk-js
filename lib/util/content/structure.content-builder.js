const is = require('ramda/src/is')
const CommonBuilder = require('./common.content-builder')

class StructureContentBuilder extends CommonBuilder {

  constructor() {
    super([], 'structure')
    this.currentStructure = {}
  }

  _getPayload(){
    if(this.payload.length === 0){
      return this.currentStructure
    }

    this.payload.push(this.currentStructure)
    return this.payload
  }

  addNextStructure() {
    this.payload.push(this.currentStructure)
    this.currentStructure = {}
    return this
  }

  setTitle(title) {
    this.currentStructure.title = title
    return this
  }

  setText(text) {
    this.currentStructure.text = text
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
    if (!this.currentStructure.buttons) this.currentStructure.buttons = []

    if (is(Object, typeOrButton)) {
      this.currentStructure.buttons.push(typeOrButton)
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
