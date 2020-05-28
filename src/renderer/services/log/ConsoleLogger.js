const Logger = require('./Logger')
const LogLevel = require('./LogLevel')

function now() {
	return new Date().toISOString();
}

/**
 * @augments module:log.Logger
 */
class ConsoleLogger extends Logger {
	/**
	 * 
	 * @param {Object} options 
	 * @param {Integer} options.level Severity level of the logger. See {@link module:log.LogLevel}
	 * @param {String} options.name Name for this logger
	 * @param {Boolean} options.color Whether or not to print colored messages
	 */
  constructor(options={}) {
		super(options.level, options.name)
		this.color = options.color || false
		// this.timestamp = options.timestamp || false
  }

  trace(message, ...args) {
		if (this.getLevel() <= LogLevel.Trace) {
			if ( this.color )
				console.log('%cTRACE', 'color: #888', message, ...args);
			else
				console.log('%cTRACE', message, ...args)
		}
	}

	debug(message, ...args) {
		if (this.getLevel() <= LogLevel.Debug) {
			if ( this.color)
				console.log('%cDEBUG', 'background: #eee; color: #888', message, ...args);
			else
				console.log('%cDEBUG', message, ...args);
		}
	}

	info(message, ...args) {
		if (this.getLevel() <= LogLevel.Info) {
			if ( this.color)
				console.log('%c INFO', 'color: #33f', message, ...args);
			else
				console.log('INFO', message, ...args);
		}
	}

	warn(message, ...args) {
		if (this.getLevel() <= LogLevel.Warning) {
			if ( this.color)
				console.log('%c WARN', 'color: #993', message, ...args);
			else
				console.log('%c WARN',  message, ...args);
		}
	}

	error(message, ...args) {
		if (this.getLevel() <= LogLevel.Error) {
			if ( this.color)
				console.log('%c  ERR', 'color: #f33', message, ...args);
			else
				console.log('%c  ERR', message, ...args);
		}
	}

	critical(message, ...args) {
		if (this.getLevel() <= LogLevel.Critical) {
			if ( this.color)
				console.log('%cCRITI', 'background: #f33; color: white', message, ...args);
			else
				console.log('%cCRITI', message, ...args);
		}
	}
}

module.exports = ConsoleLogger