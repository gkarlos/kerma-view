
/// Some typedef imports for vscode intellisence :
/** @ignore @typedef {import("@renderer/services/log/ConsoleLogger")}                         ConsoleLogger           */
/** @ignore @typedef {import("@renderer/services/notification/NotificationService")}          NotificationService     */
/** @ignore @typedef {import("@renderer/services/kernel-selection/KernelSelectionService")}   KernelSelectionService  */
/** @ignore @typedef {import("@renderer/services/launch-selection/LaunchSelectionService")}   LaunchSelectionService  */
/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelectionService")} ComputeSelectionService */
/** @ignore @typedef {import("@renderer/services/memory-vis/MemoryVisService")}               MemoryVisService        */
/** @ignore @typedef {import("@renderer/services/codenav/CodenavService")}                    CodenavService          */
/** @ignore @typedef {import("@renderer/services/editor/EditorService")}                      EditorService           */
/** @ignore @typedef {import("@renderer/ui")} Ui */

const ColorGenerator = require("./util/ColorGenerator");

const Session = require("@renderer/session").Session;

// const { allowUnknownOption } = require("commander");
/**
 * @exports App
 * @category Renderer
 * @subcategory main
 */
const App = {}
App.Electron = { remote : undefined, app : undefined}
App.Electron.remote = require('electron').remote
App.remote = App.Electron.remote;
App._               = require('underscore')
App.Emitter    = new (require('events'))()
App.on         = App.Emitter.on
App.emit       = App.Emitter.emit
App.once       = App.Emitter.once
App.eventNames = App.Emitter.eventNames
App.Events = require('./events')
App.events = App.Events
App.ui = require('@renderer/ui')
App.Mock = require('@mock/cuda-source')
App.Kermad = undefined
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
  /** @type {EditorService}           */ Editor : undefined,
  /** @type {CodenavService}          */ Codenav : undefined,
  /** @type {MemoryVisService}        */ Vis : undefined,
  /** @type {Boolean}                 */ preUiReady : false,
  /** @type {Boolean}                 */ postUiReady : false,
  /** @type {Boolean} */
  get ready() {
    return App.Services.preUiReady && app.Services.postUiReady
  }
}
/** @type {NotificationService}    */ App.Notifier
/** @type {ConsoleLogger}          */ App.Logger
/** @type {EditorService}          */ App.Editor
/** @type {Session}                */ App.Session
/** @type {KernelSelectionService} */ App.KernelSelector
// App.Session = {
//   input: { source:"", compiledb: "", args: ""}
// }
App.Examples = App.remote.getGlobal("examples")

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
  // const LaunchSelectionService    = require('./services/launch-selection').LaunchSelectionService
  const ComputeSelectionService   = require('./services/compute-selection').ComputeSelectionService
  const MemoryVisService          = require('./services/memory-vis').MemoryVisService
  const CodenavService            = require("./services/codenav/CodenavService")
  const InputService              = require("./services/input").InputService;
  const EditorService             = require('./services/editor/EditorService')
  const Kermad = require('@renderer/client/KermadClient')
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

    App.Services.Editor           = new EditorService()
    App.Services.Notification     = new NotificationService().enable()
    App.Services.KernelSelection  = new KernelSelectionService().enable()
    // App.Services.LaunchSelection  = new LaunchSelectionService().enable()
    App.Services.ComputeSelection = new ComputeSelectionService().enable()
    App.Services.Vis              = new MemoryVisService().enable()
    App.Services.CodenavService   = new CodenavService().enable()
    App.Services.Input            = new InputService().enable()
    App.Editor = App.Services.Editor;
    App.Notifier = App.Services.Notification
    App.KernelSelector = App.Services.KernelSelection
    App.Input = App.Services.InputService
    App.Services.postUiReady = true
    // App.Services.KernelSelection.onSelect (
    //   , //App.Notifier.info(kernel.toString(), {title: "Kernel Selection"}),
    // )

    // App.Services.LaunchSelection.defaultOnSelect(
    //   launch => App.Logger.debug(TAG, "User selected launch:", launch.toString(true))
    // )

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

    // App.Services.KernelSelection.createEmpty(true)
    // App.Services.LaunchSelection.createEmpty(true)

    App.on( Events.INPUT_SELECTED, (input) => {
      App.Logger.debug(TAG, "User selected file:", input.source)
      App.Services.KernelSelection.enable()
    })
  }

  initPreUiServices()
  App.ui.init()
  App.on(Events.UI_READY, () => {
    initPostUiServices()
  })


  const { CuKernel } = require("./models/cuda");
  const { SrcRange } = require("./models/source");

  App.on(Events.INPUT_SELECTED, (input) => {
    // 1. open the file in the editor
    App.Editor
      .openSource(input.source, input.dir)
      .catch(err => {
        App.Notifier.error(err)
        App.Services.Input.reset()
      })
      // 2. send to kermad for proprocessing
      .then(() => Kermad.StartSession(input.dir, input.source, input.compiledb))
      .then((res) => {
        App.Session = new Session()
        let Col = new ColorGenerator(res['kernels'].length)
        for ( let kern of res['kernels'])
          App.Session.addKernel(new CuKernel(kern.id, kern.name,
                                             SrcRange.fromArray(kern.range), Col.next()))
        App.KernelSelector.addKernels(App.Session.getKernels())
        App.Editor.highlightKernels(App.Session.getKernels())
      })
  })

  App.on(Events.INPUT_KERNEL_SELECTED, (kernel) => {
    App.Logger.debug(TAG, "User selected kernel:", kernel.toString(true))

    App.Session.setKernel(kernel)
    // 1. editor jump to kernel
  })
}

module.exports = App


