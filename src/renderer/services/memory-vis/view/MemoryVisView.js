/** @ignore @typedef {import("@renderer/services/memory-vis/MemoryVisModel")} MemoryVisModel */
/** @ignore @typedef {import("@renderer/models/memory/Memory")} Memory */
/** @ignore @typedef {import("@renderer/models/Index")} Index */

const MemoryVisViewHeader  = require('@renderer/services/memory-vis/view/MemoryVisViewHeader')
const MemoryVisViewGrid = require('@renderer/services/memory-vis/view/MemoryVisViewGrid')
const MemoryVisViewGridTooltip = require('@renderer/services/memory-vis/view/MemoryVisViewGridTooltip')
const MemoryVisViewGridToolbar = require('@renderer/services/memory-vis/view/MemoryVisViewGridToolbar')

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

  /**
   * Options for all vis views
   */
  static Options = {
    /**
     * `true` -  Visualizations initially collapsed - only the header is shown
     * `false` - Visualizations initially expanded
     * @type {Boolean}
     */
    startCollapsed : false
  }

  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////

  /** @type {MemoryVisModel}  */ #model
  /** @type {Boolean}         */ #rendered
  /** @type {Boolean}         */ #collapsed
  /** @type {String}          */ #id

  /** @type {JQuery}              */ #node
  /** @type {MemoryVisViewHeader} */ #header
  /** @type {JQuery}              */ #body
  /** @type {MemoryVisViewGrid}   */ #grid
  /** @type {MemoryVisViewGridTooltip} */ #gridTooltip
  /** @type {MemoryVisViewGridToolbar} */ #gridToolbar

  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////

  /**
   * Create a new MemoryVisView instance
   * @param {Memory} memory 
   */
  constructor(model) {
    this.#model = model
    this.#rendered = false
    this.#collapsed = MemoryVisView.Options.startCollapsed
    this.#header = new MemoryVisViewHeader(this)
    this.#grid = new MemoryVisViewGrid(this)
    this.#gridTooltip = new MemoryVisViewGridTooltip(this)
    this.#gridToolbar = new MemoryVisViewGridToolbar(this)
  }

  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////

  /** @type {String} */
  get id() { return this.#model.id }

  /** @type {MemoryVisModel} */
  get model() { return this.#model }

  /** @type {Memory} */
  get memory() { return this.#model.getMemory() }

  /** @type {JQuery} */
  get body() { return this.#body }

  /** @type {MemoryVisViewHeader} */
  get header() { return this.#header }

  /** @type {MemoryVisViewGrid} */
  get grid() { return this.#grid }

  /** @type {MemoryVisViewGridTooltip} */
  get tooltip() { return this.#gridTooltip }

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

  /**
   * Collapse/Expand the body of the vis
   * @param {function():void} [expandCallback=undefined]
   * @param {function():void} [collapseCallback=undefined]
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
   * @param {function():void} [callback=undefined]
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
   * @param {function():void} [callback=undefined]
   * @returns {MemoryVisView} this
   */
  expand(callback) {
    if ( this.isRendered()) 
      this.#body.show(callback)
    this.#collapsed = false
    return this
  }

  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////

  /** @returns {JQuery} */
  #renderNode = function() {
    let res = $(`<div class="card w-100 memory-vis" id="${this.id}"></div>`)
        res.css("border-color", MemoryVisView.AddrSpaceColors[this.#model.memory.getAddressSpace().getValue()])
    return res
  }

  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////

  /**
   * @param {Index} idx
   */
  read(idx) {
    this.#grid.read(idx)
  }

  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////

  /**
   * Create a DOM element for this view
   * and return it.
   * @returns {JQuery}
   */
  render() {
    if ( !this.isRendered()) {
      this.#node = this.#renderNode()
      this.#body = $(`<div class="memory-vis-body"></div>`)

      this.#node.append(this.#header.render())
      this.#node.append(this.#body)
      this.#rendered = true

      if ( MemoryVisView.Options.startCollapsed)
        this.collapse()
      
      $(this.#body).ready(() => {
        this.#gridTooltip.render()
        this.#gridToolbar.render()
        this.#grid.render()
      })
    }

    return this.#node
  }
}

module.exports = MemoryVisView