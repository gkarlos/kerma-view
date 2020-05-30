/**
 * Singleton class that represents the available states for a Service
 * 
 * @class
 * @category services
 */
class ServiceState {

  /** @static */
  static Enabled = 0;
  
  /** @static */
  static Disabled = 1;

  constructor() {}
}

const instance = new ServiceState()

Object.freeze(instance)

module.exports = instance