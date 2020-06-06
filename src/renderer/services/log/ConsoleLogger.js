const Logger = require('./Logger')
const LogLevel = require('./LogLevel')

const random  = require('@renderer/util/random')

/**
 * @extends module:log.Logger
 * @memberof module:log
 */
class ConsoleLogger extends Logger {
	/**
	 * 
	 * @param {Object}  options 
	 * @param {Integer} options.level Severity level of the logger. See {@link module:log.LogLevel}
	 * @param {String}  options.name Name for this logger
	 * @param {Boolean} options.color Whether or not to print colored messages
	 * @param {Boolean} options.timestamps Whether the logger messages will include timestamps
	 */
  constructor(options={}) {
		super(options.level || LogLevel.Info, options.name || `ConsoleLogger-${random.uuid(4)}`)
		this.color      = options.color || false
		this.timestamps = options.timestamps || false
  }

  trace(message, ...args) {
		if ( this.isEnabled()) {
			if (this.getLevel() <= LogLevel.Trace) {
				if ( this.color )
					if ( this.timestamps)
						console.log(`%cTRACE %c[${Logger.timestamp()}]`, 'color: #888', 'color: #a3a3a3', message, ...args);
					else
						console.log('%cTRACE', 'color: #888', message, ...args);
				else
					if ( this.timestamps)
						console.log(`TRACE [${Logger.timestamp()}]`, message, ...args)
					else
						console.log('TRACE', message, ...args)
			}
		}
	}

	debug(message, ...args) {
		if( this.isEnabled()) {
			if (this.getLevel() <= LogLevel.Debug) {
				if ( this.color)
					if ( this.timestamps)
						console.log(`%cDEBUG%c %c[${Logger.timestamp()}]`, 'background: #eee; color: #888', "", 'color: #a3a3a3', message, ...args);
					else
						console.log('%cDEBUG', 'color: #888', message, ...args);
				else
					if ( this.timestamps)
						console.log(`DEBUG [${Logger.timestamp()}]`, message, ...args)
					else
						console.log('DEBUG', message, ...args);
			}
		}
	}

	info(message, ...args) {
		if ( this.isEnabled()) {
			if (this.getLevel() <= LogLevel.Info) {
				if ( this.color)
					if ( this.timestamps)
						console.log(`%c INFO %c[${Logger.timestamp()}]`, 'color: #33f', 'color: #a3a3a3', message, ...args)
					else
						console.log('%c INFO', 'color: #33f', message, ...args);
				else
					if ( this.timestamps)
						console.log(` INFO [${Logger.timestamp()}]`, message, ...args);
					else
						console.log(' INFO', message, ...args);
			}
		}
	}

	warn(message, ...args) {
		if ( this.isEnabled()) {
			if (this.getLevel() <= LogLevel.Warning) {
				if ( this.color)
					if ( this.timestamps)
						console.log(`%c WARN %c[${Logger.timestamp()}]`, 'color: #993', 'color: #a3a3a3', message, ...args);
					else
						console.log('%c WARN', 'color: #993', message, ...args);
				else
					if ( this.timestamps)
						console.log(`%c WARN [${Logger.timestamp()}]`,  message, ...args);
					else
						console.log('%c WARN',  message, ...args);
			}
		}
	}

	error(message, ...args) {
		if ( this.isEnabled()) {
			if (this.getLevel() <= LogLevel.Error) {
				if ( this.color)
					if ( this.timestamps)
						console.log(`%c  ERR %c[${Logger.timestamp()}]`, 'color: #f33', 'color: #a3a3a3', message, ...args);
					else
						console.log('%c  ERR', 'color: #f33', message, ...args);
				else
					if ( this.timestamps)
						console.log(`%c  ERR [${Logger.timestamp()}]`,  message, ...args);
					else
						console.log('%c  ERR', message, ...args);
			}
		}
	}

	critical(message, ...args) {
		if ( this.isEnabled()) {
			if (this.getLevel() <= LogLevel.Critical) {
				if ( this.color)
					if ( this.timestamps)
						console.log(`%cCRITI%c %c[${Logger.timestamp()}]`, 'background: #f33; color: white', '', 'color: #a3a3a3', message, ...args);
					else
						console.log('%cCRITI', 'background: #f33; color: white', message, ...args);
				else
					if ( this.timestamps)
						console.log(`%cCRITI [${Logger.timestamp()}]`, message, ...args);
					else
						console.log('%cCRITI', message, ...args);
			}
		}
	}
}

module.exports = ConsoleLogger