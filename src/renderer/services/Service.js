const ServiceState = require('@renderer/services/ServiceState')

/**
 * Base class for all services
 * 
 * @category Renderer
 * @subcategory services
 * 
 */
class Service {

  onEnableCallbacks      = []
  onDisableCallbacks     = []
  onStateChangeCallbacks = []
  
  /**
   * Create a new Service. Initially the state is **Disabled**
   * 
   * @param {String} name A name for the service
   */
  constructor(name) {
    if ( !name)
      throw new Error("Service.constructor: Parameter 'name' is required")
    this.name = name
    this.state = ServiceState.Disabled;
  }

  /**
   * Retrieve the name of this service
   * @returns {String}
   */
  getName() { return this.name }

  /**
   * Retrieve the state of the Service
   * @returns {ServiceState.Enabled|ServiceState.Disabled}
   */
  getState() { return this.state}

  /**
   * Check if the service is enabled
   * @returns {Boolean}
   */
  isEnabled() { return this.state === ServiceState.Enabled }

  /**
   * Check if the service is disabled
   * @returns {Boolean}
   */
  isDisabled() { return this.state === ServiceState.Disabled }

  /**
   * Enable the service. Triggers state change if 
   * @returns {Service}
   */
  enable() { 
    if ( this.isDisabled()) {
      let self = this
      this.onStateChangeCallbacks.forEach(callback => callback(self));
      this.onEnableCallbacks.forEach(callback => callback(self));
      this.state = ServiceState.Enabled
    }
    return this;
  }

  /**
   * Disable the service. If the service is stopped this is a no-op
   * @returns {Service}
   */
  disable() {
    if ( this.isEnabled()) {
      let self = this
      this.onStateChangeCallbacks.forEach(callback => callback(self));
      this.onDisableCallbacks.forEach(callback => callback(self));
      this.state = ServiceState.Disabled
    } 
    return this
  }

  /**
   * Register a callback to be called when the service gets enabled
   * 
   * @param {ServiceOnEnableCallback} callback A callback
   * @returns {Boolean} Whether the callback was registered correctly
   */
  onEnable(callback) {
    if (typeof callback === 'function') {
      this.onEnableCallbacks.push(callback)
      return true
    }
    return false
  }

  /**
   * Register a callback to be called when the service gets disabled
   * 
   * @param {ServiceOnDisableCallback} callback A callback
   * @returns {Boolean} Whether the callback was registered correctly
   */
  onDisable(callback) {
    if (typeof callback === 'function') {
      this.onDisableCallbacks.push(callback)
      return true
    }
    return false
  }

  /**
   * Register a callback to be called when the service changes state
   * 
   * @param {ServiceOnStateChangeCallback} callback A callback
   * @returns {Boolean} Whether the callback was registered correctly
   */
  onStateChange(callback) {
    if (typeof callback === 'function') {
      this.onStateChangeCallbacks.push(callback)
      return true
    }
    return false
  }
}

 /**
 * This callback is fired when the Service gets enabled
 * @callback ServiceOnEnableCallback
 * @param {Service} self Reference to the relevant Service
 * @returns {void}
 */

/**
 * This callback is fired when the Service gets disabled
 * @callback ServiceOnDisableCallback
 * @param {Service} self Reference to the relevant Service
 * @returns {void}
 */

 /**
 * This callback is fired when the Service changes state
 * @callback ServiceOnStateChangeCallback
 * @param {Service} self Reference to the relevant Service
 * @returns {void}
 */

module.exports = Service