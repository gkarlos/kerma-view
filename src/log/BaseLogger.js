const {InternalError} = require('util/error')

class BaseLogger {
  constructor(level) {
    this.level = level
  }

  setLevel(level) {
    if ( this.level != level)
      this.level = level
  }

  getLevel() {
    return this.level
  }

  trace(msg, args) { throw new InternalError("Cannot invoke abstract method BaseLogger.trace")}
  debug(msg, args) { throw new InternalError("Cannot invoke abstract method BaseLogger.debug")}
  info(msg, args) { throw new InternalError("Cannot invoke abstract method BaseLogger.info")}
  warn(msg, args) { throw new InternalError("Cannot invoke abstract method BaseLogger.warn")}
  error(msg, args) { throw new InternalError("Cannot invoke abstract method BaseLogger.error")}
  critical(msg, args) { throw new InternalError("Cannot invoke abstract method BaseLogger.critical")}
}

module.exports = BaseLogger