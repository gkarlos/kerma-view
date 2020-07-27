'use-strict'

const Component        = require('@renderer/ui/component/Component')

/**@ignore @typedef {import("@renderer/services/memory-vis/MemoryVis")} MemoryVis */

/**
 * The body of the memory are. This is roughly a collection
 * of {@link MemoryVis} objects.
 * 
 * This class is only meant to be used within {@link MemoryArea}
 * 
 * @memberof module:memory-ui
 */
class MemoryAreaBody extends Component {
  /**@type {Boolean}     */ #installed
  /**@type {Boolean}     */ #rendered
  /**@type {MemoryVis[]} */ #visualizations

  /**
   * 
   * @param {String} id 
   * @param {String|JQuery} container 
   */
  constructor(id, container) {
    super(id, container)
    this.name = `MemoryAreaBody[${this.id}]`
    this.#visualizations = []
    this.#installed  = false
    this.#rendered   = false
  }

  /** @returns {MemoryAreaBody} */
  install() {
    if ( !this.isInstalled()) {
      this.render()
      $(this.node).appendTo(this.container)
      this.#visualizations.forEach(vis => this.memoryList.append(vis.render()))
      this.#installed = true
    }
    return this
  }

  /**
   * Render to the DOM
   * @returns {JQuery}
   */
  render() {
    console
    if ( !this.isRendered()) {
      this.node = $(`<div id="${this.id}" data-simplebar></div>`)
      this.memoryList = $(`<div id="memory-vis-list"></div>`).appendTo(this.node)
      this.node.css("max-width", "100%")
               .css("max-height", "90vh")
      this.#rendered = true
    }
    
    return this.node;
  }

  /**
   * Add a MemoryVis. 
   * If the component is installed the vis will also be rendered to the DOM. 
   * If the component is not installed the vis will be render at the next call of `install()`
   * @param {MemoryVis} vis
   * @returns {MemoryAreaBody} 
   */
  add(vis) {
    this.#visualizations.push(vis)
    if ( this.isInstalled())
      $(this.memoryList).append(vis.getView().render())
    return this
  }

  /**
   * Remove a MemoryVis. If the vis is part of this component it will be removed.
   * If the vis was not registered with this component (i.e was not added with `add()`),
   * no action is taken.
   * @param {MemoryVis} vis
   * @returns {MemoryAreaBody} 
   */
  remove(vis) {
    for ( let i = 0; i < this.#visualizations.length; ++i) {
      if ( this.#visualizations[i].equals(vis)) {
        this.memoryList.remove(vis.render())
        break;
      }
    }
    return this
  }

  /**
   * Remove all currently displaying visualizations
   * @returns {MemoryAreaBody}
   */
  removeAll() {
    this.#visualizations.forEach(vis => this.memoryList.remove(vis.render()))
    return this
  }


  


  // /**
  //  * @param {Memory} memory A Memory object
  //  */
  // addMemory(memory) {
    
  //   let viz = new MemoryVisualizer(memory, `mem-viz-${memory.getName()}`, `#${this.id}`)

  //   this.visualizers.push(viz)

  //   this.memoryList.append(vrender())
  // }

  useDefaultControls() {

  }

  ////////////////////////////////
  ////////////////////////////////

  /** @returns {Boolean} */
  isRendered() { return this.#rendered }

  /** @returns {Boolean} */
  isInstalled() { return this.#installed }
}

module.exports = MemoryAreaBody