/** @ignore @typedef {import("@renderer/services/kernel-selection/KernelSelectionModel")} KernelSelectionModel */
/** @ignore @typedef {import("@renderer/services/kernel-selection/KernelSelectionView")} KernelSelectionView */
/** @ignore @typedef {import("@renderer/models/cuda/CudaKernel")} CudaKernel */

const KernelSelectionModel = require('@renderer/services/kernel-selection/KernelSelectionModel')
const KernelSelectionView = require('@renderer/services/kernel-selection/KernelSelectionView')

/**
 * A controller for a kernel selection
 * 
 * A KernelSelection is **disabled** by defaults and needs to be explicitely enabled
 * (see {@link module:kernel-selection.KernelSelection#enable})
 * @memberof module:kernel-selection
 */
class KernelSelection {
  /** @type {KernelSelectionModel} */
  #model
  /** @type {KernelSelectionView} */
  #view
  
  /**
   * 
   * @param {Array.<CudaKernel>} [kernels] An array of CudaKernel objects to be used as options
   */
  constructor(kernels=[]) {
    this.#model = new KernelSelectionModel()
    this.#view = new KernelSelectionView(this.#model)
    this.#view.onSelect(kernel => this.#model.selectKernel(kernel))
    kernels.forEach(kernel => this.addKernel(kernel))
  }
  
  ///                     ///
  /// Computed Properties ///
  ///                     ///
  
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
   * @type {Array.<CudaKernel>}
   */
  get options() { return this.#model.options }

  /**
   * @type {Number}
   */
  get numOptions() { return this.#model.options.length }

  ///           ///
  /// Methods   ///
  ///           ///
  
  /**
   * Add a kernel to the options
   * @param {CudaKernel} kernel A CudaKernel
   * @param {Boolean} [enable] If set, the selection will be enabled after the kernel is added
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
   * @param {Boolean} enable If set, the selection will be enabled after the kernels are added
   * @returns {KernelSelectionModel} this
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
   * @returns {KernelSelectionModel} this
   */
  removeKernel(kernel) {  
    this.#model.removeKernel(kernel)
    this.#view.removeKernel(kernel)
    if ( this.#view.isEnabled() && this.#model.numOptions === 0)
      this.#view.disable()
    return this
  }

  /**
   * Remove all kernel options
   * @returns {KernelSelectionModel} this
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
   */
  clearSelection() {
    this.#model.clearSelection()
    this.#view.clearSelection()
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
   * @returns {KernelSelection} this
   */
  enable() {
    this.#view.enable()
    return this
  }

  /**
   * Disable the selection. i.e disallow the user to select an option
   * @returns {KernelSelection} this
   */
  disable() {
    this.#view.disable()
    return this;
  }

  isEnabled() {
    return this.#view.isEnabled()
  }

  /**
   * 
   */
  dispose(remove) {
    this.#view.dispose(remove)
  }

  /**
   * @param {KernelSelectionOnSelectCallback} callback
   */
  onSelect(callback) {
    this.#view.onSelect(callback)
    return this;
  }

  /**
   * @param {KernelSelectionOnEnabledCallback} callback
   */
  onEnable(callback) {
    this.#view.onEnable(callback)
    return this
  }

  /**
   * @param {KernelSelectionOnDisabledCallback} callback
   */
  onDisable(callback) {
    this.#view.onDisable(callback)
    return this
  }
}

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