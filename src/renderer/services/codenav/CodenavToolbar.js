const CodenavToolbarView = require('./CodenavToolbarView')
/**
 * @memberof module:codenav
 */
class CodenavToolbar  {
  /** @type {CodenavToolbarView} */
  #view

  constructor() {
    this.#view = new CodenavToolbarView().render()
  }

  // static defaultCreate(id, container, app) {
  //   let codeNavToolbar = new CodeNavToolbar(id, container, app).render()
  //   return codeNavToolbar;
  // }
}

module.exports = CodenavToolbar