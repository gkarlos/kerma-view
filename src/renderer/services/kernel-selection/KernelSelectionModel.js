/** @ignore @typedef {import("@renderer/models/cuda/CuKernel")} CuKernel */

const { CuKernel } = require("@renderer/models/cuda")

/**
 * @memberof module:kernel-selection
 */
class KernelSelectionModel {

  /** @type {Array.<CuKernel>} */
  #options
  /** @type {CuKernel} */
  #selection

  /**
   * Create a new KernelSelectionModel instance
   */
  constructor() {
    this.#options = []
    this.#selection = null
  }

  /**
   * @type {Array.<CuKernel>}
   */
  get options() { return this.#options }

  /**
   * @type {Number}
   */
  get numOptions() { return this.#options.length }

  /**
   * Add a kernel option
   * @param {CuKernel} kernel A CuKernel
   * @returns {KernelSelectionModel} this
   */
  addKernel(kernel) {
    if ( kernel instanceof CuKernel)
      this.#options.push(kernel)
    return this
  }

  /**
   * Remove a kernel from the available options
   * If the kernel is currently selected, the selection is cleared
   * @param {CuKernel} kernel A CuKernel
   * @returns {KernelSelectionModel} this
   */
  removeKernel(kernel) {
    for ( let i = 0; i < this.#options.length; ++i)
      if ( this.#options[i].equals(kernel)) {
        this.#options.splice(i, 1)
        if ( kernel.equals(this.#selection))
          this.clearSelection()
        break
      }
    return this
  }

  /**
   * Remove all kernel options.
   * Currentl selection (if any) gets cleared
   * @returns {KernelSelectionModel} this
   */
  removeAllKernels() {
    this.#options.splice(0, this.#options.length)
    return this.clearSelection()
  }

  /**
   * Select a kernel
   * @param {CuKernel} kernel A CuKernel
   * @returns {Boolean} `true` if the kernel was found. `false` otherwise
   */
  selectKernel(kernel) {  
    for ( const opt of this.#options)
      if (opt.equals(kernel)) {
        this.#selection = kernel
        return true
      }
    return false
  }

  /**
   * Select a kernel by its name. If muliple kernels with the same name exists, the first one found is selected.
   * @param {String} name 
   * @returns {Boolean} `true` if the kernel was found. `false` otherwise
   */
  selectKernelByName(name) {
    for ( const opt of this.#options) {
      if ( opt.source.name === name) {
        this.#selection = opt
        return true
      }
    }
    return false
  }

  /**
   * Select a kernel by its ID. If muliple kernels with the same ID exists, the first one found is selected.
   * @param {Number} id A kernel ID
   * @returns {Boolean} `true` if the kernel was found. `false` otherwise
   */
  selectKernelById(id) {
    for ( const opt of this.#options) {
      if ( opt.id === id) {
        this.#selection = opt
        return true
      }
    }
    return false
  }

  /**
   * Retrieve the current selection or `null` if one does not exist
   * @returns {CuKernel}
   */
  getSelection() { return this.#selection }

  /**
   * Invalidate the current selection
   * @returns {KernelSelectionModel} this
   */
  clearSelection() { 
    this.#selection = null
    return this
  }

  /**
   * Check if there is a selection currently
   * @returns {Boolean}
   */
  hasSelection() { return this.#selection !== null}

  /**
   * Check if a kernel exists in the available options
   * @param {CuKernel} kernel
   * @returns {Boolean}
   */
  hasKernel(kernel) {
    if ( this.findKernel(kernel) )
      return true
    return false
  } 

  /**
   * Check if a kernel with that name exists
   * @param {String} name 
   * @returns {Boolean}
   */
  hasKernelWithName(name) {
    if ( this.findKernelWithName(name) )
      return true
    else
      return false
  }

  /**
   * Check if a kernel with that id exists
   * @param {Number} id 
   * @returns {Boolean}
   */
  hasKernelWithId(id) {
    if ( this.findKernelWithId(id) )
      return true
    return false  
  }

  /**
   * Search for a kernel in the options and retrieve it if it exists
   * @param {CuKernel} kernel
   * @returns {CuKernel} The kernel if found. `undefined` otherwise 
   */
  findKernel(kernel) {
    return this.#options.find((ker) => ker.equals(kernel))
  }

  /**
   * Search for a kernel with that name in the options and retrieve it if it exists
   * @param {String} kernel
   * @returns {CuKernel} The kernel if found. `undefined` otherwise 
   */
  findKernelWithName(name) {
    return this.#options.find((ker) => ker.source.name === name)
  }

  /**
   * Search for a kernel with that id in the options and retrieve it if it exists
   * @param {Number} kernel
   * @returns {CuKernel} The kernel if found. `undefined` otherwise 
   */
  findKernelWithId(id) {
    return this.#options.find((ker) => ker.id === id)
  }
}

module.exports = KernelSelectionModel