/** @ignore @typedef {import("@renderer/models/memory/Memory")} Memory */

/**
 * View of a memory visualization
 * @memberof module:memory-vis
 */
class MemoryVisView {
  /** @type {Memory}  */ #memory
  /** @type {Boolean} */ #rendered
  /** @type {JQuery}  */ #node

  /**
   * Create a new MemoryVisView instance
   * @param {Memory} memory 
   */
  constructor(memory) {
    this.#memory = memory
    this.#rendered = false
  }
  
  /**
   * @returns {JQuery}
   */
  render() {
    if ( !this.isRendered()) {
      this.node = $(`<div>${this.#memory.toString()}</li>`)
      this.#rendered = true
    }
    return this.node
  }

  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////

  /** @returns {Boolean} */
  isRendered() { return this.#rendered }
}

module.exports = MemoryVisView