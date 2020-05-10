/**
 * @file console-button.js
 */
const Component = require('./component')

class ConsoleButton extends Component {
  constructor(id, container) {
    super()
    this.id = id
    this.name = `ConsoleButton[${this.id}]`
    this.container = container
  }

  render() {
    if ( this.rendered )
      return console.log(`[warn] multiple render() calls for ${this.name}. This is a no-op`)
    
    this.node = $(`
      <button class="btn btn-sm btn-secondary" id=${this.id}
                    data-toggle="tooltip" data-placement="bottom" title="Open the terminal">
        <i class="fas fa-terminal"></i> Console
      </button>
    `).css(
      "margin-right", "2px"
    )
    
    this.node.tooltip()
    
    this.node.appendTo(this.container)

    this.rendered = true

    return this
  }
}


module.exports = (app) => {
  let consoleButton = app.ui.registerComponent(new ConsoleButton("console-toggle-button", `#top-toolbar-left`))
  consoleButton.render()
  app.ui.emit('component-ready', consoleButton)
}