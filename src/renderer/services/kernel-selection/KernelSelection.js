'use-strict'

/** @ignore @typedef {import("@renderer/services/kernel-selection/KernelSelectionModel")} KernelSelectionModel */
/** @ignore @typedef {import("@renderer/services/kernel-selection/KernelSelectionView")} KernelSelectionView */
/** @ignore @typedef {import("@renderer/models/cuda/CudaKernel")} CudaKernel */

const KernelSelectionModel = require('@renderer/services/kernel-selection/KernelSelectionModel')
const KernelSelectionView = require('@renderer/services/kernel-selection/KernelSelectionView')

/**
 * A controller for a kernel selection
 * 
 * A KernelSelection is **disabled** by default and needs to be explicitely enabled
 * (see {@link module:kernel-selection.KernelSelection#enable})
 * @memberof module:kernel-selection
 */
class KernelSelection {
  /** @type {KernelSelectionModel} */
  #model
  /** @type {KernelSelectionView} */
  #view
  
  /**
   * Create a new KernelSelection instance
   * @param {Array.<CudaKernel>} [kernels] An array of CudaKernel objects to be used as options
   */
  constructor(kernels=[]) {
    this.#model = new KernelSelectionModel()
    this.#view = new KernelSelectionView(this.#model)
    this.#view.onSelect(kernel => this.#model.selectKernel(kernel))
    if ( Array.isArray(kernels))
      kernels.forEach(kernel => this.addKernel(kernel))
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
   * @type {Array.<CudaKernel>}
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
   * @param {CudaKernel} kernel A CudaKernel
   * @param {Boolean} [enable] 
   *  If set, the selection will be enabled after the kernel is added
   * @returns {KernelSelection} this
   */
  addKernel(kernel, enable=false) {
    this.#model.addKernel(kernel)
    this.#view.addKernel(kernel)
    if ( enable && !this.#view.isEnabled())
      this.#view.enable()
    return this
  }

  /**
   * Add multiple kernel options
   * @param {Array.<CudaKernel>} kernels An array of CudaKernel objects
   * @param {Boolean} [enable] 
   *  If set, the selection will be enabled after the kernels are added
   * @returns {KernelSelection} this
   */
  addKernels(kernels=[], enable) {
    kernels.forEach(kernel => this.addKernel(kernel))
    if ( enable) 
      this.enable()
    return this
  }

  /**
   * Remove a kernel from the options
   * If there are no options left the selection gets disabled
   * @param {CudaKernel} kernel 
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
   * @param {Array.<CudaKernel>} kernels An array of CudaKernel objects
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
   * @returns {CudaKernel} The select CudaKernel if it exists. `null` otherwise
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
   * @param {CudaKernel} kernel
   * @returns {Boolean} 
   */
  hasKernel(kernel) {
    return this.#model.hasKernel(kernel)
  }

  /**
   * Enable the selection. i.e allow the user to select an option
   * @param {Boolean} [silent] If set, the "enabled" event will not be triggered
   * @returns {KernelSelection} this
   */
  enable(silent=false) {
    this.#view.enable(silent)
    return this
  }

  /**
   * Disable the selection. i.e disallow the user to select an option
   * @param {Boolean} [silent] If set, the "disabled" event will not be triggered
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
///  Callback Typedefs  ///
/// ------------------- ///

/**
 * @callback KernelSelectionOnSelectCallback
 * @memberof module:kernel-selection
 * @param {CudaKernel} kernel The selected kernel
 */

/**
 * @callback KernelSelectionOnEnabledCallback
 * @memberof module:kernel-selection
 */

/**
 * @callback KernelSelectionOnDisabledCallback
 * @memberof module:kernel-selection
 */

module.exports = KernelSelection