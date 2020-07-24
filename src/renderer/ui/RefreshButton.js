const Component = require('./component/Component')
const Events = require('../events')
const App = require('@renderer/app')

/**
 * @category Renderer
 * @subcategory ui
 */
class RefreshButton extends Component {
  constructor(id, container) {
    super(id, container)
    /** */
    // this.classList = ["btn", "btn-sm", "btn-secondary"]
    /** */
    this.tooltip = "Reload"
    this.name = `RefreshButton[${this.id}]`
    /** */
    this.value = {
      default : `<i class="fas fa-sync-alt"></i>`,
      current : `<i class="fas fa-sync-alt"></i>`
    }
  }

  /** */
  enable() {
    // TODO implement me
  }

  /** */
  disable() {
    // TODO implement me
  }

  /** */
  setValue(value) {
    this.value.current = value
    if ( this.rendered)
      this.node.html(value)
  }

  /** */
  render() {
    if ( this.rendered )
      return console.log(`[warn] multiple render() calls for ${this.name}. This is a no-op`)
    
    this.node = $(`
      <div role="group">
        <button class="btn kv-btn" id=${this.id} data-toggle="tooltip" data-placement="bottom" title="${this.tooltip}">
          <i class="fas fa-sync-alt"></i>
        </button>
      </div>
    `)

    this.node.css('margin-right', '2px')
             .css('margin-bottom', '2px')

    
    this.node.tooltip({
      trigger : "hover"
    })
    this.node.appendTo(this.container)

    App.emit(Events.UI_COMPONENT_READY, this)
    this.rendered = true
    return this
  }

  useDefaultControls() {
    this.node.on('click', () => App.reload())
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