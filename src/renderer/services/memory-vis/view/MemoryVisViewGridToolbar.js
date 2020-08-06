/**@ignore @typedef {import("@renderer/services/memory-vis/view/MemoryVisView")} MemoryVisView */
/**@ignore @typedef {import("@renderer/services/memory-vis/view/MemoryVisViewGrid")} MemoryVisViewGrid */

const App = require('@renderer/app')

class MemoryVisViewGridToolbar {

  /** @type {MemoryVisView} */ #view
  /** @Type {Boolean}       */ #rendered
  /** @Type {JQuery}        */ #node
  /** @type {JQuery}        */ #incSizeButton
  /** @type {JQuery}        */ #decSizeButton
  
  /**
   * @param {MemoryVisView} view 
   */
  constructor(view) {
    this.#view = view
    this.#rendered = false
  } 

  isRendered() { return this.#rendered }

  _createZoomButtons() {
    this.#decSizeButton = $(`<button type="button" class="btn kv-btn kv-btn-sm"><i class="fas fa-minus-square"></i></button>`).appendTo(this.#node)
    this.#incSizeButton = $(`<button type="button" class="btn kv-btn kv-btn-sm"><i class="fas fa-plus-square"></i></button>`).appendTo(this.#node)

    let self = this

    this.#incSizeButton.on('click', () => {
      if ( self.#view.grid.canIncreaseSize()) {
        self.#view.grid.increaseSize()
        App.Logger.debug("[user-action]", `increase size of vis:${self.#view.id}:`, self.#view.grid.getSize())
        if ( !self.#view.grid.canDecreaseSize())
          $(this).addClass('disabled')
      } else {
        App.Logger.debug("[user-action]", `increase size of vis:${self.#view.id}:`, "already at max size")
      }
    })

    this.#decSizeButton.on('click', () => {
      if ( self.#view.grid.canDecreaseSize()) {
        self.#view.grid.decreaseSize()
        App.Logger.debug("[user-action]", `increase size of vis:${self.#view.id}:`, self.#view.grid.getSize())
      } else {
        App.Logger.debug("[user-action]", `increase size of vis:${self.#view.id}:`, "already at max size")
      }  
    })
  }

  render() {
    if ( !this.isRendered()) {
      this.#node = $(`<div class="btn-toolbar" class="memory-vis-grid-toolbar"></div>`)
        .appendTo(this.#view.body)

      this._createZoomButtons()

      this.#rendered = true
    }
    return this.#node
  }
}

module.exports = MemoryVisViewGridToolbar