const Component = require('../component/Component')
const MemoryAreaTitleBar = require('./MemoryAreaTitlebar')
const MemoryAreaBody = require('./MemoryAreaBody')
const Events = require('../../events')
const App = require('@renderer/app')

/**
 * The main container for memory visualizations
 * @memberof module:memory-ui
 */
class MemoryArea extends Component {
  constructor(id, container) {
    super(id, container)
    this.name = `MemoryArea[${this.id}]`
    this.node = null
    this.title = new MemoryAreaTitleBar("memory-area-titlebar", `#${this.id}`)
    this.body = new MemoryAreaBody("memory-area-body", `#${this.id}`)
  }

  render() {
    this.node  = $(`<div class="card" id="${this.id}"></div>`).appendTo(this.container)
    this.title.render()
    this.body.render()
      // $(`
        
    // $("#heatmap-example").css("height", "100%").css("width", "100%")


    App.emit(Events.UI_COMPONENT_READY, this);
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