/**
 * @file refresh-button.js
 */
const Component = require('./component')

class RefreshButton extends Component {
  constructor(id, container) {
    super()
    this.id = id
    this.name = `RefreshButton[${this.id}]`
    this.container = container
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

    this.rendered = true

    return this
  }
}

module.exports = (app) => {
  let refreshButton = app.ui.registerComponent(new RefreshButton("top-refresh-button", "#top-toolbar-left"))
  refreshButton.render()
  app.ui.emit('component-ready', refreshButton)
}