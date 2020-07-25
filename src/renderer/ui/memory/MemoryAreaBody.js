'use-strict'

const Component        = require('@renderer/ui/component/Component')
const MemoryVisualizer = require('./MemoryVisualizer')
const Memory           = require('@renderer/models/memory').Memory

/**
 * The body of the memory are. This is roughly a collection
 * of {@link MemoryVis} objects.
 * 
 * This class is only meant to be used within {@link MemoryArea}
 * 
 * @memberof module:memory-ui
 */
class MemoryAreaBody extends Component {
  /**@type {Boolean}*/ #installed
  /**@type {Boolean}*/ #rendered

  /**
   * 
   * @param {String} id 
   * @param {String|JQuery} container 
   */
  constructor(id, container) {
    super(id, container)
    this.name = `MemoryAreaBody[${this.id}]`
    this.visualizers = []
    this.#installed = false
    this.#rendered = false
  }

  /** @returns {MemoryAreaBody} */
  install() {
    if ( !this.isInstalled()) {
      this.render()
      $(this.node).appendTo(this.container)
      this.#installed = true
    }
    return this
  }

  /**
   * Render to the DOM
   * The first call creates the DOM node and renders
   * all available visualizers.
   * Subsequent calls remove the 'contents' of the DOM node (i.e the visualizers)
   * and re-render them. That is because new visualizers may have been-added or
   * removed
   */
  render() {
    if ( !this.isRendered()) {
      this.node = $(`<div class="list-group" id="${this.id}"></div>`)
      this.memoryList = $(`<ul class="list-group" id="heatmap-example"></ul>`).appendTo(this.node)
      this.node.css("max-width", "100%")
              .css("max-height", "90vh")
              .css("overflow-y", "scroll")
    }
    
    // else {
    //   // re-render
    //   $('.memory-visualizer').remove()
    // }

    // this.visualizers.forEach(visualizer => visualizer.render())
    this.rendered = true
    return this;
  }

  /**
   * @param {Memory} memory A Memory object
   */
  addMemory(memory) {
    
    let viz = new MemoryVisualizer(memory, `mem-viz-${memory.getName()}`, `#${this.id}`)

    this.visualizers.push(viz)

    this.memoryList.append(viz.render())
  }

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