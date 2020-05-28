/**
 * Base class for all services
 * 
 * @class
 * @category services
 * 
 */
class Service {
  /**
   * Create a new Service. Initially the state is **Disabled**, following
   * this state machine
   * 
   * @mermaid
   * graph LR
   *  Disabled -- enable --> Enabled
   *  Disabled -- disable --> Disabled
   *  Disabled -- start --> Started.Enabled
   *  Disabled -- stop --> Stopped.Disabled
   *  Enabled -- start --> Started.Enabled
   *  Enabled -- stop --> Stopped.Disabled
   *  Enabled -- disable --> Disabled
   *  Enabled -- enable --> Enabled
   *  Started.Enabled -- disable --> Started.Disabled
   *  Started.Enabled -- enable --> Started.Enabled
   *  Started.Enabled -- start --> Started.Enabled
   *  Started.Enabled -- stop --> Stopped.Disabled
   *  Started.Disabled -- start --> Started.Disabled
   *  Started.Disabled -- stop --> Stopped.Disabled
   *  Started.Disabled -- enable --> Started.Enabled
   *  Started.Disabled -- disable --> Started.Disabled
   *  Stopped.Disabled -- enable --> Stopped.Disabled
   *  Stopped.Disabled -- disable --> Stopped.Disabled
   *  Stopped.Disabled --  start --> Stopped.Disabled
   *  Stopped.Disabled --  stop --> Stopped.Disabled
   * 
   * @param {String} name A name for the service
   */
  constructor(name) {
    if ( !name)
      throw new Error("Service.constructor: Parameter 'name' is required")
    this.name = name
    this.enabled = false
    this.started = false
    this.stopped = false
    this.onEnableCallbacks = []
    this.onDisableCallbacks = []
    this.onStartCallbacks = []
    this.onStopCallbacks = []
    this.onStateChangeCallbacks = []
  }

  /**
   * Retrieve the name of this service
   * @returns {String}
   */
  getName() {
    return this.name
  }

  /**
   * Enable the service. If the service is stopped this is a no-op
   * @returns {Service}
   */
  enable() { 
    if ( !this.stopped) {
      let wasDisabled = !this.enabled

      this.enabled = true
      
      if ( wasDisabled) {
        let self = this
        this.onStateChangeCallbacks.forEach(callback => callback(self));
        this.onEnableCallbacks.forEach(callback => callback(self));
      }
    }

    return this
  }

  /**
   * Disable the service. If the service is stopped this is a no-op
   * @returns {Service}
   */
  disable() {
    if ( !this.stopped) {
      let wasEnabled = this.enabled

      this.enabled = false

      if ( wasEnabled) {
        let self = this
        this.onStateChangeCallbacks.forEach(callback => callback(self));
        this.onDisableCallbacks.forEach(callback => callback(self));
      }
    }
      
    return this
  }

  /**
   * Start the service. Implicitely enables the service if disabled.
   * 
   * If the service was stopped, it a no-op
   * 
   * This operation is idempotent
   * @returns {Service}
   */
  start() {
    if ( !this.stopped && !this.started) {
      this.started = true

      let self = this
      this.onStartCallbacks.forEach(callback => callback(self))
      this.enable()
    }
    return this;
  }

  /**
   * Stop the service. A stopped service is also disabled.
   * This operation is irreversible. A stopped service
   * cannot be restarted.
   * This operation is idempotent
   * @returns {Service}
   */
  stop() {
    if (!this.stopped) {
      this.stopped = true

      let self = this
      this.onStopCallbacks.forEach(callback => callback(self))
      this.disable()
    }
    return this
  }

  /**
   * Check if the service is enabled
   * @returns {Boolean}
   */
  isEnabled() { return this.enabled }

  /**
   * Check if the service is disabled
   * @returns {Boolean}
   */
  isDisabled() { return !this.isEnabled() }

  /**
   * Check if the service was ever started. That is {@link Service#start} was called at least once
   * @returns {Boolean}
   */
  hasStarted() { return this.started; }

  /**
   * Check if the service was stopped. That is {@link Service#stop} was called at least once
   * @returns {Boolean}
   */
  hasStopped() { return this.stopped; }

  /**
   * Register a callback to be called when the service starts
   * 
   * @param {ServiceOnStartCallback} callback A callback
   * @returns {Boolean} Whether the callback was registered correctly
   */
  onStart(callback) {
    if (typeof callback === 'function') {
      this.onStartCallbacks.push(callback)
      return true
    }
    
    return false
  }

  /**
   * Register a callback to be called when the service stops
   * 
   * @param {ServiceOnStopCallback} callback A callback
   * @returns {Boolean} Whether the callback was registered correctly
   */
  onStop(callback) {
    if (typeof callback === 'function') {
      this.onStopCallbacks.push(callback)
      return true
    }
    return false
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
  onDisable(callback) {
    if (typeof callback === 'function') {
      this.onStateChangeCallbacks.push(callback)
      return true
    }
    return false
  }
}

/**
 * This callback is fired when the Service starts
 * @callback ServiceOnStartCallback
 * @param {Service} self Reference to the relevant Service
 * @returns {void}
 */

/**
 * This callback is fired when the Service stops
 * @callback ServiceOnStopCallback
 * @param {Service} self Reference to the relevant Service
 * @returns {void}
 */

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