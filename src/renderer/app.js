/** 
 * @module 
 * @category main
 */

/** 
 * @namespace App
 */
const App = {}

/** 
 * Entry point of the app
 * This is only meant to be called once. Subsequent calls are a no-op 
 */
App.main = function() {
  if ( App.started) return false 
  
  App.started = true
  
  const EventEmitter        = require('events')  
  const UI                  = require('./ui')
  const Events              = require('./events')

  const NotificationService          = require('./services/notification').NotificationService
  const ConsoleLogger                = require('./services/log').ConsoleLogger

  const ComputeUnitSelectionService  = require('./services/compute-selection').ComputeUnitSelectionService


  // const CudaLimits  = require('@renderer/cuda').limits.

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
  App.input = {
    path : undefined
  }

  /** @namespace */
  App.Services = {
    /** */
    Log: undefined,
    /** */
    Notification : undefined
  }
  
  App.ui = UI.instance

  /** @method */
  App.enableLogging  = () => { App.Services.Log.enable() }
  /** @method */
  App.disableLogging = () => { App.Services.Log.disable() }


  function initPreUiServices() {
    App.Services.Log = new ConsoleLogger({level: ConsoleLogger.Level.Trace, color: true, timestamps: true}).enable()
    App.Logger = App.Services.Log
  }

  function initPostUiServices() {
    App.Services.Notification = new NotificationService(App).enable()
    App.Notifier = App.Services.Notification

    App.Services.ComputeUnitSelection = new ComputeUnitSelectionService().enable()
    App.ComputeUnitSelector = App.Services.ComputeUnitSelection
  }

  function start() {

  }

  initPreUiServices()

  
  App.on(Events.UI_READY, () => {
    initPostUiServices()  
    start()
  })

  App.ui.init()

  
  return true
}

module.exports = App


