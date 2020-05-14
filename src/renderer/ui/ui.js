/**
 * This module is an aggregation of all ui elements
 */
module.exports = (app) => {
  require('popper.js')
  require('bootstrap')

  const EventEmitter     = require('events')
  const {InternalError}  = require('../../util/error')
  const UIEmitter = new EventEmitter()
  const ElectronLayout  = require('../layout/ElectronLayout')
  const Events          = require('../events')

  const ui = {
    layout : new ElectronLayout(app),
    components : new Map(),
    window: window,
    toolbar : {
      main: null,
      input: null,
      code: null,
      session: null
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
    info : { button: null},
    ready : false,
    on : UIEmitter.on,
    emit : UIEmitter.emit,
    once: UIEmitter.once,
    eventNames: UIEmitter.eventNames,
    removeAllListeners: UIEmitter.removeAllListeners,
    removeListener: UIEmitter.removeListener,
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

  ui.on('ui:component-ready', (component, ms=0) => {
    if ( !ui.components.has(component))
      throw new InternalError(`Unregistered component '${component.name}' is ready`)
    ui.components.get(component).ready = true
    // console.log(`[info] ui: ${component.name}: ready: ${ms}ms`)
    if ( uiComponentsReady())
      ui.emit(Events.UI_READY)
  })

  function logUiComponentRegistration() {
    console.groupCollapsed(`[info] ui: registered ${ui.components.size} components`)
    console.log(ui.console.button)
    console.log(ui.refresh.button)
    console.log(ui.toolbar.input)
    console.log(ui.toolbar.session)
    console.log(ui.info.button)
    console.log(ui.toolbar.main)
    console.log(ui.toolbar.code)
    console.log(ui.memory)
    console.groupEnd()
  }

  function logUiReady() {
    console.log(`[info] ui: ready: ${ui.perf.totalRenderTime}ms`)
    // console.groupEnd()
  }

  function createComponents() {
    const ConsoleButton  = require('../components/ConsoleButton')
    const RefreshButton  = require('../components/RefreshButton')
    const InputToolbar   = require('../components/InputToolbar')
    const SessionControlToolbar = require('../components/SessionControlToolbar')
    const Editor = require('../components/editor/Editor')
    const InfoButton = require('../components/InfoButton')
    const MainToolbar = require('../components/MainToolbar')
    const MemoryArea = require('../components/memory/MemoryArea')

    ui.console.button  = ui.registerComponent(new ConsoleButton("console-toggle-button", `#${ui.layout.header.left.id}`, app))
    ui.refresh.button  = ui.registerComponent(new RefreshButton("top-refresh-button", `#${ui.layout.header.left.id}`, app))
    ui.toolbar.input   = ui.registerComponent(new InputToolbar("file-select-group", `#${ui.layout.header.right.id}`, app))
    ui.toolbar.session = ui.registerComponent(new SessionControlToolbar("session-control-toolbar", `#${ui.layout.header.right.id}`, app))
    ui.editor          = ui.registerComponent(new Editor('editor', `#${ui.layout.body.left.top.id}`, app))
    ui.info.button     = ui.registerComponent(new InfoButton("info-button", `#${ui.layout.header.right.id}`, app))
    ui.toolbar.main    = ui.registerComponent(new MainToolbar("editor-toolbar", "#left-bottom", app))
    ui.toolbar.code    = ui.toolbar.main.codeNavToolbar
    ui.memory          = ui.registerComponent(new MemoryArea("memory-area", "#right", app))

    logUiComponentRegistration()
  }

  function renderComponents() {
    ui.console.button.render()
    ui.refresh.button.render()
    ui.toolbar.input.render()
    ui.toolbar.session.render()
    ui.editor.render()
    ui.info.button.render()
    ui.toolbar.main.render()
    ui.memory.render()
  }

  function useDefaultControls() {
    ui.console.button.useDefaultControls()
    ui.refresh.button.useDefaultControls()
    ui.toolbar.input.useDefaultControls()
    ui.toolbar.session.useDefaultControls()
    ui.editor.useDefaultControls()
    ui.info.button.useDefaultControls()
    ui.toolbar.main.useDefaultControls()
    ui.memory.useDefaultControls()
  }

  // Load all components once DOM is ready
  // It may be an optimization to load some
  // components before document.ready but
  // for now loading times are good enough
  $(() => { 
    let start = new Date().getTime()
    ui.layout.render()
    createComponents()
    renderComponents()
    ui.on(Events.UI_READY, () => {
      ui.perf.totalRenderTime = new Date().getTime() - start
      logUiReady()
      useDefaultControls()
    })
  })



  return ui;
}

