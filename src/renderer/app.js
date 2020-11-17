
/// Some typedef imports for vscode intellisence :
/** @ignore @typedef {import("@renderer/services/log/ConsoleLogger")}                         ConsoleLogger           */
/** @ignore @typedef {import("@renderer/services/notification/NotificationService")}          NotificationService     */
/** @ignore @typedef {import("@renderer/services/kernel-selection/KernelSelectionService")}   KernelSelectionService  */
/** @ignore @typedef {import("@renderer/services/kernel-informer/KernelInformerService")}     KernelInformerService   */
/** @ignore @typedef {import("@renderer/services/launch-selection/LaunchSelectionService")}   LaunchSelectionService  */
/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelectionService")} ComputeSelectionService */
/** @ignore @typedef {import("@renderer/services/memory-vis/MemoryVisService")}               MemoryVisService        */
/** @ignore @typedef {import("@renderer/services/codewalk/CodewalkService")}                  CodewalkService         */
/** @ignore @typedef {import("@renderer/services/editor/EditorService")}                      EditorService           */
/** @ignore @typedef {import("@renderer/ui")} Ui */

const Session = require("@renderer/session").Session;

// const { allowUnknownOption } = require("commander");
/**
 * @exports App
 * @category Renderer
 * @subcategory main
 */
const App = {

  /** @type Session */ _session_ : undefined,

  /** @type {NotificationService}    */ Notifier : undefined,
  /** @type {ConsoleLogger}          */ Logger : undefined,
  /** @type {EditorService}          */ Editor : undefined,
  /** @type {InputService}           */ Input : undefined,
  /** @type {Session}                */ Session : undefined,
  /** @type {KernelSelectionService} */ KernelSelector : undefined,
  /** @type {KernelInformerService}  */ KernelInformer : undefined,
  /** @type {ComputeSelectionService}*/ ComputeSelector : undefined,
  /** @type {CodewalkService}        */ CodeWalker : undefined,

  /** @type Session */
  get Session() { return App.Sess; },
  set Session(s) { this._session_ = s;}
}

App.Electron = { remote: undefined, app: undefined }
App.Electron.remote = require('electron').remote
App.remote = App.Electron.remote;
App._ = require('underscore')
App.Emitter = new (require('events'))()
App.on = App.Emitter.on
App.emit = App.Emitter.emit
App.once = App.Emitter.once
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
  /** @type {ConsoleLogger}           */ Log: undefined,
  /** @type {NotificationService}     */ Notification: undefined,
  /** @type {KernelSelectionService}  */ KernelSelection: undefined,
  /** @type {LaunchSelectionService}  */ LaunchSelection: undefined,
  /** @type {ComputeSelectionService} */ ComputeSelection: undefined,
  /** @type {KernelInformerService}   */ KernelInformer: undefined,
  /** @type {InputService}            */ Input: undefined,
  /** @type {EditorService}           */ Editor: undefined,
  /** @type {CodewalkService}         */ Codenav: undefined,
  /** @type {MemoryVisService}        */ Vis: undefined,
  /** @type {Boolean}                 */ preUiReady: false,
  /** @type {Boolean}                 */ postUiReady: false,
  /** @type {Boolean} */
  get ready() {
    return App.Services.preUiReady && app.Services.postUiReady
  }
}

// App.Session = {
//   input: { source:"", compiledb: "", args: ""}
// }
App.Examples = App.remote.getGlobal("examples")

/// ------------------- ///
///       Methods       ///
/// ------------------- ///

/** @method */
App.enableLogging = () => { App.Services.Log.enable() }
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
App.main = function () {
  if (App.started) return false
  App.started = true

  const { Kernel, Stmt, Dim }   = require("@renderer/models");
  const ColorGenerator          = require("./util/ColorGenerator");
  const NotificationService     = require('./services/notification').NotificationService
  const KernelSelectionService  = require('./services/kernel-selection').KernelSelectionService
  const KernelInformerService   = require('./services/kernel-informer').KernelInformerService
  const ComputeSelectionService = require('./services/compute-selection').ComputeSelectionService
  const MemoryVisService = require('./services/memory-vis').MemoryVisService
  const CodewalkService  = require("./services/codewalk").CodewalkService
  const InputService     = require("./services/input").InputService;
  const EditorService = require('./services/editor/EditorService')
  const Kermad        = require('@renderer/client/KermadClient')
  const Events        = App.Events
  const TAG = "[app]"

  /// Initialize servises that don't require the UI
  function initPreUiServices() {
    if (!App.Services.preUiReady) {
      // App.Services.Log = new ConsoleLogger({ level: ConsoleLogger.Level.Debug, color: true, timestamps: true }).enable()
      App.Services.Log = require('./services/log').SimpleLogger
      App.Logger = App.Services.Log
      App.Services.preUiReady = true
    }
  }
  /// Initialize servises that require the UI
  function initPostUiServices() {
    if (App.Services.postUiReady) return

    App.Services.Editor          = new EditorService()
    App.Services.Notification    = new NotificationService().enable()
    App.Services.KernelSelection = new KernelSelectionService().enable()
    App.Services.KernelInformer   = new KernelInformerService()
    App.Services.ComputeSelection = new ComputeSelectionService().enable()
    App.Services.Vis              = new MemoryVisService().enable()
    App.Services.CodewalkService  = new CodewalkService().disable()
    App.Services.Input = new InputService().enable()
  
    App.Editor = App.Services.Editor;
    App.Notifier = App.Services.Notification
    App.Input = App.Services.Input
    App.KernelSelector = App.Services.KernelSelection
    App.KernelInformer = App.Services.KernelInformer
    App.ComputeSelector = App.Services.ComputeSelection
    App.Input = App.Services.InputService
    App.CodeWalker = App.Services.CodewalkService
    App.Services.postUiReady = true


    // App.Services.KernelSelection.onSelect (
    //   , //App.Notifier.info(kernel.toString(), {title: "Kernel Selection"}),
    // )

    // App.Services.LaunchSelection.defaultOnSelect(
    //   launch => App.Logger.debug(TAG, "User selected launch:", launch.toString(true))
    // )

    // App.Services.ComputeSelection
    //   .defaultOnUnitSelect(
    //     (unit, mode) => App.Logger.debug(TAG, "User selected", mode.equals(ComputeSelectionService.Mode.Warp) ? "warp:" : "thread:", unit.toString(true))
    //   )
    //   .defaultOnModeChange(
    //     (oldMode, newMode) => App.Logger.debug(TAG, "User changed comp. select mode:", oldMode.toString(), "->", newMode.toString())
    //   )
    //   .defaultOnBlockChange(
    //     (oldBlock, newBlock) => App.Logger.debug(TAG, "User selected block:", newBlock.getIndex().toString())
    //   )

    // App.Services.KernelSelection.createEmpty(true)
    // App.Services.LaunchSelection.createEmpty(true)

    App.on(Events.INPUT_SELECTED, (input) => {
      App.Logger.debug(TAG, "User selected file:", input.source)
      App.Services.KernelSelection.enable()
    })
  }

  initPreUiServices()
  App.ui.init()
  App.on(Events.UI_READY, () => {
    initPostUiServices()
  })

  const { SrcRange } = require("./models/source");

  App.on(Events.RELOAD, () => {
    if (App.Session) {
      Kermad.StopSession(false)
        .then((res) => App.reload())
        .catch((err) => App.reload())
    }
  })

  App.on(Events.INPUT_SELECTED, (input) => {
    // 1. open the file in the editor
    App.Editor
      .openSource(input.source, input.dir)
      .then(() => Kermad.StartSession(input.dir, input.source, input.compiledb))
      .then((res) => {
        App.Sess = new Session()
        let Col = new ColorGenerator(res['kernels'].length)
        res['kernels'].forEach(k => {
          let Kern = new Kernel(k.id, k.name, SrcRange.fromArray(k.range), Col.next())
            .setLaunch(new Dim(k['launch'].grid.x, k['launch'].grid.y, k['launch'].grid.z),
                       new Dim(k['launch'].block.x, k['launch'].block.y, k['launch'].block.z))
            .setStatistics(k.stats || {})
          k['stmts'].forEach(stmt => Kern.addStmt(new Stmt(stmt.id, stmt.type, SrcRange.fromArray(stmt.range))))
          App.Session.addKernel(Kern);
        });
        App.KernelSelector.addKernels(App.Session.getKernels())
        App.Editor.highlightKernels(App.Session.getKernels())
      })
      .catch(err => {
        App.Notifier.error("Failed to start Session");
        App.Logger.error(err);
        setTimeout(() => {
          App.Editor.reset();
          App.Services.Input.reset()
        }, 1000)
      })

    // 2. send to kermad for proprocessing

  })

  App.on(Events.INPUT_KERNEL_SELECTED, (kernel) => {
    console.log(kernel)
    // App.Logger.debug(TAG, "User selected kernel:", kernel.toString(true))

    App.Session.setKernel(kernel)
    // 1. editor jump to kernel
    App.Editor.jumptToKernel(kernel)
    App.KernelInformer.show(kernel)
    // 2. enable compute selection
    App.ComputeSelector.show(kernel)
  })


  App.on(Events.INPUT_COMPUTE_SELECTED, (block, warp, lane) => {
    App.Logger.info("Compute selection:", block.toString(), warp, lane)
    App.CodeWalker.enable()
  })

  // App.on(Event)

  App.on(Events.CODEWALK_START, () => {
    App.Logger.info("Codewalk start");
    App.Session.setBlock(App.ComputeSelector.getBlock())
    App.Session.setWarp(App.ComputeSelector.getWarp());
    App.Session.setLane(App.ComputeSelector.getLane());
  })

  App.on(Events.CODEWALK_STOP, () => {
    App.Logger.info("Codewalk stop")
  })
}

module.exports = App
