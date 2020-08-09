/**@ignore @typedef {import("@renderer/services/memory-vis/view/MemoryVisView")} MemoryVisView */
/**@ignore @typedef {import("@renderer/services/memory-vis/view/MemoryVisViewGrid")} MemoryVisViewGrid */

const App = require('@renderer/app')

class MemoryVisViewGridToolbar {

  /** @type {MemoryVisView} */ #view
  /** @Type {Boolean}       */ #rendered
  /** @Type {JQuery}        */ #node
  /** @type {JQuery}        */ #incSizeButton
  /** @type {JQuery}        */ #decSizeButton
  /** @type {JQuery}        */ #resetSizeButton
  
  /**
   * @param {MemoryVisView} view 
   */
  constructor(view) {
    this.#view = view
    this.#rendered = false
  } 

  isRendered() { return this.#rendered }

  _createZoomButtons() {
    this.#incSizeButton = $(`<button type="button" class="btn kv-btn kv-btn-xs"><i class="fas fa-search-plus"></i></button>`).appendTo(this.#node)
    this.#decSizeButton = $(`<button type="button" class="btn kv-btn kv-btn-xs"><i class="fas fa-search-minus"></i></button>`).appendTo(this.#node)
    this.#resetSizeButton = $(`<button type="button" class="btn kv-btn kv-btn-xs"><i class="fas fa-compress" title="Reset"></i></button>`).appendTo(this.#node)

    let self = this

    this.#incSizeButton.on('click', () => {
      if ( self.#view.grid.canIncreaseSize()) {
        self.#view.grid.increaseSize()
        App.Logger.debug("[user-action]", `increase size of vis ${self.#view.id}:`, self.#view.grid.getSize())
        if ( !self.#view.grid.canDecreaseSize())
          $(this).addClass('disabled')
      } else {
        App.Logger.debug("[user-action]", `increase size of vis ${self.#view.id}:`, "already at max size")
      }
    })

    this.#decSizeButton.on('click', () => {
      if ( self.#view.grid.canDecreaseSize()) {
        self.#view.grid.decreaseSize()
        App.Logger.debug("[user-action]", `decrease size of vis ${self.#view.id}:`, self.#view.grid.getSize())
      } else {
        App.Logger.debug("[user-action]", `decrease size of vis ${self.#view.id}:`, "already at min size")
      }  
    })

    this.#resetSizeButton.on('click', () => {
      if ( self.#view.grid.isInDefaultSize())
        App.Logger.debug("[user-action]", `reset size of vis ${self.#view.id}:`, "already at default size (", self.#view.grid.getSize(), ")")
      else {
        self.#view.grid.resetSize()
        App.Logger.debug("[user-action]", `reset size of vis ${self.#view.id}:`, self.#view.grid.getSize())
      }
    })

  }

  render() {
    if ( !this.isRendered()) {
      this.#node = $(`<div class="btn-toolbar memory-vis-grid-toolbar" class="memory-vis-grid-toolbar"></div>`)
        .appendTo(this.#view.body)

      this._createZoomButtons()

      this.#rendered = true
    }
    return this.#node
  }
}

module.exports = MemoryVisViewGridToolbar