'use-strict'

const Component        = require('@renderer/ui/component/Component')
const MemoryVisualizer = require('./MemoryVisualizer')
const Memory           = require('@renderer/model/memory').Memory

/**
 * The body of the memory are. This is roughly a collection
 * of {@link MemoryVis} objects.
 * 
 * This class is only meant to be used within {@link MemoryArea}
 * 
 * @memberof module:ui/memory
 */
class MemoryAreaBody extends Component {
  constructor(id, container, app) {
    super()
    this.id = id;
    this.container = container;
    this.app = app
    this.name = `MemoryAreaBody[${this.id}]`
    this.visualizers = []
    this.rendered = false;
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
    if ( !this.rendered) {
      this.node = $(`
      <div class="list-group" id="${this.id}">
        <ul class="list-group" id="heatmap-example"></ul>
      </div>`).appendTo(this.container)
      
      this.node.css("max-width", "100%")
              .css("max-height", "90vh")
              .css("overflow-y", "scroll")
    } else {
      // re-render
      $('.memory-visualizer').remove()
    }

    this.visualizers.forEach(visualizer => visualizer.render())
    this.rendered = true
    return this;
  }

  /**
   * @param {Memory} memory A Memory object
   * @param {boolean} forceRender  If true, if the MemoryAreaBody is rendered, the memory
   *                               will be immediately rendered
   *                               If false, the memory will be rendered at the next {@link render()} call
   */
  addMemory(memory,forceRender=true) {
    
    let viz = new MemoryVisualizer(memory, `mem-viz-${memory.getName()}`, `#${this.id}`, this.app)

    this.visualizers.push(viz)

    if ( this.rendered && forceRender)
      viz.render()

  }

  useDefaultControls() {

  }
}

module.exports = MemoryAreaBody