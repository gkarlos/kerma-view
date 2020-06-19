/**-renderer/components/selectors/KernelSelector.js-----------------/
*
* Part of the kerma project
* 
*-------------------------------------------------------------------/
* 
* @file renderer/components/selectors/KernelSelector.js
* @author gkarlos 
*  
*------------------------------------------------------------------*/
'use-strict'

const Events = require('@renderer/events')
const Selectize = require('selectize')
const App = require('@renderer/app')
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
  #container
  #viewimpl
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

  /**
   * @param {KernelSelectionModel} model 
   */
  constructor(model) {
    super('kernel-selector', App.ui.containers.mainSelection)
    this.#model = model
    this.#enabled = false
    this.#rendered = false
    this.node = $(`
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
      this.node.appendTo(this.container.node)

      this.#viewimpl = $(`#${this.id}`).selectize({
        valueField: 'id',
        maxItems: 1,
        create: false,
        render : {
          item : KernelSelectionView.#renderSelected,
          option : KernelSelectionView.#renderOption
        }
      })[0].selectize

      if ( !this.#viewimpl) throw new InternalError(`Failed to create KernelSelector '${this.id}'`)

      if ( this.#model.numOptions === 0)
        this.disable()

      /**
       * We need this indirection because the selectize callback accepts a String argument but
       * we want our API to accept a CudaKernel argument
       */
      this.#viewimpl.on('change', (id) => {
        if ( id.length > 0)
          this.#onSelectCallbacks.forEach( callback => callback(this.#model.findKernelWithId(parseInt(id))) )
      })
    }

    
    if ( !this.#enabled) this.#viewimpl.disable()

    this.#rendered = true
    
    return this
  }

  /** @returns {Boolean} */
  isRendered() { return this.#rendered }

  /** @returns {Boolean} */
  isEnabled() { return this.#enabled }

  /** 
   * Enable the view
   * @param {Boolean} triggerEvent Whether an "enabled" event should be triggered
   * @return {KernelSelectionView} this 
   */
  enable(triggerEvent=true) {
    if ( this.isRendered() && !this.isEnabled())
      this.#viewimpl.enable()
    this.#enabled = true
    return this;
  }

  /**
   * Disable the view
   * @param {Boolean} triggerEvent Whether a "disabled" event should be triggered
   */
  disable(triggerEvent=true) {
    if ( this.isRendered() && this.isEnabled())
      this.#viewimpl.disable()
    this.#enabled = false
    return this
  }

  /**
   * Add a kernel to the options
   * @param {CudaKernel} kernel 
   */
  addKernel(kernel) {
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

  useDefaultControls() {
    let mock = require('../../../mock/cuda-source')

    this.disable()

      //highlight the kernels in the editor
    this.selectize.on('change', id => {
      App.ui.editor.instance.revealLinesInCenter( mock.kernels[id].source.range[0], mock.kernels[id].source.range[2])
      this.app.emit(Events.INPUT_KERNEL_SELECTED, id)
    })
      
    App.on(Events.EDITOR_INPUT_LOADED, () => {
      this.enable()
      mock.kernels.forEach(kernel => this.addOption(kernel)) 
    })
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