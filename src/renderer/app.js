const ConsoleLogger       = require('./services/log').ConsoleLogger
const EventEmitter        = require('events')
const NotificationService = require('./services/notification/NotificationService')
const UI                  = require('./ui')
const Events              = require('./events')

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
    this.log      = new ConsoleLogger({level: ConsoleLogger.Level.Info, color: true})
    this.emitter  = new EventEmitter()

    this.notifier = new NotificationService();
    
    this.ui       = undefined
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


  initUI() {
    this.ui = UI.init(this);
  }

  initServices() {
    
  }

  start() {

    this.initUI();

    this.on(Events.UI_READY, () => {

      this.initServices();
    })


  } 
}

module.exports = App