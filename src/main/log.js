const LogLevel = {
  Unknown  : 0,
  Trace    : 1,
  Debug    : 2,
  Info     : 3,
  Warning  : 4,
  Error    : 5,
  Critical : 6,
  None     : 7,
}

function timestamp() {
  return new Date().toISOString();
}

class Logger {
  /** */
  static Level = LogLevel;

	/**
	 * @param {Object}  options
	 * @param {Integer} options.level Severity level of the logger. See {@link module:log.LogLevel}
	 * @param {String}  options.name Name for this logger
	 * @param {Boolean} options.color Whether or not to print colored messages
	 * @param {Boolean} options.timestamps Whether the logger messages will include timestamps
	 */
  constructor(options={}) {
    this.level = options.level || LogLevel.Info
		this.color      = options.color || false
		this.timestamps = options.timestamps || false
  }

  trace(message, ...args) {
    if (this.level <= LogLevel.Trace) {
      if ( this.color )
        if ( this.timestamps)
          console.log(`%cTRACE %c[${timestamp()}]`, 'color: #888', 'color: #a3a3a3', message, ...args);
        else
          console.log('%cTRACE', 'color: #888', message, ...args);
      else
        if ( this.timestamps)
          console.log(`TRACE [${timestamp()}]`, message, ...args)
        else
          console.log('TRACE', message, ...args)
    }
	}

	debug(message, ...args) {
    if (this.level <= LogLevel.Debug) {
      if ( this.color)
        if ( this.timestamps)
          console.log(`%cDEBUG%c %c[${timestamp()}]`, 'background: #eee; color: #888', "", 'color: #a3a3a3', message, ...args);
        else
          console.log('%cDEBUG', 'color: #888', message, ...args);
      else
        if ( this.timestamps)
          console.log(`DEBUG [${timestamp()}]`, message, ...args)
        else
          console.log('DEBUG', message, ...args);
    }
	}

	info(message, ...args) {
    if (this.level <= LogLevel.Info) {
      if ( this.color)
        if ( this.timestamps)
          console.log(`%c INFO %c[${timestamp()}]`, 'color: #33f', 'color: #a3a3a3', message, ...args)
        else
          console.log('%c INFO', 'color: #33f', message, ...args);
      else
        if ( this.timestamps)
          console.log(` INFO [${timestamp()}]`, message, ...args);
        else
          console.log(' INFO', message, ...args);
    }
	}

	warn(message, ...args) {
    if (this.level <= LogLevel.Warning) {
      if ( this.color)
        if ( this.timestamps)
          console.log(`%c WARN %c[${timestamp()}]`, 'color: #993', 'color: #a3a3a3', message, ...args);
        else
          console.log('%c WARN', 'color: #993', message, ...args);
      else
        if ( this.timestamps)
          console.log(`%c WARN [${timestamp()}]`,  message, ...args);
        else
          console.log('%c WARN',  message, ...args);
    }
	}

	error(message, ...args) {
    if (this.level <= LogLevel.Error) {
      if ( this.color)
        if ( this.timestamps)
          console.log(`%c  ERR %c[${timestamp()}]`, 'color: #f33', 'color: #a3a3a3', message, ...args);
        else
          console.log('%c  ERR', 'color: #f33', message, ...args);
      else
        if ( this.timestamps)
          console.log(`%c  ERR [${timestamp()}]`,  message, ...args);
        else
          console.log('%c  ERR', message, ...args);
    }
	}

	critical(message, ...args) {
		if ( this.enabled) {
			if (this.level <= LogLevel.Critical) {
				if ( this.color)
					if ( this.timestamps)
						console.log(`%cCRITI%c %c[${timestamp()}]`, 'background: #f33; color: white', '', 'color: #a3a3a3', message, ...args);
					else
						console.log('%cCRITI', 'background: #f33; color: white', message, ...args);
				else
					if ( this.timestamps)
						console.log(`%cCRITI [${timestamp()}]`, message, ...args);
					else
						console.log('%cCRITI', message, ...args);
			}
		}
	}
}

module.exports = Logger