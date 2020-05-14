const Component = require('../component')
const MemoryAreaTitleBar = require('./MemoryAreaTitlebar')
const Events = require('../../events')

class MemoryArea extends Component {
  constructor(id, container, app) {
    super()
    this.id = id
    this.container = container
    this.app = app
    this.name = `MemoryArea[${this.id}]`
    this.node = null
    this.titlebar = null
    // this.app.ui.registerComponent(this)
  }

  render() {
    this.node = $(`<div class="card" id="${this.id}"></div>`).appendTo(this.container)
    this.title = new MemoryAreaTitleBar("memory-area-titlebar", `#${this.id}`, this.app).render()
    this.memoryContainer = 
      $(`
        <div class="card-body">
          <ul class="list-group" id="heatmap-example"></ul>
        </div>`).appendTo(this.container)

    this.app.ui.emit(Events.UI_COMPONENT_READY, this);
    return this;
  }

  useDefaultControls() {

  }
}

module.exports = MemoryArea