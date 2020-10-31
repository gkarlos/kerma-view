const Component = require('../component/Component')
const MemoryAreaTitleBar = require('./MemoryAreaTitlebar')
const MemoryAreaBody = require('./MemoryAreaBody')
const App = require('@renderer/app')


/**@ignore @typedef {import("@renderer/services/memory-vis/MemoryVis")} MemoryVis */

/**
 * The main container for memory visualizations
 * @memberof module:memory-ui
 */
class MemoryArea extends Component {
  /**@type {MemoryAreaTitleBar} */ #title
  /**@type {MemoryAreaBody}     */ #body
  /**@type {JQuery}             */ #node
  /**@type {Boolean}            */ #installed
  /**@type {Boolean}            */ #rendered

  constructor() {
    super("memory-area", "#right")
    this.name = `MemoryArea[${this.id}]`
    this.#installed = false
    this.#rendered = false
    this.#node  = $(`<div class="" id="${this.id}"></div>`)
    this.#title = new MemoryAreaTitleBar("memory-area-titlebar", this.node)
    this.#body  = new MemoryAreaBody("memory-area-body", this.node)
    App.ui.registerComponent(this)
  }

  /** @returns {MemoryArea} */
  install() {
    if ( !this.isInstalled()) {
      this.render()
      this.title.install()
      this.body.install()
      $(this.container).append(this.node)
      this.title.setTitle("Memory")
      this.#installed = true
    }
    return this
  }

  /** @returns {JQuery} */
  render() {
    if ( !this.isRendered()) {
      this.title.render()
      this.body.render()
      this.#rendered = true
      App.emit(App.Events.UI_COMPONENT_READY, this);
    }
    return this.node
  }

  /**
   * @param {MemoryVis} vis
   * @returns {MemoryArea} this
   */
  add(vis) {
    this.body.add(vis)
    return this
  }

  /**
   * @param {MemoryVis} vis
   * @returns {MemoryArea} this
   */
  remove(vis) {
    this.body.remove(vis)
  }

  // /**
  //  * Add a memory to the memory area 
  //  * @returns {MemoryArea} this
  //  */
  // addMemory(memory) {
  //   this.body.addMemory(memory)
  //   return this
  // }

  // /**
  //  * Remove a memory from the memory area (if its already part of it)
  //  * @param {*} memory 
  //  */
  // removeMemory(memory) {

  // }

  // getMemory(name) {
  //   return this.body.getMemory(name)
  // }

  useDefaultControls() {
    // this.title.useDefaultControls()
    // this.body.useDefaultControls()
  }


  ////////////////////////////////
  ////////////////////////////////

  /** @returns {Boolean} */
  isRendered() { return this.#rendered }

  /** @returns {Boolean} */
  isInstalled() { return this.#installed }


  ////////////////////////////////
  ////////////////////////////////

  /** @type {JQuery} */
  get node() { return this.#node }
  /** @type {MemoryAreaTitleBar} */
  get title() { return this.#title}
  /** @type {MemoryAreaBody} */
  get body() { return this.#body }
}

module.exports = MemoryArea