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
    if ( !this.stopped)
      this.enabled = true
    return this
  }

  /**
   * Disable the service. If the service is stopped this is a no-op
   * @returns {Service}
   */
  disable() {
    if ( !this.stopped)
      this.enabled = false
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
      this.enabled = true
    }
    return this;
  }

  /**
   * Stop the service. This operation is irreversible. A stopped service
   * cannot be restarted.
   * This operation is idempotent
   * @returns {Service}
   */
  stop() {
    if (!this.stopped) {
      this.stopped = true
      this.enabled = false
    }
    return this
  }

  // /**
  //  * Check if the service is currently operating,
  //  * That is, the service is enabled and started state
  //  * @returns {Boolean}
  //  */
  // isOnline() {
  //   return this.started && !this.stopped && this.enabled
  // }

  // /**
  //  * Check if the service is currently not operating.
  //  * Will return true if the service is either disabled, stopped, or was never started
  //  * @returns {Boolean}
  //  */
  // isOffline() {
  //   return !this.isOnline()
  // }

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
}

module.exports = Service