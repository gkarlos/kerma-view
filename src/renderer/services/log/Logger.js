const LogLevel = require('./LogLevel')
const random = require('renderer/util/random')

/**
 * Base class for all loggers
 * 
 * @public
 * @memberof module:log
 * @abstract
 */
class Logger {
  /**
   * 
   * @param {Integer} level The level of this logger. See {@link module:log.LogLevel} 
   * @param {String} name A name for this logger. If none provided one will be generated
   */
  constructor(level, name) {
    this.level = level | Logger.DEFAULT_LEVEL
    this.name = name | `${this.constructor.name}-${random.uuid(5)}`
  }

  /**
   * Set the level of this logger
   * @param {Integer} level A new level for this logger. See {@link module:log.LogLevel}
   * @returns {void}
   * @example logger.setLevel(LogLevel.Debug)
   */
  setLevel(level) {
    if ( this.level != level)
      this.level = level
  }

  /**
   * Set the name of this logger
   * @param {String} name A new name for this logger
   * @returns {void}
   */
  setName(name) {
    if ( this.name != name)
      this.name = name
  }

  /**
   * Get the level of this logger
   * See {@link module:log.LogLevel}
   * @returns {Integer}
   */
  getLevel() {
    return this.level
  }

  /**
   * Get the name of this logger
   * @return {String}
   */
  getName() {
    return this.name
  }

  /**
   * A trace message
   * @abstract
   * @param {String} msg 
   * @param {*} args Additional arguments
   */
  trace(msg, args) { throw new Error("Cannot invoke abstract method Logger.trace")}

  /**
   * A debug message
   * @abstract
   * @param {String} msg 
   * @param {*} args Additional arguments
   */
  debug(msg, args) { throw new Error("Cannot invoke abstract method Logger.debug")}

  /**
   * A info message
   * @abstract
   * @param {String} msg 
   * @param {*} args Additional arguments
   */
  info(msg, args) { throw new Error("Cannot invoke abstract method Logger.info")}

  /**
   * A warning message
   * @abstract
   * @param {String} msg 
   * @param {*} args Additional arguments
   */
  warn(msg, args) { throw new Error("Cannot invoke abstract method Logger.warn")}

  /**
   * An error message
   * @abstract
   * @param {String} msg 
   * @param {*} args Additional arguments
   */
  error(msg, args) { throw new Error("Cannot invoke abstract method Logger.error")}
  
  /**
   * A critical error message
   * @abstract
   * @param {String} msg 
   * @param {*} args Additional arguments
   */
  critical(msg, args) { throw new Error("Cannot invoke abstract method Logger.critical")}
}

/**
 * Logger levels. Alias for {@link module:log.LogLevel}
 * @static
 */
Logger.Level = LogLevel

/**
 * Default logging level: {@link module:log.LogLevel.Info}
 * @static
 */
Logger.DEFAULT_LEVEL = Logger.Level.Info


module.exports = Logger