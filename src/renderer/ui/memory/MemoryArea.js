const Component = require('../component')
const MemoryAreaTitleBar = require('./MemoryAreaTitlebar')
const MemoryAreaBody = require('./MemoryAreaBody')
const Events = require('../../events')

/**
 * The main container for memory visualizations
 * @memberof module:renderer/components/memory
 */
class MemoryArea extends Component {
  constructor(id, container, app) {
    super()
    this.id = id
    this.container = container
    this.app = app
    this.name = `MemoryArea[${this.id}]`
    this.node = null
    this.title = new MemoryAreaTitleBar("memory-area-titlebar", `#${this.id}`, this.app)
    this.body = new MemoryAreaBody("memory-area-body", `#${this.id}`, this.app)
  }

  render() {
    this.node  = $(`<div class="card" id="${this.id}"></div>`).appendTo(this.container)
    this.title.render()
    this.body.render()
      // $(`
        
    // $("#heatmap-example").css("height", "100%").css("width", "100%")


    this.app.emit(Events.UI_COMPONENT_READY, this);
    return this;
  }

  addMemory(memory) {
    this.body.addMemory(memory)
  }

  getMemory(name) {
    return this.body.getMemory(name)
  }

  useDefaultControls() {
    this.title.useDefaultControls()
    this.body.useDefaultControls()
  }
}

module.exports = MemoryArea