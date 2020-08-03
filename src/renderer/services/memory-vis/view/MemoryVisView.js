/** @ignore @typedef {import("@renderer/models/memory/Memory")} Memory */

const MemoryVisViewHeader  = require('@renderer/services/memory-vis/view/MemoryVisViewHeader')
const MemoryVisViewGrid = require('@renderer/services/memory-vis/view/MemoryVisViewGrid')
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
  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////
  
  Options = {
    startCollapsed : true
  }

  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////

  /** @type {Memory}  */ #memory
  /** @type {Boolean} */ #rendered
  /** @type {Boolean} */ #collapsed
  /** @type {String}  */ #id

  /** @type {JQuery}              */ #node
  /** @type {MemoryVisViewHeader} */ #header
  /** @type {JQuery}              */ #body
  /** @type {MemoryVisViewGrid}   */ #grid

  /** @returns {JQuery} */
  #renderNode = function() {
    let res = $(`<div class="card w-100 memory-vis" id="${this.id}"></div>`)
        res.css("border-color", MemoryVisView.AddrSpaceColors[this.#memory.getAddressSpace().getValue()])
    return res
  }

  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////

  /**
   * Create a new MemoryVisView instance
   * @param {Memory} memory 
   */
  constructor(memory) {
    this.#id = uuid(10)
    this.#memory = memory
    this.#rendered = false
    this.#collapsed = this.Options.startCollapsed
    this.#header = new MemoryVisViewHeader(this)
    this.#grid = new MemoryVisViewGrid(this)
  }

  /**
   * Collapse/Uncollapse the body of the vis
   * @param {function() => void} [expandCallback=undefined]
   * @param {function() => void} [collapseCallback=undefined]
   * @returns {MemoryVisView} this
   */
  toggleCollapse(expandCallback=undefined, collapseCallback=undefined) {
    if ( this.isCollapsed())
      this.expand(expandCallback)
    else
      this.collapse(collapseCallback)
    return this
  }

  /**
   * Collapse the body of the vis
   * @param {function() => void} [callback=undefined]
   * @returns {MemoryVisView} this
   */
  collapse(callback) {
    if ( this.isRendered()) 
      this.#body.hide(callback)
    this.#collapsed = true
    return this
  }

  /**
   * Expand the body of the vis
   * @param {function() => void} [callback=undefined]
   * @returns {MemoryVisView} this
   */
  expand(callback) {
    if ( this.isRendered()) 
      this.#body.show(callback)
    this.#collapsed = false
    return this
  }

  /**
   * @returns {JQuery}
   */
  render() {
    if ( !this.isRendered()) {
      this.#node = this.#renderNode()
      this.#body = $(`<div class="memory-vis-body"></div>`)

      this.#node.append(this.#header.render())
      this.#node.append(this.#body)
      this.#rendered = true

      if ( this.Options.startCollapsed)
        this.collapse()
    }

    return this.#node
  }

  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////

  /** @returns {Boolean} */
  isRendered() { return this.#rendered }

  /** @returns {Boolean} */
  isCollapsed() { return this.#collapsed }
  
  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////

  /** @type {String} */
  get id() { return this.#id }

  /** @type {Memory} */
  get memory() { return this.#memory }

  /** @type {JQuery} */
  get body() { return this.#body }
}

module.exports = MemoryVisView