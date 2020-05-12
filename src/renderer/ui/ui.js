/**
 * This module is an aggregation of all ui elements
 */
module.exports = (app) => {

  const EventEmitter     = require('events')
  const {InternalError}  = require('../../util/error')
  const UIEmitter = new EventEmitter()
  const ElectronLayout  = require('../components/layout').ElectronLayout
  const Events          = require('../events')

  const ui = {
    layout : new ElectronLayout(app),
    numComponents : 8, 
    components : new Map(),
    window: window,
    split: {},
    toolbar : {
      main: null,
      session: null
    },
    editor : null,
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
    ready : false,
    on : UIEmitter.on,
    emit : UIEmitter.emit,
    reload : () => {
      console.log("RELOAD")
      app.windows.main.webContents.reload()
    }
  }

  ui.registerComponent = (component) => {
    ui.components.set(component, {ready: false})
    console.groupCollapsed(`[info] ui: registered: '${component.name}'`)
    console.log(component)
    console.groupEnd()
    return component
  }

  let uiComponentsReady = () => (ui.components.size === ui.numComponents)
    && [...ui.components.values()].reduce((accu, component) => accu & component.ready, true)

  ui.on('ui:component-ready', (component) => {
    if ( !ui.components.has(component))
      throw new InternalError(`Unregistered component '${component.name}' is ready`)
    
    ui.components.get(component).ready = true
    
    if ( uiComponentsReady())
      ui.emit('ui:components-ready')
  })

  ui.on('ui:components-ready', () => {
    console.groupCollapsed("[info] ui: ready")
    console.log(ui.components)
    console.groupEnd()
    ui.ready = true
    ui.emit(Events.UI_READY)
  })

  // Load all components once DOM is ready
  // It may be an optimization to load some
  // components before document.ready but
  // for now loading times are good enough
  $(() => { 
    ui.layout.render()

    require('../components/ConsoleButton').defaultCreate(app)
    require('../components/RefreshButton').defaultCreate(app)
    require("../components/InputFileDialog").defaultCreate(app)
    require("../components/SessionControlToolbar").defaultCreate(app)
    require('../components/InfoButton').defaultCreate(app)
    require("../components/editor").defaultCreate(app)
    require("../components/MainToolbar").defaultCreate(app)
    // require("../components/selectors/launch-selector")(app)
  })
  return ui;
}

