/**
 * @file RefreshButton.js
 */
const Component = require('./component')
const Events = require('../events')

class RefreshButton extends Component {
  constructor(id, container, app) {
    super()
    this.id = id
    this.app = app
    this.container = container
    this.name = `RefreshButton[${this.id}]`
    this.app.ui.registerComponent(this)
  }

  render() {
    if ( this.rendered )
      return console.log(`[warn] multiple render() calls for ${this.name}. This is a no-op`)
    
    this.node = $(`
      <button class="btn btn-sm btn-secondary" id=${this.id} 
                    data-toggle="tooltip" data-placement="bottom" title="Refresh the window">
        <i class="fas fa-sync-alt"></i>
      </button>
    `)
    
    this.node.tooltip()
    
    this.node.appendTo(this.container)

    this.app.ui.emit(Events.UI_COMPONENT_READY, this)
    this.rendered = true
    return this
  }
}

function defaultCreate(app) {
  let refreshButton = new RefreshButton("top-refresh-button", "#top-toolbar-left", app).render()

  // TODO app.ui.on(Events.UI_READY, ...)
  return refreshButton
}

module.exports = {
  RefreshButton,
  defaultCreate
}