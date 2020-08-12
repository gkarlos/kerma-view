/**@ignore @typedef {import("@renderer/services/memory-vis/view/MemoryVisView")} MemoryVisView */

class MemoryVisViewGridTooltip {
  /** @type {MemoryVisView} */ #view
  /** @type {Boolean}       */ #rendered
  /** @type {JQuery}        */ #node
  /** @type {String}        */ #nodeClass
  /** @type {String}        */ #nodeId

  ////////////////////////////////
  ////////////////////////////////
  //////////////////////////////// 
  
  /**
   * 
   * @param {MemoryVisView} view 
   */
  constructor(view) {
    this.#view = view
    this.#rendered = false
    this.#nodeClass  = "memory-vis-grid-tooltip"
    this.#nodeId = `grid-tooltip-${this.#view.id}`
  }

  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////

  /** @returns {Boolean} */
  isRendered() { return this.#rendered }

  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////


  show() {
    this.#node.show()
  }

  hide() {
    this.#node.hide()
  }

  contents(html) {
    this.#node.html(html);
  }

  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////

  _renderNode() {
    return $(`
      <div class="${this.#nodeClass}" id="${this.#nodeId}"></div>
    `)
  }

  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////

  render() {
    if ( !this.isRendered()) {
      this.#node = this._renderNode().appendTo(this.#view.body)
    }
    return this.#node
  }
}

module.exports = MemoryVisViewGridTooltip