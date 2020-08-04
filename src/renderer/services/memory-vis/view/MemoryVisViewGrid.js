/**@ignore @typedef {import("@renderer/services/memory-vis/view/MemoryVisView")} MemoryVisView*/

/**
 * @memberof module:memory-vis
 */
class MemoryVisViewGrid {
  static DEFAULT_VIEWPORT = {x: 'auto', y: 'auto'}
  static DEFAULT_SIZE     = 20

  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////

  /**
   * @type {Object}
   * @property {Object} viewport
   * @property {Number} viewport.x
   * @property {Number} viewport.y
   * @property {Number} size
   */
  Options = {
    viewport: MemoryVisViewGrid.DEFAULT_VIEWPORT,
    size: MemoryVisViewGrid.DEFAULT_SIZE,
    
    fill: {
      none: 'rgb(234, 244, 242)'
    }
  }

  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////

  /** @type {MemoryVisView} */ #view
  /** @type {Boolean}       */ #rendered
  /** @type {JQuery}        */ #node
  /** @type {JQuery}        */ #wrapper

  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////

  /**
   * @param {MemoryVisView} view 
   */
  constructor(view) {
    this.#view = view
    this.#rendered = false
  }

  #renderWrapper = function() {
    return $(`<div class="memory-vis-grid"></div>`)
  }

  /** @returns {JQuery} */
  render() {
    if ( !this.isRendered()) {

      this.#wrapper = this.#renderWrapper()

      this.#rendered = true
    }
    return this.#node
  }

  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////

  /** @returns {Boolean} */
  isRendered() { return this.#rendered }
}

module.exports = MemoryVisViewGrid