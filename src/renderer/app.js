/** 
 * @module 
 * @category main
 */

/// Some typedef imports for vscode intellisence :
/** @ignore @typedef {import("@renderer/services/log/ConsoleLogger")}                       ConsoleLogger          */
/** @ignore @typedef {import("@renderer/services/notification/NotificationService")}        NotificationService    */
/** @ignore @typedef {import("@renderer/services/kernel-selection/KernelSelectionService")} KernelSelectionService */
/** @ignore @typedef {import("@renderer/ui")} Ui */


const App = {}

App.Emitter    = new (require('events'))()
/** @method */
App.on         = App.Emitter.on
/** @method */
App.emit       = App.Emitter.emit
/** @method */
App.once       = App.Emitter.once
App.eventNames = App.Emitter.eventNames

/**
 * @property {KernelSelectionService} KernelSelection
 */
App.Services = {
  /** @type {ConsoleLogger} */          
  Log : undefined,
  /** @type {NotificationService} */
  Notification : undefined,
  /** @type {KernelSelectionService} */
  KernelSelection : undefined
}

App.Electron = { remote : undefined, app : undefined}

/** 
 * Entry point of the app
 * This is only meant to be called once. Subsequent calls are a no-op 
 */
App.main = function() {
  if ( App.started) return false 
  
  App.started = true

  const Events = require('./events')
  const NotificationService          = require('./services/notification').NotificationService
  const ConsoleLogger                = require('./services/log').ConsoleLogger
  const KernelSelectionService       = require('./services/kernel-selection').KernelSelectionService
  const ComputeUnitSelectionService  = require('./services/compute-selection').ComputeUnitSelectionService
  

  App.Events          = Events
  App.events          = App.Events
  App.Electron.remote = require('electron').remote,
  App.Electron.app    = require('electron').remote.app
  App.Mock            = require('@mock/cuda-source')
  App.input           = {
    path : undefined
  }

  /** @method */
  App.enableLogging  = () => { App.Services.Log.enable() }
  /** @method */
  App.disableLogging = () => { App.Services.Log.disable() }

  App.ui = require('@renderer/ui')

  function initPreUiServices() {
    App.Services.Log = new ConsoleLogger({level: ConsoleLogger.Level.Trace, color: true, timestamps: true}).enable()
    App.Logger = App.Services.Log
  }

  function initPostUiServices() {
    App.Services.Notification         = new NotificationService().enable()
    App.Services.KernelSelection      = new KernelSelectionService()
    App.Services.ComputeUnitSelection = new ComputeUnitSelectionService().enable()

    App.Notifier = App.Services.Notification
    // App.ComputeUnitSelector = App.Services.ComputeUnitSelection
  }

  function start() {
    let kernelSelection = App.Services.KernelSelection.createNew().onSelect( kernel => App.Notifier.info( kernel.toString()))
    let launchSelection =
    
    App.on( Events.INPUT_FILE_SELECTED, () => {
      App.Services.KernelSelection.createNewMock(kernelSelection)
    })

    App.on( Events.INPUT_KERNEL_SELECTED, () => {

    })


  }

  initPreUiServices()

  App.ui.init()
  
  App.on(Events.UI_READY, () => {
    initPostUiServices()  
    start()
  })

  return true
}

module.exports = App


