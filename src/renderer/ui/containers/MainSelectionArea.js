const Container = require('@renderer/ui/containers').Container

const Events    = require('../../events')
const App = require('@renderer/app')
// const KernelSelector = require('../selectors/KernelSelector')
// const KernelLaunchSelector = require('../selectors/KernelLaunchSelector')
// const CodeNavToolbar = require('./CodeNavToolbar')

/**
 * @memberof module:containers
 * @augments module:containers.Container
 */
class MainSelectionArea extends Container {

  #kernel
  #launch
  #block
  #compute

  #firstRow
  #secondRow

  #locationSelector

  /**
   * 
   */
  constructor(id, location) {
    super(id, location)
    this.#locationSelector = `#${location.id}`
    this.#firstRow = null
    this.#secondRow = null
    // this.id = id
    // this.container = container
    // this.name = `MainToolbar[${id}]`
    // this.rendered = false
    // this.node = null
    // this.insertTo = null;

    // this.kernelSelector = new KernelSelector('select-kernel', '#kernel-launch-selection-row', this.app)
    // this.kernelLaunchSelector = new KernelLaunchSelector('select-kernel-launch', '#kernel-launch-selection-row', this.app);
    // this.codeNavToolbar = new CodeNavToolbar('code-nav-toolbar', '#codenav-threadselect-row', this.app, true)
    // this.app.ui.registerComponent(this)
    // this.app.ui.toolbar.main = this
  }

  get firstRow() { return this.#firstRow }

  get secondRow() { return this.#secondRow }

  render() {
    
    if ( this.rendered )
      return console.log(`[warn] multiple render() calls for ${this.name}. This is a no-op`)
    
    this.setNode($(`
      <div id="${this.id}" class="input-group card-header">
        MainSelectionArea
      </div>
    `).appendTo(this.#locationSelector))

    this.#firstRow = { node: $(`<div class="row selection-row d-inline-flex justify-content-between" id="kernel-launch-selection-row"></div>`) }
    this.#secondRow = { node: $(`<div class="row selection-row d-inline-flex justify-content-between" id="compute-selection-row"</div>`) }

    this.#firstRow.node.appendTo(this.node)
    this.#secondRow.node.appendTo(this.node)
    
    // this.kernelSelector.render()
    // this.kernelLaunchSelector.render()
    // this.codeNavToolbar.render()

    // this.rendered = true
    // App.emit(Events.UI_COMPONENT_READY, this);
    return this
  }

  // useDefaultControls() {
  //   // this.kernelSelector.useDefaultControls()
  //   // this.kernelLaunchSelector.useDefaultControls()
  //   // this.codeNavToolbar.useDefaultControls()
  //   return this;
  // }
}

module.exports = MainSelectionArea