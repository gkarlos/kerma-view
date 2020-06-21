'use-strict'

const Selectize = require('selectize')
const App = require('@renderer/app')
const Events = App.Events
const { isFunction } = require('@common/util/traits')

const Component = require('@renderer/ui/component/Component')

/** @ignore @typedef {import("@renderer/services/kernel-selection/KernelSelection").KernelSelectionOnSelectCallback} KernelSelectionOnSelectCallback */
/** @ignore @typedef {import("@renderer/services/kernel-selection/KernelSelection").KernelSelectionOnEnabledCallback} KernelSelectionOnEnabledCallback */
/** @ignore @typedef {import("@renderer/services/kernel-selection/KernelSelection").KernelSelectionOnDisabledCallback} KernelSelectionOnDisabledCallback */
/** @ignore @typedef {import("@renderer/services/kernel-selection/KernelSelectionModel")} KernelSelectionModel */
/** @ignore @typedef {import("@renderer/models/cuda/CudaKernel")} CudaKernel */

/**
 * @memberof module:kernel-selection
 */
class KernelSelectionView extends Component {
  /** @type {KernelSelectionModel} */
  #model
  /** @type {Boolean} */
  #enabled
  /** @type {Boolean} */
  #rendered
  /** @type {Array.<KernelSelectionOnSelectCb>} */
  #onSelectCallbacks
  /** @type {Array.<KernelSelectionOnEnabledCallback>} */
  #onEnabledCallbacks
  /** @type {Array.<KernelSelectionOnDisabledCallback>} */
  #onDisabledCallbacks
  /** @type {JQuery} */
  #node
  #viewimpl

  /**
   * @param {KernelSelectionModel} model 
   */
  constructor(model) {
    super('kernel-selector', App.ui.containers.mainSelection.firstRow)
    this.#model = model
    this.#enabled = false
    this.#rendered = false
    this.#node = $(`
      <div class="editor-toolbar-group d-flex" id="kernel-selection-group">
        <div class="input-group-prepend pre" id="kernel-list-dropdown-pre">
          <div class="input-group-text" id="kernel-list-dropdown-pre-text">Kernel</div>
        </div>
        <div class="control-group align-middle dropdown" id="kernel-list-dropdown" >
          <select id="${this.id}" class="repositories input-group-sm"></select>
        </div>
      </div>
    `)
    this.#onSelectCallbacks = []
    this.#onEnabledCallbacks = []
    this.#onDisabledCallbacks = []
  }

  /**
   * Render the view to the DOM
   */
  render() {
    if ( !this.isRendered()) {
      this.#node.appendTo(this.container.node)

      this.#viewimpl = $(`#${this.id}`).selectize({
        valueField: 'id',
        maxItems: 1,
        create: false,
        render : {
          item : KernelSelectionView.#renderSelected,
          option : KernelSelectionView.#renderOption
        }
      })[0].selectize

      if ( !this.#viewimpl) throw new InternalError(`Failed to create KernelSelectionView`)

      this.#model.options.forEach(kernel => this.#viewimpl.addOption(kernel))

      /**
       * We need this indirection because the selectize callback accepts a String argument but
       * we want our API to accept a CudaKernel argument
       */
      this.#viewimpl.on('change', (id) => {
        if ( id.length > 0)
          this.#onSelectCallbacks.forEach( callback => callback(this.#model.findKernelWithId(parseInt(id))) )
      })

      this.#rendered = true
    }
    
    if ( !this.isEnabled()) 
      this.#viewimpl.disable()
    
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

  /** @returns {Boolean} */
  isRendered() { return this.#rendered }

  /** @returns {Boolean} */
  isEnabled() { return this.#enabled }

  /** 
   * Enable the view
   * @param {Boolean} silent If set, the "enabled" event will not be triggered
   * @return {KernelSelectionView} this 
   */
  enable(silent=false) {
    let wasEnabed = !this.isEnabled()

    this.#enabled = true

    if ( this.isRendered() && !wasEnabed) 
      this.#viewimpl.enable(silent)
    
    return this;
  }

  /**
   * Disable the view
   * @param {Boolean} silent If set, the "disabled" event will not be triggered
   */
  disable(silent=true) {
    let wasEnabled = this.isEnabled()

    this.#enabled = false
    
    if ( this.isRendered() && wasEnabled)
      this.#viewimpl.disable(silent)
    
    return this
  }

  /**
   * Add a kernel to the options
   * @param {CudaKernel} kernel 
   */
  addKernel(kernel) {
    if ( this.isRendered())
      this.#viewimpl.addOption(kernel)
  }

  /**
   * Remove a kernel from the options
   * @param {CudaKernel} kernel 
   */
  removeKernel(kernel) {
    this.#viewimpl.removeOption(kernel.id)
  }

  /**
   * Remove all kernel options
   * @returns {KernelSelectionModel} this
   */
  removeAllKernels() {
    this.#viewimpl.clearOptions()
  }

  /**
   * Retrieve the current selection, if one exists
   */
  getSelection() {
    return this.#viewimpl.getValue()
  }

  /**
   * Unselect the current kernel
   */
  clearSelection() {
    this.#viewimpl.clear(true)
  }

  /** 
   * Register a callback to be invoked when a kernel is selected
   * @param {KernelSelectionOnSelectCallback} callback
   * @returns {KernelSelectionView} this
   */
  onSelect(callback) {
    if ( isFunction(callback))
      this.#onSelectCallbacks.push(callback)
    return this;
  }

  /** 
   * Register a callback to be invoked when the selection gets enabled
   * @param {KernelSelectionOnEnabledCallback} callback
   * @returns {KernelSelectionView} this
   */
  onEnabled(callback) {
    if ( isFunction(callback))
      this.#onEnabledCallbacks.push(callback)
    return this;
  }

  /** 
   * Register a callback to be invoked when the selection gets disabled
   * @param {KernelSelectionOnDisabledCallback} callback
   * @returns {KernelSelectionView} this
   */
  onDisabled(callback) {
    if ( isFunction(callback))
      this.#onDisabledCallbacks.push(callback)
    return this;
  }

  static #renderSelected = (kernel, escape) => {
    return `<span class="kernel-selection-selected-item">
             ${kernel.source.name} 
           </span>`
  }

  static #renderOption = (kernel, escape) => {
    return `<div>
              <div class="first-row">
                <table>
                  <tr>
                    <td><span class="kernel-selection-kernel-name badge alert-info">${kernel.source.name}</span></td>
                    <td><span class="kernel-selection-kernel-signature">${kernel.source.arguments}</span></td>
                  </tr>
                </table>
              </div>
              <div class="second-row">
                <span class="kernel-selection-second-row-title">src</span>
                <span class="kernel-selection-second-row-value">${kernel.source.filename}</span>
                <span class="kernel-selection-second-row-title">line</span>
                <span class="kernel-selection-second-row-value">${kernel.source.range.fromLine}</span>
              </div>
            </div>`
  }

}

module.exports = KernelSelectionView