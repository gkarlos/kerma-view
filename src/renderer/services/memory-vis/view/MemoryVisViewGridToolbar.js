/**@ignore @typedef {import("@renderer/services/memory-vis/view/MemoryVisView")} MemoryVisView */
/**@ignore @typedef {import("@renderer/services/memory-vis/view/MemoryVisViewGrid")} MemoryVisViewGrid */
/**@ignore @typedef {import("@renderer/services/memory-vis/view/MemoryVisViewGridTooltip")} MemoryVisViewGridTooltip */

const App = require('@renderer/app')
const MemoryVisViewGridTooltip = require("./MemoryVisViewGridTooltip")

class MemoryVisViewGridToolbar {

  /** @type {MemoryVisView} */ #view
  /** @Type {Boolean}       */ #rendered
  /** @Type {JQuery}        */ #node
  /** @type {JQuery}        */ #incSizeButton
  /** @type {JQuery}        */ #decSizeButton
  /** @type {JQuery}        */ #resetSizeButton
  /** @type {JQuery}        */ #leftButton
  /** @type {JQuery}        */ #rightButton
  /** @type {JQuery}        */ #upButton
  /** @type {JQuery}        */ #downButton
  /** @type {MemoryVisViewGridTooltip} */ #tooltip
  
  
  /**
   * @param {MemoryVisView} view 
   */
  constructor(view) {
    this.#view = view
    this.#rendered = false
  } 

  /**
   * @type {JQuery}
   */
  get node() { return this.#node }

  /** @type {MemoryVisViewGridTooltip} */
  get tooltip() { return this.#tooltip}

  isRendered() { return this.#rendered }

  _createTooltip() {
    this.#tooltip = new MemoryVisViewGridTooltip(this.#view)
    this.#tooltip.render()
  }

  _createZoomButtons() {
    this.#resetSizeButton = $(`<button type="button" class="btn kv-btn kv-btn-xs"><i class="fas fa-compress" title="Reset"></i></button>`).appendTo(this.#node)
    this.#decSizeButton = $(`<button type="button" class="btn kv-btn kv-btn-xs"><i class="fas fa-search-minus"></i></button>`).appendTo(this.#node)
    this.#incSizeButton = $(`<button type="button" class="btn kv-btn kv-btn-xs"><i class="fas fa-search-plus"></i></button>`).appendTo(this.#node)
    this.#rightButton = $(`<button type="button" class="btn kv-btn kv-btn-xs memory-vis-toolbar-button-right"><i class="fas fa-angle-right"></i></i></button>`).appendTo(this.#node)
    this.#downButton  = $(`<button type="button" class="btn kv-btn kv-btn-xs memory-vis-toolbar-button-down"><i class="fas fa-angle-down"></i></i></button>`).appendTo(this.#node)
    this.#upButton    = $(`<button type="button" class="btn kv-btn kv-btn-xs memory-vis-toolbar-button-up"><i class="fas fa-angle-up"></i></button>`).appendTo(this.#node)
    this.#leftButton  = $(`<button type="button" class="btn kv-btn kv-btn-xs memory-vis-toolbar-button-left"><i class="fas fa-angle-left"></i></i></button>`).appendTo(this.#node)
    
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

    this.#rightButton.on('click', () => {
      let oldRange = self.#view.grid.getXRange();
      self.#view.grid.right();
      let newRange = self.#view.grid.getXRange();
      let changed = oldRange[0] != newRange[0]
      App.Logger.debug("[user-action]", `Shift vis ${self.#view.id} right.`, `Visible x-range: ${newRange}`, !changed? "(no change)" : "");
    })

    this.#leftButton.on('click', () => {
      let oldRange = self.#view.grid.getXRange();
      self.#view.grid.left();
      let newRange = self.#view.grid.getXRange();
      let changed = oldRange[0] != newRange[0]
      App.Logger.debug("[user-action]", `Shift vis ${self.#view.id} left.`, `Visible x-range: ${newRange}`, !changed? "(no change)" : "");
    })

  }

  render() {
    if ( !this.isRendered()) {
      this.#node = $(`<div class="btn-toolbar memory-vis-grid-toolbar" class="memory-vis-grid-toolbar"></div>`)
        .appendTo(this.#view.body)

      this._createTooltip()
      this._createZoomButtons()

      this.#rendered = true
    }
    return this.#node
  }
}

module.exports = MemoryVisViewGridToolbar