'use-strict'

const Component = require('../component')

/**
 * The body of the memory are. This is roughly a collection
 * of {@link MemoryVis} objects.
 * 
 * This class is only meant to be used within {@link MemoryArea}
 * 
 * @memberof module:renderer/components/memory
 */
class MemoryAreaBody extends Component {
  constructor(id, container, app) {
    super()
    this.id = id;
    this.container = container;
    this.app = app
    this.name = `MemoryAreaBody[${this.id}]`
  }

  render() {
    this.node = $(`
      <div class="card-body" id="memory-area-body">
        <ul class="list-group" id="heatmap-example"></ul>
      </div>`).appendTo(this.container)
      
    this.node.css("max-width", "100%")
             .css("max-height", "90vh")
             .css("overflow-y", "scroll")
  }

  addMemory() {

  }

  useDefaultControls() {

  }
}

module.exports = MemoryAreaBody