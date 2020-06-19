/** @ignore @typedef {import("@renderer/services/kernel-selection/KernelSelectionModel")} KernelSelectionModel */
/** @ignore @typedef {import("@renderer/services/kernel-selection/KernelSelectionView")} KernelSelectionView */
/** @ignore @typedef {import("@renderer/models/cuda/CudaKernel")} CudaKernel */

const KernelSelectionModel = require('@renderer/services/kernel-selection/KernelSelectionModel')
const KernelSelectionView = require('@renderer/services/kernel-selection/KernelSelectionView')

/**
 * @memberof module:kernel-selection
 * A controller for kernel selection
 */
class KernelSelection {
  /** @type {KernelSelectionModel} */
  #model
  /** @type {KernelSelectionView} */
  #view
  
  constructor() {
    this.#model = new KernelSelectionModel()
    this.#view = new KernelSelectionView(this.#model).render()
    this.#view.onSelect(kernel => this.#model.selectKernel(kernel))
  }

  /**
   * @type {Array.<CudaKernel>}
   */
  get options() { return this.#model.options }

  /**
   * @type {Number}
   */
  get numOptions() { return this.#model.options.length }

  /**
   * Add a kernel option
   * @param {CudaKernel} kernel A CudaKernel
   * @returns {KernelSelectionModel} this
   */
  addKernel(kernel) {
    this.#model.addKernel(kernel)
    this.#view.addKernel(kernel)
    console.log("Added kernel", kernel.toString())
    if ( !this.#view.isEnabled())
      this.#view.enable()
    return this
  }

  /**
   * Remove a kernel from the options
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
   * Retrieve the current selection, if one exists
   */
  getSelection() {
    return this.#model.getSelection()
  }

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
   * @param {KernelSelectionOnSelectCallback} callback
   */
  onSelect(callback) {
    this.#view.onSelect(callback)
  }

  /**
   * @param {KernelSelectionOnEnabledCallback} callback
   */
  onEnable(callback) {
    this.#view.onEnable(callback)
  }

  /**
   * @param {KernelSelectionOnDisabledCallback} callback
   */
  onDisable(callback) {
    this.#view.onDisable(callback)
  }
}

/**
 * @callback KernelSelectionOnSelectCallback
 * @memberof module:kernel-selection
 * @param {CudaKernel} kernel The identifier of the selected kernel
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