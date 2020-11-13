'use-strict'

/** @ignore @typedef {import("@renderer/services/kernel-selection/KernelSelectionModel")} KernelSelectionModel */
/** @ignore @typedef {import("@renderer/services/kernel-selection/KernelSelectionView")} KernelSelectionView */
/** @ignore @typedef {import("@renderer/models/Kernel")} Kernel */

const App = require('@renderer/app')
const KernelSelectionModel = require('@renderer/services/kernel-selection/KernelSelectionModel')
const KernelSelectionView  = require('@renderer/services/kernel-selection/KernelSelectionView')

/**
 * A controller for a kernel selection
 *
 * A KernelSelection is **disabled** by default and needs to be explicitely enabled
 * (see {@link module:kernel-selection.KernelSelection#enable})
 * @memberof module:kernel-selection
 */
class KernelSelectionService { 
  /** @type {KernelSelectionModel} */ #model
  /** @type {KernelSelectionView}  */ #view

  /**
   * Create a new KernelSelection instance
   * @param {Array.<CuKernel>} [kernels] An array of CuKernel objects to be used as options
   */
  constructor() {
    this.#model = new KernelSelectionModel()
    this.#view  = new KernelSelectionView(this.#model).render()
    this.#view.onSelect(kernel => {
      this.#model.selectKernel(kernel)
      App.emit(App.Events.INPUT_KERNEL_SELECTED, kernel)
    })
  }

  /// ------------------- ///
  /// Accessor Properties ///
  /// ------------------- ///

  /**
   * The model of this KernelSelection
   * @type {KernelSelectionModel} 
   */
  get model() { return this.#model }

  /**
   * The view of this KernelSelection
   * @type {KernelSelectionView}
   */
  get view() { return this.#view }

  /**
   * The available options of this KernelSelection
   * @type {Array.<CuKernel>}
   */
  get options() { return this.#model.options }

  /**
   * The number of available options
   * @type {Number}
   */
  get numOptions() { return this.#model.options.length }

  /// ------------------- ///
  ///       Methods       ///
  /// ------------------- ///

  /**
   * Add a kernel to the options
   * @param {CuKernel} kernel A CuKernel
   * @param {Boolean} [enable] 
   *  If set, the selection will be enabled after the kernel is added
   * @returns {KernelSelection} this
   */
  addKernel(kernel, enable=false) {
    console.log("Adding kernel ", kernel)
    this.#model.addKernel(kernel)
    console.log(this.#model)
    this.#view.addKernel(kernel)
    if ( enable && !this.#view.isEnabled())
      this.#view.enable()
    return this
  }

  /**
   * Add multiple kernel options
   * @param {Array.<CuKernel>} kernels An array of CuKernel objects
   * @param {Boolean} [enable]
   *  If set, the selection will be enabled after the kernels are added
   * @returns {KernelSelection} this
   */
  addKernels(kernels=[], enable) {
    let self = this
    kernels.forEach(kernel => self.addKernel(kernel))
    if ( enable)
      this.enable()
    return this
  }

  /**
   * Remove a kernel from the options
   * If there are no options left the selection gets disabled
   * @param {CuKernel} kernel 
   * @param {Boolean} [keepEnabled] 
   *  If set, the selection will not get disabled if there are no options left
   * @returns {KernelSelection} this
   */
  removeKernel(kernel, keepEnabled=false) {  
    this.#model.removeKernel(kernel)
    this.#view.removeKernel(kernel)
    if ( keepEnabled && this.#view.isEnabled() && this.#model.numOptions === 0)
      this.#view.disable()
    return this
  }

  /**
   * Remove a number of kernels from the options
   * @param {Array.<CuKernel>} kernels An array of CuKernel objects
   * @param {Boolean} [keepEnabled]
   *   If set, the selection will not get disabled if there are no options left after the removal
   * @returns {KernelSelection} this 
   */
  removeKernels(kernels=[], keepEnabled=false) {
    if ( Array.isArray(kernels))
      kernels.forEach(kernel => this.removeKernel(kernel, keepEnabled))
    return this;
  }

  /**
   * Remove all kernel options
   * @fires module:kernel-selection.KernelSelection.disabled
   * @returns {KernelSelection} this
   */
  removeAllKernels() {
    this.#model.removeAllKernels()
    this.#view.removeAllKernels()
    this.#view.disable()
    return this
  }

  /**
   * Retrieve the current selected option, if one exists
   * @returns {CuKernel} The select CuKernel if it exists. `null` otherwise
   */
  getSelection() { return this.#model.getSelection() }

  /**
   * Unselect the current kernel
   * @returns {KernelSelection} this
   */
  clearSelection() {
    this.#model.clearSelection()
    this.#view.clearSelection()
    return this
  }

  /**
   * Check if a kernel exists as an option
   * @param {CuKernel} kernel
   * @returns {Boolean} 
   */
  hasKernel(kernel) {
    return this.#model.hasKernel(kernel)
  }

  /**
   * Enable the selection. i.e allow the user to select an option
   * @param {Boolean} [silent] If set, the "enabled" event will not be triggered
   * @fires module:kernel-selection.KernelSelection.enabled
   * @returns {KernelSelection} this
   */
  enable(silent=false) {
    this.#view.enable(silent)
    return this
  }

  /**
   * Disable the selection. i.e disallow the user to select an option
   * @param {Boolean} [silent] If set, the "disabled" event will not be triggered
   * @fires module:kernel-selection.KernelSelection.disabled
   * @returns {KernelSelection} this
   */
  disable(silent=false) {
    this.#view.disable(silent)
    return this;
  }

  /**
   * Check if this selection is enabled (i.e. the user can interact with it)
   * @returns {Boolean}
   */
  isEnabled() {
    return this.#view.isEnabled()
  }

  /**
   * Dispose the selection
   * @return {KernelSelection} this
   */
  dispose() {
    this.#view.dispose(true)
    return this
  }

  /// --------------------- ///
  /// Callback Registration ///
  /// --------------------- ///

  /**
   * Register a callback to be invoked when the user selects an option
   * @param {KernelSelectionOnSelectCallback} callback
   * @returns {KernelSelection} this
   */
  onSelect(callback) {
    this.#view.onSelect(callback)
    return this;
  }

  /**
   * Register a callback to be invoked when the selection gets enabled
   * @param {KernelSelectionOnEnabledCallback} callback
   * @returns {KernelSelection} this
   */
  onEnable(callback) {
    this.#view.onEnable(callback)
    return this
  }

  /**
   * Register a callback to be invoked when the selection gets disabled
   * @param {KernelSelectionOnDisabledCallback} callback
   * @returns {KernelSelection} this
   */
  onDisable(callback) {
    this.#view.onDisable(callback)
    return this
  }

}

/// ------------------- ///
///       Events        ///
/// ------------------- ///

/**
 * @static
 * @property {String} Select
 * @property {String} Enabled
 * @property {String} Disabled
 */
KernelSelectionService.Events = {
  /** */
  Select : "select",
  /** */
  Enabled : "enabled",
  /** */
  Disabled : "disabled"
}

/**
 * Fires when a kernel is selected
 * @event module:kernel-selection.KernelSelectionService.select
 * @property {CuKernel} kernel The selected kernel
 */

/**
 * Fires when the selection gets enabled
 * @event module:kernel-selection.KernelSelectionService.enabled
 */

/**
 * Fires when the selection gets disabled
 * @event module:kernel-selection.KernelSelectionService.disabled
 */


/// ------------------- ///
///  Callback Typedefs  ///
/// ------------------- ///

/**
 * @callback KernelSelectionOnSelectCallback
 * @memberof module:kernel-selection~KernelSelection
 * @param {CuKernel} kernel The selected kernel
 */

/**
 * @callback KernelSelectionOnEnabledCallback
 * @memberof module:kernel-selection
 */

/**
 * @callback KernelSelectionOnDisabledCallback
 * @memberof module:kernel-selection
 */

module.exports = KernelSelectionService