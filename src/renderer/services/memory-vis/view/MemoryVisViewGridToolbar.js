/**@ignore @typedef {import("@renderer/services/memory-vis/view/MemoryVisView")} MemoryVisView */
/**@ignore @typedef {import("@renderer/services/memory-vis/view/MemoryVisViewGrid")} MemoryVisViewGrid */

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

  render() {
    if ( !this.isRendered()) {
      this.#node = $(`<div class="btn-toolbar" class="memory-vis-grid-toolbar"></div>`)
        .appendTo(this.#view.body)

      this.#decSizeButton = $(`<button type="button" class="btn kv-btn kv-btn-sm"><i class="fas fa-minus-square"></i></button>`).appendTo(this.#node)
      this.#incSizeButton = $(`<button type="button" class="btn kv-btn kv-btn-sm"><i class="fas fa-plus-square"></i></button>`).appendTo(this.#node)

      let self = this
      this.#incSizeButton.on('click', () => {
        if ( self.#view.grid.canIncreaseSize())
          self.#view.grid.increaseSize()
      })
      this.#rendered = true


    }
    return this.#node
  }
}

module.exports = MemoryVisViewGridToolbar