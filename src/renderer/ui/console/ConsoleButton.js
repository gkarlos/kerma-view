const Component = require('@renderer/ui/component/Component')
const Events    = require('@renderer/events')
const App       = require('@renderer/app')

/**
 * @memberof module:console
 */
class ConsoleButton extends Component {
  constructor(id, container) {
    super(id, container)
    // this.id = id
    // this.app = app
    this.name = `ConsoleButton[${this.id}]`
    this.tooltip = "Open the terminal"
    this.classList = ["btn", "btn-sm", "btn-secondary"]
    // this.container = container
    // this.rendered = false
  }

  render() {
    if ( this.rendered )
      return console.log(`[warn] multiple render() calls for ${this.name}. This is a no-op`)
    
    this.node = $(`
      <button class="${this.classList.join(" ")}" id=${this.id}
                    data-toggle="tooltip" data-placement="bottom" title="${this.tooltip}">
        <i class="fas fa-terminal"></i> Console
      </button>
    `).css("margin-right", "2px")
    
    this.node.tooltip()
    this.node.appendTo(this.container)
    
    // ready
    this.rendered = true
    App.emit(Events.UI_COMPONENT_READY, this)
    return this
  }

  useDefaultControls() {

  }
}

// function defaultCreate(app) {
//   if ( !app)
//     throw new InternalError('ConsoleButton.defaultCreate requires an app reference and none was passed')

//   let consoleButton = new ConsoleButton("console-toggle-button", `#top-toolbar-left`, app).render()

//   // TODO app.ui.on(Events.UI_READY, ... )
//   return consoleButton
// }


module.exports = ConsoleButton