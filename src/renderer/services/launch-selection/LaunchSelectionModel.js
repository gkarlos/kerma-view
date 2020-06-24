/** @ignore @typedef {import("@renderer/models/cuda/CudaLaunch")} CudaLaunch */
/** @ignore @typedef {import("@renderer/models/cuda/CudaKernel")} CudaKernel */

const CudaLaunch = require("@renderer/models/cuda/CudaLaunch")
const App = require('@renderer/app')

/**
 * @memberof module:launch-selection
 */
class LaunchSelectionModel {
  /** @type {Array.<CudaLaunch>} */
  #options
  /** @type {CudaLaunch} */
  #selection
  /** @type {CudaKernel} */
  #kernel

  /**
   * Create a new LaunchSelectionModel instance
   * @param {CudaKernel}
   */
  constructor(kernel) {
    this.#options = []
    this.#selection = null
    this.#kernel = kernel || null
  }

  /**
   * @type {Array.<CudaLaunch>}
   */
  get options() { return this.#options }

  /**
   * @type {Number}
   */
  get numOptions() { return this.#options.length }

  /**
   * Associate a kernel with this launch selection
   * i.e the kernel for which we are selecting a launch 
   * @returns {LaunchSelectionModel} this
   */
  attachKernel(kernel) {
    this.#kernel = kernel
    return this
  }

  /**
   * Check if a kernel is associated with this launch selection
   * @returns {Boolean}
   */
  hasKernelAttached() { 
    return this.#kernel !== null
  }

  /**
   * Add a kernel launch option
   * @param {CudaLaunch} kernel A CudaLaunch object
   * @returns {LaunchSelectionModel} this
   */ 
  addLaunch(launch) {
    // App.Logger.trace("LaunchSelectionModel","Adding launch: ", launch.toString())
    if ( launch instanceof CudaLaunch)
      this.#options.push(launch)
    return this
  }

  /**
   * Remove a kernel launch of the available options
   * If the launch is currently selected, the selection is cleared
   * @param {CudaLaunch} launch A CudaLaunch
   * @returns {LaunchSelectionModel} this
   */
  removeLaunch(launch) {
    for ( let i = 0; i < this.#options.length; ++i)
      if ( this.#options[i].equals(launch)) {
        this.#options.splice(i, 1)
        if ( launch.equals(this.#selection))
          this.clearSelection()
        break
      }
    return this
  }

  /**
   * Remove all kernel launch options.
   * Current selection (if any) gets cleared
   * @returns {LaunchSelectionModel} this
   */
  removeAllLaunches() {
    this.#options.splice(0, this.#options.length)
    return this.clearSelection()
  }

  /**
   * Select a launch
   * @param {CudaLaunch} kernel A CudaLaunch
   * @returns {Boolean} `true` if the launch was found. `false` otherwise
   */
  selectLaunch(launch) {
    for ( const opt of this.#options)
      if (opt.equals(launch)) {
        this.#selection = launch
        return true
      }
    return false
  }

  /**
   * Select a launch by its id
   * @param {Number} id A launch ID
   * @returns {Boolean} `true` if the launch was found. `false` otherwise
   */
  selectLaunchById(id) {
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
   * @returns {CudaLaunch}
   */
  getSelection() { return this.#selection }

  /**
   * Invalidate the current selection
   * @returns {LaunchSelectionModel} this
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
   * Check if a launch exists in the available options
   * @param {CudaLaunch} launch
   * @returns {Boolean}
   */
  hasLaunch(launch) {
    if ( this.findLaunch(launch))
      return true
    return false
  }

  /**
   * 
   * @param {Number} id 
   * @returns {Boolean}
   */
  hasLaunchWithId(id) {
    if ( this.findLaunchWithId(id))
      return true
    return false
  }

  /**
   * Search for a launch in the options and retrieve it if it exists
   * @param {CudaLaunch} launch
   * @returns {CudaLaunch} The launch if found. `undefined` otherwise 
   */
  findLaunch(laucnh) {
    return this.#options.find(l => l.equals(launch))
  }

  /**
   * Search for a launch with that id in the options and retrieve it if it exists
   * @param {Number} kernel
   * @returns {CudaLaunch} The launch if found. `undefined` otherwise 
   */
  findLaunchWithId(id) {
    return this.#options.find(l => l.id === id)
  }
}

module.exports = LaunchSelectionModel