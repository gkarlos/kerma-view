'use-strict'

const Component      = require('@renderer/ui/component/Component')
const App            = require('@renderer/app')
const { isFunction } = require('@common/util/traits')

/** @ignore @typedef {import("@renderer/services/launch-selection/LaunchSelection").LaunchSelectionOnSelectCallback} LaunchSelectionOnSelectCallback */
/** @ignore @typedef {import("@renderer/services/launch-selection/LaunchSelection").LaunchSelectionOnEnabledCallback} LaunchSelectionOnEnabledCallback */
/** @ignore @typedef {import("@renderer/services/launch-selection/LaunchSelection").LaunchSelectionOnDisabledCallback} LaunchSelectionOnDisabledCallback */
/** @ignore @typedef {import("@renderer/services/launch-selection/LaunchSelectionModel")} LaunchSelectionModel */
/** @ignore @typedef {import("@renderer/models/cuda/CudaLaunch")} CudaLaunch */

/**
 * @memberof module:launch-selection
 */
class LaunchSelectionView extends Component {
  /** @type {LaunchSelectionModel} */
  #model
  /** @type {Boolean} */
  #enabled
  /** @type {Boolean} */
  #rendered
  /** @type {Array.<LaunchSelectionOnSelectCb>} */
  #onSelectCallbacks
  /** @type {Array.<LaunchSelectionOnEnabledCallback>} */
  #onEnabledCallbacks
  /** @type {Array.<LaunchSelectionOnDisabledCallback>} */
  #onDisabledCallbacks
  /** @type {JQuery} */
  #node
  #viewimpl

  constructor(model) {
    super("kernel-launch-selector", App.ui.containers.mainSelection.firstRow)
    this.#model = model
    this.#enabled = false
    this.#rendered = false
    this.#node = $(`
      <div class="editor-toolbar-group" id="launch-selection-group">
        <div class="input-group-prepend pre" id="launch-list-dropdown-pre">
          <div class="input-group-text" id="launch-list-dropdown-pre-text">Launch</div>
        </div>
        <div class="control-group align-middle dropdown" id="launch-list-dropdown" >
          <select id="${this.id}" class="repositories"></select>
        </div>
      </div>
    `)
    this.#onSelectCallbacks = []
    this.#onEnabledCallbacks = []
    this.#onDisabledCallbacks = []
  }

  render() {
    if ( !this.isRendered()) {

      $(this.container.node).insertAt(1, this.#node)

      this.#viewimpl = $(`#${this.id}`).selectize({
        valueField: 'id',
        maxItems: 1,
        create: false,
        render: {
          item: LaunchSelectionView.#renderSelected,
          option: LaunchSelectionView.#renderOption
        }
      })[0].selectize
      
      if ( !this.#viewimpl) throw new InternalError(`Failed to create KernelSelectionView`)

      this.#model.options.forEach(launch => this.#viewimpl.addOption(launch))

      /**
       * We need this indirection because the selectize callback accepts a String argument but
       * we want our API to accept a CudaLaunch argument
       */
      this.#viewimpl.on('change', (id) => {
        if ( id.length > 0) {
          let launch = this.#model.findLaunchWithId(parseInt(id))
          this.#onSelectCallbacks.forEach( callback => callback(launch) )
          App.emit(App.Events.INPUT_KERNEL_LAUNCH_SELECTED, launch)
        }
      })

      this.#rendered = true
    }

    if ( !this.isEnabled()) 
      this.#viewimpl.disable()

    return this
  }

  /** @returns {Boolean} */
  isRendered() { return this.#rendered }

  /** @returns {Boolean} */
  isEnabled() { return this.#enabled }

  /** 
   * Enable the view
   * @param {Boolean} [silent] If set, the "enabled" event will not be triggered
   * @return {LaunchSelectionView} this 
   */
  enable(silent=false) {
    let wasDisabled = !this.isEnabled()

    this.#enabled = true

    if ( this.isRendered() && wasDisabled) 
      this.#viewimpl.enable(silent)
    
    return this;
  }

  /**
   * Disable the view
   * @param {Boolean} [silent] If set, the "disabled" event will not be triggered
   */
  disable(silent=true) {
    let wasEnabled = this.isEnabled()

    this.#enabled = false
    
    if ( this.isRendered() && wasEnabled)
      this.#viewimpl.disable(silent)
    
    return this
  }

  /**
   * Dispose the view and optionally remove it from the DOM
   * @param {Boolean} [remove] Remove the view from the DOM
   * @return {KernelSelectionView} this 
   */
  dispose(remove=false) {
    if ( remove ) {
      this.#viewimpl && this.#viewimpl.destroy()
      this.#node && this.#node.remove()
    } else {
      this.#viewimpl && this.#viewimpl.clearOptions()
      this.#viewimpl && this.#viewimpl.clear()
      this.disable()
    }
    this.#rendered = false
    return this
  }

  /**
   * Add a launch to the options
   * @param {CudaLaunch} launch A CudaLaunch object
   * @returns {LaunchSelectionView} this
   */
  addLaunch(launch) {
    // App.Logger.debug("LaunchSelectionView", this.isRendered()? "(Rendered): " : "(Not Rendered): ","Adding launch: ", launch.toString())
    if ( this.isRendered())
      this.#viewimpl.addOption(launch)
    return this
  }

  /**
   * Remove a launch from the options
   * @param {CudaLaunch} launch A CudaLaunch object
   * @returns {LaunchSelectionView} this
   */
  removeLaunch(launch) {
    this.#viewimpl.removeOption(launch.id)
    return this
  }

  /**
   * Remove all launch options
   * @returns {LaunchSelectionView}
   */
  removeAllLaunches() {
    this.#viewimpl.clearOptions()
    return this
  }

  /**
   * Retrieve the current selected kernel launch
   * @returns {CudaLaunch} The selected kernel launch if one exists, `undefined` otherwise
   */
  getSelection() {
    return this.#model.findLaunchWithId( parseInt(this.#viewimpl.getValue()))
  }

  /**
   * Retrieve the value field of the selected launch, used in the selector drop down
   * In this case we are using the launche's id (see {@link module:cuda.CudaLaunch#id}) 
   * to make the selection
   * @returns {Number} The id of the selected kernel. `-1` otherwise
   */
  getSelectionId() {
    return this.#viewimpl.getValue() !== undefined || this.#viewimpl.getValue() !== null
      ? parseInt(this.#viewimpl.getValue()) : -1
  }

  /**
   * Unselect the current launch
   * @returns {LaunchSelectionView} this
   */
  clearSelection() {
    this.#viewimpl.clear(true)
    return this
  }

  /** 
   * Register a callback to be invoked when a launch is selected
   * @param {LaunchSelectionOnSelectCallback} callback
   * @returns {LaunchSelectionView} this
   */
  onSelect(callback) {
    if ( isFunction(callback))
      this.#onSelectCallbacks.push(callback)
    return this
  }

  /** 
   * Register a callback to be invoked when the selection gets enabled
   * @param {LaunchSelectionOnEnabledCallback} callback
   * @returns {LaunchSelectionView} this
   */
  onEnabled(callback) {
    if ( isFunction(callback))
      this.#onEnabledCallbacks.push(callback)
    return this;
  }

  /** 
   * Register a callback to be invoked when the selection gets disabled
   * @param {LaunchSelectionOnDisabledCallback} callback
   * @returns {LaunchSelectionView} this
   */
  onDisabled(callback) {
    if ( isFunction(callback))
      this.#onDisabledCallbacks.push(callback)
    return this;
  }

  /**
   * @param {CudaLaunch} launch 
   * @param {function(String)} escape 
   */
  static #renderSelected = ( launch, escape) => {
    return `<span class="launch-selection-selected-item">
              <span class="launch-selection-selected-item-title"> @line </span> 
              <span class="launch-selection-selected-item-value">${launch.source.range.fromLine}</span> -
              <span class="launch-selection-selected-item-more">${escape(launch.source.launchParams)}</span>
            </span>`
  }

  /**
   * @param {CudaLaunch} launch 
   * @param {function(String)} escape 
   */
  static #renderOption = ( launch, escape) => {
    return `<div class="list-item">
              <div class="first-row">
                <table>
                <tr>
                  <td><span class="launch-selection-launch-params"></i>${escape(launch.source.launchParams)}</span></td>
                  <td><span class="launch-selection-launch-arguments">${launch.source.arguments}</span></td>
                </tr>
                </table>
              </div>
              <div class="second-row">
                <span class="launch-selection-second-row-title">caller</span>
                <span class="launch-caller" title="caller" >${launch.source.caller.name}</span>
                <span class="launch-selection-second-row-title">line</span>
                <span class="kernel-source" title="line" >${launch.source.range.fromLine}</span>
              </div>
            </div>`
  }


}

module.exports = LaunchSelectionView