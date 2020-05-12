const Component = require('./component')
const KernelSelector = require('./selectors/KernelSelector')
const Events = require('./../events')

class MainToolbar extends Component {
  constructor(id, container, app) {
    super()
    this.id = id
    this.container = container
    this.app = app
    this.name = `MainToolbar[${id}]`
    this.rendered = false
    this.node = null
    this.insertTo = null;
    this.kernelSelector = null;
    this.app.ui.registerComponent(this)
    this.app.ui.toolbar.main = this
  }

  render() {
    
    if ( this.rendered )
      return console.log(`[warn] multiple render() calls for ${this.name}. This is a no-op`)
    
    this.node = $(`
      <div id="${this.id}" class="input-group card-header">
        <div class="row selection-row d-inline-flex justify-content-between" id="kernel-launch-selection-row">
        </div>
      <div>
    `).appendTo(this.container)
    
    // create the kernel selection dropdown
    this.kernelSelector = KernelSelector.defaultCreate('select-kernel', '#kernel-launch-selection-row', this.app)
    
    // create the launch selection dropdown

    this.rendered = true
    this.app.ui.emit(Events.UI_COMPONENT_READY, this);
    return this
  }
}

const defaultId       = 'editor-toolbar'
const defaultLocation = "#left-bottom"

// Create a toolbar and define the default behavior
function defaultCreate(app) {
  let toolbar = new MainToolbar(defaultId, defaultLocation, app).render()

  // TODO app.ui.on(Events.UI_READY, ... )
  return toolbar
}

module.exports = {
  MainToolbar,
  defaultId,
  defaultLocation,
  defaultCreate
}