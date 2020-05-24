const Component = require('../component/Component')
const Events    = require('../../events')
const KernelSelector = require('../selectors/KernelSelector')
const KernelLaunchSelector = require('../selectors/KernelLaunchSelector')
const CodeNavToolbar = require('./CodeNavToolbar')

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
    this.kernelSelector = new KernelSelector('select-kernel', '#kernel-launch-selection-row', this.app)
    this.kernelLaunchSelector = new KernelLaunchSelector('select-kernel-launch', '#kernel-launch-selection-row', this.app);
    // this.codeNavToolbar = new CodeNavToolbar('code-nav-toolbar', '#codenav-threadselect-row', this.app, true)
    // this.app.ui.registerComponent(this)
    // this.app.ui.toolbar.main = this
  }

  render() {
    
    if ( this.rendered )
      return console.log(`[warn] multiple render() calls for ${this.name}. This is a no-op`)
    
    this.node = $(`
      <div id="${this.id}" class="input-group card-header">
        <div class="row selection-row d-inline-flex justify-content-between" id="kernel-launch-selection-row">
        </div>
        <div class="row selection-row d-inline-flex justify-content-between" id="codenav-threadselect-row">
        </div>
      <div>
    `).appendTo(this.container)
    
    this.kernelSelector.render()
    this.kernelLaunchSelector.render()
    // this.codeNavToolbar.render()

    this.rendered = true
    this.app.emit(Events.UI_COMPONENT_READY, this);
    return this
  }

  useDefaultControls() {
    this.kernelSelector.useDefaultControls()
    this.kernelLaunchSelector.useDefaultControls()
    // this.codeNavToolbar.useDefaultControls()
    return this;
  }
}

module.exports = MainToolbar