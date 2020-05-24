const ConsoleLogger       = require('log').ConsoleLogger
const EventEmitter        = require('events')
const NotificationService = require('./services/NotificationService')

class App {
  constructor() {
    this.electron = {}
    this.electron.remote = require('electron').remote
    this.electron.app = require('electron').remote.app

    this.input    = {
      path : null,
      contents : null
    }

    this.mock     = require(`../mock/cuda-source`)
    this.log      = new ConsoleLogger({level: ConsoleLogger.Level.Info})
    this.emitter  = new EventEmitter()
    this.notifier = new NotificationService() 
    this.ui       = require('./ui').init(this)
  }

  get root()    { return this.electron.app.root;     }
  get icon()    { return this.electron.app.iconPath; }
  get version() { return this.electron.app.version;  }
  get window()  { return this.electron.remote.getCurrentWindow() }

  get on()      { return this.emitter.on   }
  get emit()    { return this.emitter.emit }
  get once()    { return this.emitter.once }
  get eventNames()         { return this.emitter.eventNames }
  get removeAllListeners() { return this.emitter.removeAllListeners }
  get removeListener()     { return this.emitter.removeListener     }

  enableNotifications() { this.notifier.enable; }
  disableNotifications() { this.notifier.disable; }

  reload() { this.window.reload() }

  start() {
  } 
}

module.exports = App