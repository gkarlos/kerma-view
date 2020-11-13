'use-strict'

/**
 * Selectize is used by both KernelSelectionView and LaunchSelectionView.
 * However, since these two are always(?) included together and the
 * kernel selection always precedes the launch selection we only require
 * it here once
 */
const Selectize       = require('selectize')
const App             = require('@renderer/app')
const { isFunction }  = require('@common/util/traits')
const EventEmitter    = require('events').EventEmitter
const Component       = require('@renderer/ui/component/Component')
const ColorGenerator  = require('@renderer/util/ColorGenerator')

/** @ignore @typedef {import("@renderer/services/kernel-selection/KernelSelection").KernelSelectionOnSelectCallback} KernelSelectionOnSelectCallback */
/** @ignore @typedef {import("@renderer/services/kernel-selection/KernelSelection").KernelSelectionOnEnabledCallback} KernelSelectionOnEnabledCallback */
/** @ignore @typedef {import("@renderer/services/kernel-selection/KernelSelection").KernelSelectionOnDisabledCallback} KernelSelectionOnDisabledCallback */
/** @ignore @typedef {import("@renderer/services/kernel-selection/KernelSelectionModel")} KernelSelectionModel */
/** @ignore @typedef {import("@renderer/models/cuda/CuKernel")} CuKernel */

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
  /** @type {JQuery} */
  #node
  #viewimpl
  /** @type {EventEmitter} */
  #emitter
  /** @type {ColorGenerator} */
  #colors

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
    this.#emitter = new EventEmitter()
    this.#colors = new ColorGenerator(10)
  }

  /**
   * Render the view to the DOM
   */
  render() {
    if ( !this.isRendered()) {

      $(this.container.node).insertAt(0, this.#node)


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

      this.#model.options.forEach(kernel => {
        kernel.setColor(this.#colors.next())
        this.#viewimpl.addOption(kernel)
      })

      /**
       * We need this indirection because the selectize callback accepts a String argument but
       * we want our API to accept a CuKernel argument
       */
      this.#viewimpl.on('change', (id) => {
        if ( id.length > 0) {
          console.log(id)
          console.log(this.#model)
          let kernel = this.#model.findKernelWithId(parseInt(id))
          console.log(kernel)
          this.#emitter.emit('select', kernel)
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
   * @fires module:kernel-selection.KernelSelection.enabled
   * @return {KernelSelectionView} this
   */
  enable(silent=false) {
    let wasDisabled = !this.isEnabled()

    this.#enabled = true

    if ( this.isRendered() && wasDisabled) {
      this.#viewimpl.enable()
      if ( !silent)
        this.#emitter.emit('enabled')
    }

    return this;
  }

  /**
   * Disable the view
   * @param {Boolean} silent If set, the "disabled" event will not be triggered
   * @fires module:kernel-selection.KernelSelection.disabled
   * @returns {KernelSelectionView} this
   */
  disable(silent=true) {
    let wasEnabled = this.isEnabled()

    this.#enabled = false
    if ( this.isRendered() && wasEnabled) {
      this.#viewimpl.disable()
      if ( !silent)
        this.#emitter.emit('disabled')
    }

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
   * Add a kernel to the options
   * @param {CuKernel} kernel A CuKernel object
   * @returns {KernelSelectionView} this
   */
  addKernel(kernel) {
    if ( this.isRendered())
      this.#viewimpl.addOption(kernel)
    return this
  }

  /**
   * Remove a kernel from the options
   * @param {CuKernel} kernel A CuKernel object
   * @returns {KernelSelectionView} this
   */
  removeKernel(kernel) {
    this.#viewimpl.removeOption(kernel.id)
    return this
  }

  /**
   * Remove all kernel options
   * @returns {KernelSelectionView} this
   */
  removeAllKernels() {
    this.#viewimpl.clearOptions()
    return this
  }

  /**
   * Retrieve the current selected kernel, if one exists
   * @returns {CuKernel} The selected kernel, `undefined` otherwise
   */
  getSelection() {
    return this.#model.findKernelWithId( parseInt(this.#viewimpl.getValue()))
  }

  /**
   * Retrieve the value field of the selected kernel used in the selector drop down
   * In this case we are using the kernel's id (see {@link module:cuda.CuKernel#id}) 
   * to make the selection
   * @returns {Number} The id of the selected kernel. `-1` otherwise
   */
  getSelectionId() {
    return this.#viewimpl.getValue() !== undefined || this.#viewimpl.getValue() !== null
      ? parseInt(this.#viewimpl.getValue()) : -1
  }

  /**
   * Unselect the current kernel
   * @returns {KernelSelectionView} this
   */
  clearSelection() {
    this.#viewimpl.clear(true)
    return this
  }

  /** 
   * Register a callback to be invoked when a kernel is selected
   * @param {KernelSelectionOnSelectCallback} callback
   * @returns {KernelSelectionView} this
   */
  onSelect(callback) {
    if ( isFunction(callback))
      this.#emitter.on( 'select', callback)
    return this
  }

  /** 
   * Register a callback to be invoked when the selection gets enabled
   * @param {KernelSelectionOnEnabledCallback} callback
   * @returns {KernelSelectionView} this
   */
  onEnabled(callback) {
    if ( isFunction(callback))
      this.#emitter.on( 'enabled', callback)
      // this.#onEnabledCallbacks.push(callback)
    return this;
  }

  /** 
   * Register a callback to be invoked when the selection gets disabled
   * @param {KernelSelectionOnDisabledCallback} callback
   * @returns {KernelSelectionView} thise
   */
  onDisabled(callback) {
    if ( isFunction(callback))
      this.#emitter.on( 'disabled', callback)
      // this.#onDisabledCallbacks.push(callback)
    return this;
  }

  static #renderSelected = (kernel, escape) => {
    return `<div class="kernel-selection-selected-item">
              <div class="badge kernel-color" style="background-color:${kernel.color}"> </div>        
              <span class="kernel-name">${kernel.name}<span>
           </div>`
  }
  // <!-- <td><span class="kernel-selection-kernel-signature">${kernel.source.arguments}</span></td> -->
  // <div class="second-row">
  // <span class="kernel-selection-second-row-title">src</span>
  // <span class="kernel-selection-second-row-value">${kernel.name}</span>
  // <span class="kernel-selection-second-row-title">line</span>
  // <span class="kernel-selection-second-row-value">${kernel.range.fromLine}</span>
  // </div>
  static #renderOption = (kernel, escape) => {
    return `<div>
              <div class="first-row">
                <table>
                  <tr>
                    <td>
                      <span class="kernel-selection-kernel-name badge" style="background-color: ${kernel.color}">${kernel.name}</span>
                      <span class="kernel-selection-second-row-title">line</span>
                      <span class="kernel-selection-second-row-value">${kernel.range.fromLine}</span>
                    </td>
                  </tr>
                </table>
              </div>

            </div>`
  }

}

module.exports = KernelSelectionView