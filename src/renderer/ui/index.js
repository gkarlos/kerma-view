/** @ignore @typedef {import("@renderer/ui/containers/MainSelectionArea") MainSelectionArea} */
/** @ignore @typedef {import("@renderer/ui/toolbars/CodeNavToolbar") CodeNavToolbar} */
/** @ignore @typedef {import("@renderer/ui/editor/EditorToolbar")} EditorToolbar */
/** @ignore @typedef {import("@renderer/ui/layout/ElectronLayout")} ElectronLayout */
/** @ignore @typedef {import("@renderer/ui/component/Component")} Component */

/**
 * @category Renderer
 * @subcategory ui
 */
class Ui {
  static onReadyCallbacks = []
  static onDocumentReadyCallbacks = []
  static ready = false

  /** @type {ElectronLayout} */
  static layout = null
  
  static containers = {
    /**@type {MainSelectionArea} */
    mainSelection : null  
  }

  static components = new Map()
  
  static toolbar = {
    main: null,
    
    input: null,
    
    /** @type {EditorToolbar} */
    editor: null,

    /** @type {CodeNavToolbar} */
    codenav: null,
    session: null,
    util: null
  }

  static console = {}

  static refresh = {}

  static editor = {}

  static memory = {}

  static perf = {
    render : {}
  }

  static onReady(callback) { 
    if ( typeof callback === 'function') 
      Ui.onReadyCallbacks.push(callback) 
  }

  static onDocumentReady(callback) { 
    if (typeof callback === 'function') 
      Ui.onDocumentReadyCallbacks.push(callback)
  }

  static init() {
    if ( Ui.ready) return Ui;
  
    Ui.perf.render.components.start = new Date().getTime()
    
    const Popper         = require('popper.js')
    const Bootstrap      = require('bootstrap')
    const EventEmitter   = require('events')
    const ElectronLayout = require('@renderer/ui/layout').ElectronLayout
    const Events         = require('@renderer/events')
    const App            = require('@renderer/app')

    // console.log(App)
    
    Ui.layout = new ElectronLayout()
  
    App.on(Events.UI_COMPONENT_READY, (component,ms=0) => {
      if ( !Ui.components.has(component))
        throw new InternalError(`Unregistered component '${component.name}' is ready`)
      
      Ui.components.get(component).ready = true
      
      if ( uiComponentsReady()) {
        useDefaultControls()
        Ui.perf.render.components.stop = now()
        Ui.ready = true
        App.Logger.info(`ui ready after ${Ui.perf.render.components.totalTime + Ui.perf.render.layout.totalTime}ms`,
                        `[layout:${Ui.perf.render.layout.totalTime}, components:${Ui.perf.render.components.totalTime}]`)
        Ui.onReadyCallbacks.forEach(callback => callback())
        App.emit(Events.UI_READY)
      }
    })
  
    $(() => {
      Ui.onDocumentReadyCallbacks.forEach(callback => callback())
      Ui.perf.render.layout.start = now()
      Ui.layout.render()
      Ui.perf.render.layout.stop = now()
      createContainers()
      createComponents()
      renderComponents()
    })
  }

  /**
   * @param {Component} component
   * @returns {Component}
   */
  static registerComponent(component) {
    Ui.components.set(component, {ready: false})
    return component
  }
}


// const ui = new Ui()

Ui.perf.render.components = {
  start: 0, stop: 0,
  get totalTime() { return Ui.perf.render.components.stop - Ui.perf.render.components.start}
}

Ui.perf.render.layout = {
  start: 0, stop: 0,
  get totalTime() { return Ui.perf.render.layout.stop - Ui.perf.render.layout.start}
}


/// Selectors
Ui.selector = {}
Ui.selector.kernel = null
Ui.selector.launch = null


/** Register a component to the UI */
const registerComponent = (component) => Ui.registerComponent(component)

/**
 * Create all the UI containers
 */
function createContainers() {
  const MainSelection = require('@renderer/ui/containers/MainSelectionArea')
  Ui.containers.mainSelection = new MainSelection('main-toolbar', Ui.layout.body.left.bottom).render()
}

/**
 * Create all the UI components
 */
function createComponents(app) {
  const ConsoleButton         = require('@renderer/ui/console/ConsoleButton')
  const RefreshButton         = require('@renderer/ui/RefreshButton')
  /*====================================================================================*/


  const InputToolbar          = require('@renderer/ui/toolbars/input/InputToolbar')
  const UtilityToolbar        = require('@renderer/ui/toolbars/util/UtilityToolbar')
  const SessionControlToolbar = require('@renderer/ui/toolbars/SessionControlToolbar')
  /*====================================================================================*/
  const EditorToolbar         = require('@renderer/ui/editor/EditorToolbar')
  const Editor                = require('@renderer/ui/editor/Editor')
  /*====================================================================================*/
  const MemoryArea            = require('@renderer/ui/memory/MemoryArea')

  ///////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////  
  ///////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////

  Ui.console.button  = registerComponent(new ConsoleButton("console-toggle-button", `#${Ui.layout.header.left.id}`, app))
  Ui.refresh.button  = registerComponent(new RefreshButton("top-refresh-button", `#${Ui.layout.header.left.id}`, app))
  /*====================================================================================*/
  // ui.toolbar.main    = registerComponent(new MainToolbar("main-toolbar", "#left-bottom", app))

  Ui.toolbar.input   = registerComponent(new InputToolbar("file-select-group", `#${Ui.layout.header.right.id}`, app))
  Ui.toolbar.util    = registerComponent(new UtilityToolbar('utility-toolbar', `#${Ui.layout.header.right.id}`, app))
  Ui.toolbar.session = registerComponent(new SessionControlToolbar("session-control-toolbar", `#${Ui.layout.header.right.id}`, app))
  /*====================================================================================*/
  // Ui.toolbar.editor  = registerComponent(new EditorToolbar('editor-toolbar', `#${Ui.layout.body.left.top.id}`, app))
  Ui.toolbar.editor = new EditorToolbar('editor-toolbar', `#${Ui.layout.body.left.top.id}`)
  // Ui.toolbar.codenav = Ui.toolbar.editor.codenav
  Ui.editor          = registerComponent(new Editor('editor', `#${Ui.layout.body.left.top.id}`, app))
  /*====================================================================================*/
  Ui.memory          = registerComponent(new MemoryArea("memory-area", "#right", app))
}

function renderComponents() {
  Array.from(Ui.components.keys()).forEach(component => component.render())
}

function useDefaultControls() {
  Array.from(Ui.components.keys()).forEach(component => component.useDefaultControls())
}

function uiComponentsReady() {
  return [...Ui.components.values()].reduce((accu, component) => accu & component.ready, true)
}

function now() {
  return new Date().getTime()
}

/**
 * Entry point for UI initialization
 */


module.exports = Ui
// {
//   Ui : Ui,
//   init : Ui.init()
// }