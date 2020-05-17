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
    this.classList = ["btn", "btn-sm", "btn-secondary"]
    this.tooltip = "Refresh the window"
    this.name = `RefreshButton[${this.id}]`
    this.value = {
      default : `<i class="fas fa-sync-alt"></i>`,
      current : `<i class="fas fa-sync-alt"></i>`
    }
  }

  enable() {
    // TODO implement me
  }

  disable() {
    // TODO implement me
  }

  setValue(value) {
    this.value.current = value
    if ( this.rendered)
      this.node.html(value)
  }

  render() {
    if ( this.rendered )
      return console.log(`[warn] multiple render() calls for ${this.name}. This is a no-op`)
    
    this.node = $(`
      <button class="${this.classList.join(" ")}" id=${this.id} data-toggle="tooltip" data-placement="bottom" title="${this.tooltip}">
      </button>
    `)
    this.node.append($(this.value.current))

    
    this.node.tooltip()
    this.node.appendTo(this.container)

    this.app.emit(Events.UI_COMPONENT_READY, this)
    this.rendered = true
    return this
  }

  useDefaultControls() {

  }
}

// function defaultCreate(app) {
//   let refreshButton = new RefreshButton("top-refresh-button", "#top-toolbar-left", app).render()

//   // TODO app.ui.on(Events.UI_READY, ...)
//   return refreshButton
// }

module.exports = RefreshButton
// {
//   RefreshButton,
//   defaultCreate
// }