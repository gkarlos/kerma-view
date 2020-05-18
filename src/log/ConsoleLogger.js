const BaseLogger = require('./BaseLogger')
const LogLevel   = require('./LogLevel')

function now() {
	return new Date().toISOString();
}

const ConsoleLoggerOptions = {
	level : {
		default : LogLevel.Info
	}
}

class ConsoleLogger extends BaseLogger {
  constructor(opts = {
		level: ConsoleLoggerOptions.level.default,
	}) 
	{
		super()
		this.setLevel(opts.level)
  }

  static get Level() {
    return LogLevel
  }

  trace(message, ...args) {
		if (this.getLevel() <= LogLevel.Trace) {
			console.log('%cTRACE', 'color: #888', message, ...args);
		}
	}

	debug(message, ...args) {
		if (this.getLevel() <= LogLevel.Debug) {
			console.log('%cDEBUG', 'background: #eee; color: #888', message, ...args);
		}
	}

	info(message, ...args) {
		if (this.getLevel() <= LogLevel.Info) {
			console.log('%c INFO', 'color: #33f', message, ...args);
		}
	}

	warn(message, ...args) {
		if (this.getLevel() <= LogLevel.Warning) {
			console.log('%c WARN', 'color: #993', message, ...args);
		}
	}

	error(message, ...args) {
		if (this.getLevel() <= LogLevel.Error) {
			console.log('%c  ERR', 'color: #f33', message, ...args);
		}
	}

	critical(message, ...args) {
		if (this.getLevel() <= LogLevel.Critical) {
			console.log('%cCRITI', 'background: #f33; color: white', message, ...args);
		}
	}
}

module.exports = ConsoleLogger