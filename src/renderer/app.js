/** 
 * @module 
 * @category main
 */

/** 
 * @namespace App
 */
const App = {}

// function start() {
//   const NotificationService = require('./services/notification/NotificationService')
//   const ConsoleLogger       = require('./services/log').ConsoleLogger
//   const EventEmitter        = require('events') 
//   const UI                  = require('./ui')
//   const Events              = require('./events')

//   /** @namespace */
//   App.Electron = {}
//   App.Electron.remote = require('electron').remote
//   App.Electron.app    = App.Electron.remote.app

//   App.Events     = Events
//   App.events     = App.Events
//   /** */
//   App.Emitter    = new EventEmitter()
  
//   App.on         = App.Emitter.on
//   App.emit       = App.Emitter.emit
//   App.once       = App.Emitter.once
//   App.eventNames = App.Emitter.eventNames

//   App.Mock = require('@mock/cuda-source')

//   /** @namespace */
//   App.Services = {}

//   App.Services.Log = new ConsoleLogger({level: ConsoleLogger.Level.Info, color: true}).enable()
//   App.Logger = App.Services.Log

//   /** */
//   App.enableLogging  = () => { App.Services.Log.enable() }
//   /** */
//   App.disableLogging = () => { App.Services.Log.disable() }

//   App.ui = UI.init(App)
  
//   App.on(Events.UI_READY, () => {
//     App.Services.Notification = new NotificationService(App).enable() 
//   })

//   return true
// }

// App.main = ( () => { 
//   let started = false; 
//   return () => started = !started? start() : started
// })()

/** 
 * Entry point of the app
 * This is only meant to be called once. Subsequent calls are a no-op 
 */
App.main = function() {
  if ( App.started) return false 
  
  App.started = true

  const NotificationService = require('./services/notification/NotificationService')
  const ConsoleLogger       = require('./services/log').ConsoleLogger
  const EventEmitter        = require('events')  
  const UI                  = require('./ui')
  const Events              = require('./events')

  
  App.Electron = {
    /** */remote : require('electron').remote,
    /** */app    : require('electron').remote.app
  }

  App.Events     = Events
  App.events     = App.Events
  App.Emitter    = new EventEmitter()

  /** @method */
  App.on         = App.Emitter.on
  /** @method */
  App.emit       = App.Emitter.emit
  /** @method */
  App.once       = App.Emitter.once
  
  App.eventNames = App.Emitter.eventNames

  App.Mock = require('@mock/cuda-source')

  /** @namespace */
  App.Services = {
    /** */
    Log: undefined,
    /** */
    Notification : undefined
  }
  
  App.ui = undefined

  /** @method */
  App.enableLogging  = () => { App.Services.Log.enable() }
  /** @method */
  App.disableLogging = () => { App.Services.Log.disable() }


  function initUI() {
    App.ui = UI.init(App)
  }

  function initPreUiServices() {
    App.Services.Log = new ConsoleLogger({level: ConsoleLogger.Level.Trace, color: true, timestamps: true}).enable()
    App.Logger = App.Services.Log
  }

  function initPostUiServices() {
    App.Services.Notification = new NotificationService(App).enable() 
  }

  function start() {
    App.Logger.info("Hello World")
    App.Logger.trace("Hello World")
    App.Logger.debug("Hello World")
    App.Logger.warn("Hello World")
    App.Logger.error("Hello World")
    App.Logger.critical("Hello World")
  }

  initPreUiServices()
  initUI()
  App.on(Events.UI_READY, () => {
    initPostUiServices()  
    start()
  })
  
  return true
}

module.exports = App


