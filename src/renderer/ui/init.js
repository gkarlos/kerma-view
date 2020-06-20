/**
 * @module init
 * @category ui
 */

/** 
 * The UI Object 
 * @class
 */
const ui = {}

ui.ready = false

/// Layout
ui.layout     = null
ui.components = new Map()

/// Toolbars
ui.toolbar = {}
ui.toolbar.main    = null
ui.toolbar.input   = null
ui.toolbar.code    = null
ui.toolbar.session = null
ui.toolbar.util    = null

/// Console
ui.console = {}

/// Refresh
ui.refresh = {}

/// Editor
ui.editor = null

/// Memory area
ui.memory = null

/// Selectors
ui.selector = {}
ui.selector.kernel = null
ui.selector.launch = null

/// Window
ui.window  = window

/// Perf
ui.perf     = {}
ui.perf.render = {
  start: null,
  stop: null,
  get totalTime() { return ui.perf.render.stop - ui.perf.render.start}
}

/// Callbacks
ui.onReadyCallbacks = []
ui.onReady = (callback) => { if ( typeof callback === 'function') ui.onReadyCallbacks.push(callback) }

ui.onDocumentReadyCallbacks = []
ui.onDocumentReady = (callback) => { if (typeof callback === 'function') ui.onDocumentReadyCallbacks.push(callback); }

/** Register a component to the UI */
function registerComponent(component) {
  ui.components.set(component, {ready: false})
  return component
}

/**
 * Create all the UI components
 */
function createComponents(app) {
  const ConsoleButton         = require('@renderer/ui/console/ConsoleButton')
  const RefreshButton         = require('@renderer/ui/RefreshButton')
  /*====================================================================================*/
  const MainToolbar           = require('@renderer/ui/toolbars/MainToolbar')
  const InputToolbar          = require('@renderer/ui/toolbars/input/InputToolbar')
  const UtilityToolbar        = require('@renderer/ui/toolbars/util/UtilityToolbar')
  const SessionControlToolbar = require('@renderer/ui/toolbars/SessionControlToolbar')
  /*====================================================================================*/
  const CodeNavToolbar        = require('@renderer/ui/toolbars/CodeNavToolbar')
  const EditorToolbar         = require('@renderer/ui/editor/EditorToolbar')
  const Editor                = require('@renderer/ui/editor/Editor')
  /*====================================================================================*/
  const MemoryArea            = require('@renderer/ui/memory/MemoryArea')

  ///////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////
  
  ui.console.button  = registerComponent(new ConsoleButton("console-toggle-button", `#${ui.layout.header.left.id}`, app))
  ui.refresh.button  = registerComponent(new RefreshButton("top-refresh-button", `#${ui.layout.header.left.id}`, app))
  /*====================================================================================*/
  ui.toolbar.main    = registerComponent(new MainToolbar("main-toolbar", "#left-bottom", app))
  ui.toolbar.input   = registerComponent(new InputToolbar("file-select-group", `#${ui.layout.header.right.id}`, app))
  ui.toolbar.util    = registerComponent(new UtilityToolbar('utility-toolbar', `#${ui.layout.header.right.id}`, app))
  ui.toolbar.session = registerComponent(new SessionControlToolbar("session-control-toolbar", `#${ui.layout.header.right.id}`, app))
  /*====================================================================================*/
  ui.toolbar.editor  = registerComponent(new EditorToolbar('editor-toolbar', `#${ui.layout.body.left.top.id}`, app))
  ui.toolbar.codenav = ui.toolbar.editor.codenav
  ui.editor          = registerComponent(new Editor('editor', `#${ui.layout.body.left.top.id}`, app))
  /*====================================================================================*/
  ui.memory          = registerComponent(new MemoryArea("memory-area", "#right", app))
}

function renderComponents() {
  Array.from(ui.components.keys()).forEach(component => component.render())
}

function useDefaultControls() {
  Array.from(ui.components.keys()).forEach(component => component.useDefaultControls())
}

function uiComponentsReady() {
  return [...ui.components.values()].reduce((accu, component) => accu & component.ready, true)
}

/**
 * 
 * @param {App} app 
 */
function registerListeners(app) {
  app.on(app.events.UI_COMPONENT_READY, (component, ms=0) => {
    if ( !ui.components.has(component))
      throw new InternalError(`Unregistered component '${component.name}' is ready`)
    ui.components.get(component).ready = true
    if ( uiComponentsReady())
      app.emit(app.events.UI_READY)
  })

  app.on(app.events.UI_READY, () => {
    ui.perf.render.stop = new Date().getTime()
    useDefaultControls()
    app.Logger.info(`ui: ready after ${ui.perf.render.totalTime}ms`)
  })
}
/**
 * Entry point for UI initialization
 * 
 * @param {App} app 
 */
function init(app) {
  if ( ui.ready) 
    return ui;

  ui.perf.render.start = new Date().getTime()
  
  const Popper         = require('popper.js')
  const Bootstrap      = require('bootstrap')
  const EventEmitter   = require('events')
  const ElectronLayout = require('@renderer/ui/layout').ElectronLayout
  const Events         = require('@renderer/events')
  const App = require('@renderer/app')

  ui.layout     = new ElectronLayout(App)

  registerListeners(App)

  $(() => {
    ui.onDocumentReadyCallbacks.forEach(callback => callback())
    ui.layout.render()
    createComponents(App)
    renderComponents()
  })

  return ui;
}

module.exports = init