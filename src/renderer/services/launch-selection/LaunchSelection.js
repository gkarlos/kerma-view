'use-strict'

/** @ignore @typedef {import("@renderer/services/launch-selection/LaunchSelectionModel")} LaunchSelectionModel */
/** @ignore @typedef {import("@renderer/services/launch-selection/LaunchSelectionView")} LaunchSelectionView */
/** @ignore @typedef {import("@renderer/models/cuda/CudaLaunch")} CudaLaunch */

const LaunchSelectionModel = require('@renderer/services/launch-selection/LaunchSelectionModel')
const LaunchSelectionView = require('@renderer/services/launch-selection/LaunchSelectionView')

/**
 * A controller for a kernel selection
 * 
 * A LaunchSelection is **disabled** by default and needs to be explicitely enabled
 * (see {@link module:launch-selection.LaunchSelection#enable})
 * @memberof module:launch-selection
 */
class LaunchSelection { 
  /** @type {LaunchSelectionModel} */
  #model
  /** @type {LaunchSelectionView} */
  #view
  
  /**
   * Create a new LaunchSelection instance
   * @param {Array.<CudaLaunch>} [launches] An array of CudaLaunch objects to be used as options
   */
  constructor(launches=[]) {
    this.#model = new LaunchSelectionModel()
    this.#view = new LaunchSelectionView(this.#model)
    this.#view.onSelect(launch => this.#model.selectLaunch(launch))
    if ( Array.isArray(launches))
      launches.forEach(launch => this.addLaunch(launch))
  }

  /// ------------------- ///
  /// Accessor Properties ///
  /// ------------------- ///
  
  /**
   * The model of this LaunchSelection 
   * @type {LaunchSelectionModel} 
   */
  get model() { return this.#model }

  /** 
   * The view of this LaunchSelection
   * @type {LaunchSelectionView}
   */
  get view() { return this.#view }

  /**
   * The available options of this LaunchSelection
   * @type {Array.<CudaLaunch>} 
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
   * Add a launch to the options
   * @param {CudaLaunch} launch A CudaLaunch
   * @param {Boolean} [enable] 
   *  If set, the selection will be enabled (if currently disabled) after the launch is added
   * @returns {KernelSelection} this
   */
  addLaunch(launch, enable=false) {
    this.#model.addLaunch(launch)
    this.#view.addLaunch(launch)
    if ( enable && !this.#view.isEnabled())
      this.#view.enable()
    return this
  }

  /**
   * Add multiple launch options
   * @param {Array.<CudaLaunch>} launches An array of CudaLaunch objects
   * @param {Boolean} [enable] 
   *  If set, the selection will be enabled after the launches are added
   * @returns {LaunchSelection} this
   */
  addLaunches(launches=[], enable) {
    launches.forEach(launch => this.addLaunch(launch))
    if ( enable) 
      this.enable()
    return this
  }

  /**
   * Remove a launch from the options
   * If there are no options left the selection gets disabled
   * @param {CudaLaunch} launch 
   * @param {Boolean} [keepEnabled] 
   *  If set, the selection will not get disabled if there are no options left
   * @returns {LaunchSelection} this
   */
  removeLaunch(launch, keepEnabled=false) {  
    this.#model.removeLaunch(launch)
    this.#view.removeLaunch(launch)
    if ( !keepEnabled && this.#view.isEnabled() && this.#model.numOptions === 0)
      this.#view.disable()
    return this
  }

  /**
   * Remove a number of launches from the options
   * @param {Array.<CudaLaunch>} launches An array of CudaLaunch objects
   * @param {Boolean} [keepEnabled]
   *   If set, the selection will not get disabled if there are no options left after the removal
   * @returns {LaunchSelection} this 
   */
  removeLaunches(launches=[], keepEnabled=false) {
    if ( Array.isArray(launches))
      kernels.forEach(launch => this.removeLaunch(launch, keepEnabled))
    return this;
  }

  /**
   * Remove all launch options
   * @returns {LaunchSelection} this
   */
  removeAllLaunches() {
    this.#model.removeAllLaunches()
    this.#view.removeAllLaunches()
    this.#view.disable()
    return this
  }

  /**
   * Retrieve the currently selected option, if one exists
   * @returns {CudaLaunch} The select CudaLaunch if it exists. `null` otherwise
   */
  getSelection() { return this.#model.getSelection() }

  /**
   * Unselect the currently selected kernel launch
   * @returns {LaunchSelection} this
   */
  clearSelection() {
    this.#model.clearSelection()
    this.#view.clearSelection()
    return this
  }

  /**
   * Check if a launch exists as an option
   * @param {CudaLaunch} launch
   * @returns {Boolean} 
   */
  hasLaunch(launch) {
    return this.#model.hasLaunch(launch)
  }

  /**
   * Enable the selection. i.e allow the user to select an option
   * @param {Boolean} [silent] If set, the "enabled" event will not be triggered
   * @returns {LaunchSelection} this
   */
  enable(silent=false) {
    this.#view.enable(silent)
    return this
  }

  /**
   * Disable the selection. i.e disallow the user to select an option
   * @param {Boolean} [silent] If set, the "disabled" event will not be triggered
   * @returns {LaunchSelection} this
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
   * @param {Boolean} [remove] Remove from the DOM
   * @return {LaunchSelection} this
   */
  dispose(remove=true) {
    this.#view.dispose(remove)
    return this
  }

  /// --------------------- ///
  /// Callback Registration ///
  /// --------------------- ///

  /**
   * Register a callback to be invoked when the user selects an option
   * @param {LaunchSelectionOnSelectCallback} callback
   * @returns {LaunchSelection} this
   */
  onSelect(callback) {
    this.#view.onSelect(callback)
    return this;
  }

  /**
   * Register a callback to be invoked when the selection gets enabled
   * @param {LaunchSelectionOnEnabledCallback} callback
   * @returns {LaunchSelection} this
   */
  onEnable(callback) {
    this.#view.onEnable(callback)
    return this
  }

  /** 
   * Register a callback to be invoked when the selection gets disabled
   * @param {LaunchSelectionOnDisabledCallback} callback
   * @returns {LaunchSelection} this
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
 * @callback LaunchSelectionOnSelectCallback
 * @memberof module:launch-selection
 * @param {CudaLaunch} launch The selected kernel launch
 */

/**
 * @callback LaunchSelectionOnEnabledCallback
 * @memberof module:launch-selection
 */

/**
 * @callback LaunchSelectionOnDisabledCallback
 * @memberof module:launch-selection
 */

module.exports = LaunchSelection