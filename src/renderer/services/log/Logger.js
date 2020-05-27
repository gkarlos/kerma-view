const LogLevel = require('./LogLevel')
const random = require('renderer/util/random')

/**
 * Base class for all loggers
 * 
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
   * @param {Integer} level A new level for this logger. @see {@link module:log.LogLevel}
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
   * See @link module:log.LogLevel}
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
  debug(msg, args) { throw new Error("Cannot invoke abstract method Logger.debug")}
  info(msg, args) { throw new Error("Cannot invoke abstract method Logger.info")}
  warn(msg, args) { throw new Error("Cannot invoke abstract method Logger.warn")}
  error(msg, args) { throw new Error("Cannot invoke abstract method Logger.error")}
  critical(msg, args) { throw new Error("Cannot invoke abstract method Logger.critical")}
}

/**
 * Default logging level
 * @static
 */
Logger.DEFAULT_LEVEL = LogLevel.Info

module.exports = Logger