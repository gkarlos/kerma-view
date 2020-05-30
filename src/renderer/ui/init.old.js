/**
 * @module ui/init
 * @category ui
 */

//  const App = require("@renderer/app")
 
/**
 * Initialize the ui
 * 
 * If the app has an initialized ui, then this is a no-op <br/>
 * 
 * @function
 * @param {App} app Reference to the application
 */
module.exports = (app) => {
  if ( app.ui && app.ui.initialized)
    return app.ui

  require('popper.js')
  require('bootstrap')

  let Log = app.Logger;
  let Notify = app.Notifier

  const EventEmitter     = require('events')
  const {InternalError}  = require('util/error')
  const UIEmitter = new EventEmitter()
  const ElectronLayout  = require('./layout/ElectronLayout')
  const Events          = require('../events')

  const ui = {
    layout : new ElectronLayout(app),
    components : new Map(),
    window: window,
    toolbar : {
      main: null,
      input: null,
      code: null,
      session: null,
      util : null,
    },
    editor : null,
    memory : null,
    selector : {
      kernel : {
        instance : null,
        selectize : null,
        location : "select-repo"
      },
      launch : {
        instance : null,
        selectize : null,
        location : "launch-selection"
      }
    },
    console : {
      button: null,
      instance : null,
      loaded: false,
      visible: false
    },
    perf : {
      totalRenderTime: 0,
    },
    refresh : { button: null },
    // info : { button: null},
    ready : false,
    reload : () => {
      console.log("RELOAD")
      app.windows.main.webContents.reload()
    }
  }

  ui.registerComponent = (component) => {
    ui.components.set(component, {ready: false})
    return component
  }

  let uiComponentsReady = () => [...ui.components.values()].reduce((accu, component) => accu & component.ready, true)

  app.on('ui:component-ready', (component, ms=0) => {
    if ( !ui.components.has(component))
      throw new InternalError(`Unregistered component '${component.name}' is ready`)
    ui.components.get(component).ready = true
    // console.log(`[info] ui: ${component.name}: ready: ${ms}ms`)
    if ( uiComponentsReady())
      app.emit(Events.UI_READY)
  })

  function logUiComponentRegistration() {
    Log.info(`ui: registered ${ui.components.size} components`, {components : {...Array.from(ui.components.keys())}})
  }

  function logUiReady() {
    Log.info(`ui: ready after ${ui.perf.totalRenderTime}ms`)
    // console.groupEnd()
  }

  function createComponents() {
    const ConsoleButton  = require('../ui/console/ConsoleButton')
    const RefreshButton  = require('./RefreshButton')
    const InputToolbar   = require('./toolbars/input/InputToolbar')
    const SessionControlToolbar = require('./toolbars/SessionControlToolbar')
    
    const EditorToolbar = require('./editor/EditorToolbar')
    const Editor = require('./editor/Editor')
    // const InfoButton = require('../components/toolbars/util/InfoButton')
    const MainToolbar = require('./toolbars/MainToolbar')
    const UtilityToolbar = require('renderer/ui/toolbars/util/UtilityToolbar')
    const MemoryArea = require('renderer/ui/memory/MemoryArea')



    const CodeNavToolbar = require('renderer/ui/toolbars/CodeNavToolbar')

    ui.console.button  = ui.registerComponent(new ConsoleButton("console-toggle-button", `#${ui.layout.header.left.id}`, app))
    ui.refresh.button  = ui.registerComponent(new RefreshButton("top-refresh-button", `#${ui.layout.header.left.id}`, app))
    
    ui.toolbar.input   = ui.registerComponent(new InputToolbar("file-select-group", `#${ui.layout.header.right.id}`, app))
    ui.toolbar.session = ui.registerComponent(new SessionControlToolbar("session-control-toolbar", `#${ui.layout.header.right.id}`, app))

    ui.toolbar.editor  = ui.registerComponent(new EditorToolbar('editor-toolbar', `#${ui.layout.body.left.top.id}`, app))
    ui.toolbar.codenav = ui.toolbar.editor.codenav
    ui.editor          = ui.registerComponent(new Editor('editor', `#${ui.layout.body.left.top.id}`, app))

    ui.toolbar.util    = ui.registerComponent(new UtilityToolbar('utility-toolbar', `#${ui.layout.header.right.id}`, app))
    ui.toolbar.main    = ui.registerComponent(new MainToolbar("main-toolbar", "#left-bottom", app))
    ui.memory          = ui.registerComponent(new MemoryArea("memory-area", "#right", app))

    logUiComponentRegistration()
  }

  function renderComponents() {
    // ui.initNotification.updateDetails('rendering ui components...')

    ui.console.button.render()
    ui.refresh.button.render()
    ui.toolbar.input.render()
    ui.toolbar.session.render()
    ui.toolbar.editor.render()
    ui.editor.render()
    ui.toolbar.util.render()
    ui.toolbar.main.render()
    ui.memory.render()

    // ui.initNotification.updateProgress(50)
    
  }

  function useDefaultControls() {

    // ui.initNotification.updateDetails('registering ui controllers...')

    ui.console.button.useDefaultControls()
    ui.refresh.button.useDefaultControls()
    ui.toolbar.input.useDefaultControls()
    ui.toolbar.session.useDefaultControls()
    ui.toolbar.editor.useDefaultControls()
    ui.editor.useDefaultControls()
    ui.toolbar.main.useDefaultControls()
    ui.toolbar.util.useDefaultControls()
    ui.memory.useDefaultControls()

    // ui.initNotification.updateProgress(50)
  }

  // Load all components once DOM is ready
  // It may be an optimization to load some
  // components before document.ready but
  // for now loading times are good enough
  $(() => { 
    let start = new Date().getTime()

    ui.layout.render()
    createComponents()
    
    // ui.initNotification = app.notifier.info("Initializing:", null, true)
    const NotificationService = require('renderer/services/notification/NotificationService')

    renderComponents()

    app.on(Events.UI_READY, () => {
      ui.perf.totalRenderTime = new Date().getTime() - start
      logUiReady()
      useDefaultControls()
    })
  })


  ui.initialized = true;
  return ui;
}

