
/// Some typedef imports for vscode intellisence :
/** @ignore @typedef {import("@renderer/services/log/ConsoleLogger")}                       ConsoleLogger          */
/** @ignore @typedef {import("@renderer/services/notification/NotificationService")}        NotificationService    */
/** @ignore @typedef {import("@renderer/services/kernel-selection/KernelSelectionService")} KernelSelectionService */
/** @ignore @typedef {import("@renderer/ui")} Ui */

/** 
 * @exports App
 * @category main
 */
const App = {}

App.Electron = {
  remote : require('electron').remote,
  app    : require('electron').remote.app
}

App.Emitter    = new (require('events'))()
/** @method */
App.on         = App.Emitter.on
/** @method */
App.emit       = App.Emitter.emit
/** @method */
App.once       = App.Emitter.once
App.eventNames = App.Emitter.eventNames

App.Events = require('./events')
App.events = App.Events

App.ui = require('@renderer/ui')

App.Mock = require('@mock/cuda-source')

/**
 * @property {module:log.ConsoleLogger} Log
 * @property {module:notification.NotificationService} Notification
 * @property {module:kernel-selection.KernelSelectionService} KernelSelection
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


App.input = {
  path : undefined
}

/** @method */
App.enableLogging  = () => { App.Services.Log.enable() }
/** @method */
App.disableLogging = () => { App.Services.Log.disable() }

/** 
 * Entry point of the app
 * This is only meant to be called once. Subsequent calls are a no-op 
 * @method
 */
App.main = function() {
  if ( App.started) return false 
  
  App.started = true

  const NotificationService          = require('./services/notification').NotificationService
  const ConsoleLogger                = require('./services/log').ConsoleLogger
  const KernelSelectionService       = require('./services/kernel-selection').KernelSelectionService
  const LaunchSelectionService       = require('./services/launch-selection').LaunchSelectionService
  const ComputeUnitSelectionService  = require('./services/compute-selection').ComputeUnitSelectionService

  const Events = App.Events

  function initPreUiServices() {
    App.Services.Log = new ConsoleLogger({level: ConsoleLogger.Level.Trace, color: true, timestamps: true}).enable()
    App.Logger = App.Services.Log
  }

  function initPostUiServices() {
    App.Services.Notification         = new NotificationService().enable()
    App.Services.KernelSelection      = new KernelSelectionService().enable()
    App.Services.LaunchSelection      = new LaunchSelectionService().enable()
    App.Services.ComputeUnitSelection = new ComputeUnitSelectionService().enable()

    App.Notifier = App.Services.Notification
    // App.ComputeUnitSelector = App.Services.ComputeUnitSelection
  }

  function start() {
    App.Services.KernelSelection.defaultOnSelect(
      kernel => App.Notifier.info(kernel.toString(), {title: "Kernel Selection"})
    )

    App.Services.KernelSelection.createEmpty(true)
    App.Services.LaunchSelection.createEmpty(true)

    App.on( Events.INPUT_FILE_SELECTED, () => {
      App.Services.KernelSelection.activate(App.Services.KernelSelection.createMock().enable())
      // App.ui.editor
      //   .getCurrent().onSelect(() => console.log(typeof App.Services.KernelSelection.getCurrent().view.getSelection()))


      
      // setTimeout( () => App.Services.KernelSelection.getCurrent().dispose(true), 3000)
      // setTimeout( () => {
      //   App.Services.KernelSelection.activate(App.Services.KernelSelection.createNewMock2())
      //   setTimeout( () => {
      //     App.Services.KernelSelection.getCurrent().enable()
      //   }, 3000)
      // }, 5000)
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


