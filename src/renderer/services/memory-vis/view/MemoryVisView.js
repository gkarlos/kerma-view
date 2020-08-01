/** @ignore @typedef {import("@renderer/models/memory/Memory")} Memory */

const MemoryVisViewHeader  = require('@renderer/services/memory-vis/view/MemoryVisViewHeader')
const { CudaAddressSpace } = require("@renderer/models/cuda")
const Types = require('@renderer/models/types/Types')
const {uuid} = require('@renderer/util/random')

/**
 * View of a memory visualization
 * @memberof module:memory-vis
 */
class MemoryVisView {

  static AddrSpaceColors = [/* generic */ '', 
                            /* global  */ '#FFF55C',
                            /* n/a     */ '',
                            /* shared  */ '#DEFF9B',
                            /* constant*/ 'cadetblue', 
                            /* local   */ '#C4C4C4' ]

  /** @type {Memory}  */ #memory
  /** @type {Boolean} */ #rendered
  /** @type {MemoryVisViewHeader} */ #header
  /** @type {JQuery}  */ contents
  /** @type {String}  */ #id

  /**
   * Create a new MemoryVisView instance
   * @param {Memory} memory 
   */
  constructor(memory) {
    this.#id = uuid(10)
    this.#memory = memory
    this.#rendered = false
    this.#header = new MemoryVisViewHeader(this)
  }
  
  /**
   * @returns {JQuery}
   */
  render() {
    if ( !this.isRendered()) {
      this.node = $(`<div class="card w-100 memory-vis" id="${this.id}"></div>`)
      this.node.append(this.#header.render())
      this.contents = $(`<div class="card-body"></div>`).appendTo($(this.node))

      this.node.css("border-color", MemoryVisView.AddrSpaceColors[this.#memory.getAddressSpace().getValue()])
      
      this.#rendered = true
    }

    return this.node
  }

  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////

  /** @returns {Boolean} */
  isRendered() { return this.#rendered }

  
  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////

  /** @type {String} */
  get id() { return this.#id }

  /** @type {Memory} */
  get memory() { return this.#memory }
}

module.exports = MemoryVisView