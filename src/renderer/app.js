
/// Some typedef imports for vscode intellisence :
/** @ignore @typedef {import("@renderer/services/log/ConsoleLogger")}                         ConsoleLogger           */
/** @ignore @typedef {import("@renderer/services/notification/NotificationService")}          NotificationService     */
/** @ignore @typedef {import("@renderer/services/kernel-selection/KernelSelectionService")}   KernelSelectionService  */
/** @ignore @typedef {import("@renderer/services/launch-selection/LaunchSelectionService")}   LaunchSelectionService  */
/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelectionService")} ComputeSelectionService */
/** @ignore @typedef {import("@renderer/services/memory-vis/MemoryVisService")}               MemoryVisService        */
/** @ignore @typedef {import("@renderer/services/codenav/CodenavService")}                    CodenavService          */
/** @ignore @typedef {import("@renderer/ui")} Ui */

const { allowUnknownOption } = require("commander")

// const { app } = require("electron")

/**
 * @exports App
 * @category Renderer
 * @subcategory main
 */
const App = {}

/// ------------------- ///
///     Properties      ///
/// ------------------- ///
App.Electron = { remote : undefined, app : undefined}
App.Electron.remote = require('electron').remote
App._               = require('underscore')

App.Emitter    = new (require('events'))()
/** @method */ App.on         = App.Emitter.on
/** @method */ App.emit       = App.Emitter.emit
/** @method */ App.once       = App.Emitter.once
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
  /** @type {ConsoleLogger}           */ Log : undefined,
  /** @type {NotificationService}     */ Notification : undefined,
  /** @type {KernelSelectionService}  */ KernelSelection : undefined,
  /** @type {LaunchSelectionService}  */ LaunchSelection : undefined,
  /** @type {ComputeSelectionService} */ ComputeSelection : undefined,
  /** @type {CodenavService}          */ Codenav : undefined,
  /** @type {MemoryVisService}        */ Vis : undefined,
  /** @type {Boolean}                 */ preUiReady : false,
  /** @type {Boolean}                 */ postUiReady : false,
  /** @type {Boolean} */
  get ready() {
    return App.Services.preUiReady && app.Services.postUiReady
  }
}
/** @type {NotificationService} */ App.Notifier
/** @type {ConsoleLogger}       */ App.Logger

App.Examples = {
  "Rodinia" : {
    "b+tree":   { path: "examples/rodinia/cuda/b+tree/b+tree.cu", args: "file mil.txt command command.txt"},
    "backprop": { path: "examples/rodinia/cuda/b+tree/backprop.cu", args: "1000000" },
    "bfs":      { path: "examples/rodinia/cuda/b+tree/bfs.cu", args: "todo"},
    "cfd":      { path: "examples/rodinia/cuda/b+tree/cfd.cu", args: "todo"},
    "gaussian": { path: "examples/rodinia/cuda/b+tree/gaussian.cu", args: "todo"},
    "hotspot":  { path: "examples/rodinia/cuda/b+tree/hotspot.cu", args: "todo"},
    "lavaMD":   { path: "examples/rodinia/cuda/b+tree/lavaMD.cu", args: "todo"},
    "lud":      { path: "examples/rodinia/cuda/b+tree/lud.cu", args: "todo"},
    "nn":       { path: "examples/rodinia/cuda/b+tree/nn.cu", args: "todo"},
    "nw":       { path: "examples/rodinia/cuda/b+tree/nw.cu", args: "todo"},
    "particlefilter": { path: "examples/rodinia/cuda/b+tree/particlefilter.cu", args: "todo"},
    "particlefilter.float": { path: "examples/rodinia/cuda/b+tree/particlefilter.float.cu", args: "todo"},
    "pathfinder":     { path: "examples/rodinia/cuda/b+tree/pathfinder.cu", args: "todo"},
    "srad" :          { path: "examples/rodinia/cuda/b+tree/srad.cu", args: "todo"},
    "streamcluster":  { path: "examples/rodinia/cuda/b+tree/streamcluster.cu", args: "todo"}
  },

  // "Polybench" : {
  //   "2dconv":   { args: ""},
  //   "2mm":      { args: ""},
  //   "3dconv":   { args: ""},
  //   "3mm":      { args: ""},
  //   "atax":     { args: ""},
  //   "bicg":     { args: ""},
  //   "corr":     { args: ""},
  //   "covar":    { args: ""},
  //   "fdtd-2d":  { args: ""},
  //   "gemm":     { args: ""},
  //   "gesummv":  { args: ""},
  //   "gramschm": { args: ""},
  //   "mvt":      { args: ""},
  //   "syr2k":    { args: ""},
  //   "syrk":     { args: ""}
  // }
}

App.Input = { path:"", args: ""};

/// ------------------- ///
///      Shortcuts      ///
/// ------------------- ///



/// ------------------- ///
///       Methods       ///
/// ------------------- ///

/** @method */
App.enableLogging  = () => { App.Services.Log.enable() }
/** @method */
App.disableLogging = () => { App.Services.Log.disable() }

App.reload = () => {
  App.Electron.remote.getCurrentWindow().reload();
}

/// ------------------- ///
///         Main        ///
/// ------------------- ///

/**
 * Entry point of the app
 * This is only meant to be called once. Subsequent calls are a no-op
 * @method
 */
App.main = function() {
  if ( App.started) return false
  App.started = true

  const NotificationService       = require('./services/notification').NotificationService
  const ConsoleLogger             = require('./services/log').ConsoleLogger
  const KernelSelectionService    = require('./services/kernel-selection').KernelSelectionService
  const LaunchSelectionService    = require('./services/launch-selection').LaunchSelectionService
  const ComputeSelectionService   = require('./services/compute-selection').ComputeSelectionService
  const MemoryVisService          = require('./services/memory-vis').MemoryVisService
  const CodenavService            = require("./services/codenav/CodenavService")
  const InputService              = require("./services/input").InputService;

  const Events = App.Events
  const TAG = "[app]"

  /// Initialize servises that don't require the UI
  function initPreUiServices() {
    if ( !App.Services.preUiReady) {
      App.Services.Log = new ConsoleLogger({level: ConsoleLogger.Level.Debug, color: true, timestamps: true}).enable()
      App.Logger = App.Services.Log
      App.Services.preUiReady = true
    }
  }

  /// Initialize servises that require the UI
  function initPostUiServices() {
    if ( App.Services.postUiReady) return

    App.Services.Notification     = new NotificationService().enable()
    App.Services.KernelSelection  = new KernelSelectionService().enable()
    App.Services.LaunchSelection  = new LaunchSelectionService().enable()
    App.Services.ComputeSelection = new ComputeSelectionService().enable()
    App.Services.Vis              = new MemoryVisService().enable()
    App.Services.CodenavService   = new CodenavService().enable()
    App.Services.InputService     = new InputService().enable()
    App.Notifier = App.Services.Notification
    // App.ComputeUnitSelector = App.Services.ComputeUnitSelectione

    App.Services.postUiReady = true
  }

  function start() {
    // Register some default callbacks for the kernel selection
    App.Services.KernelSelection.defaultOnSelect (
      kernel => App.Logger.debug(TAG, "User selected kernel:", kernel.toString(true)), //App.Notifier.info(kernel.toString(), {title: "Kernel Selection"}),
    )

    App.Services.LaunchSelection.defaultOnSelect(
      launch => App.Logger.debug(TAG, "User selected launch:", launch.toString(true))
    )

    App.Services.ComputeSelection
      .defaultOnUnitSelect(
        (unit, mode) => App.Logger.debug(TAG, "User selected", mode.equals(ComputeSelectionService.Mode.Warp)? "warp:" : "thread:", unit.toString(true))
      )
      .defaultOnModeChange(
        (oldMode, newMode) => App.Logger.debug(TAG, "User changed comp. select mode:", oldMode.toString(), "->", newMode.toString())
      )
      .defaultOnBlockChange(
        (oldBlock, newBlock) => App.Logger.debug(TAG, "User selected block:", newBlock.getIndex().toString())
      )

    App.Services.KernelSelection.createEmpty(true)
    App.Services.LaunchSelection.createEmpty(true)

    App.on( Events.INPUT_FILE_SELECTED, (filename) => {
      App.Logger.debug(TAG, "User selected file:", filename)
      App.Services.KernelSelection.activate(App.Services.KernelSelection.createMock().enable())
    })

    App.on( Events.INPUT_KERNEL_SELECTED, (kernel) => {
      App.Services.LaunchSelection.activate(App.Services.LaunchSelection.createForKernel(kernel).enable())
      App.Services.ComputeSelection.deactivateCurrent()
    })

    App.on( Events.INPUT_KERNEL_LAUNCH_SELECTED, (launch) => {
      App.Services.ComputeSelection.activate(App.Services.ComputeSelection.getForLaunch(launch), true)
    })
  }

  /**
   * 
   */
  initPreUiServices()
  App.ui.init()
  App.on(Events.UI_READY, () => {
    initPostUiServices()  
    start()
  })

  return true
}

module.exports = App


