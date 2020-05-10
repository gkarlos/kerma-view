module.exports = (app) => {

  const EventEmitter     = require('events')
  const {InternalError}  = require('../../util/error')
  const UIEmitter = new EventEmitter()
  const ElectronLayout  = require('../components/layout').ElectronLayout
  
  const ui = {
    layout : null,
    numComponents : 2, 
    components : new Map(),
    window: window,
    split: {},
    editor : {
      instance: null,
      monaco: null,
      location: "editor",
      theme : "vs-dark"
    },
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
      instance : null,
      loaded: false,
      visible: false
    },
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

  // For now we let the ui register its layout itself
  // Just to be consistent with layout being a component
  // Until some other mechanism is implemented
  ui.layout = new ElectronLayout(ui)
  ui.registerComponent(ui.layout)
  ui.emit('component-ready', ui.layout)

  function uiComponentsRendered() {
    console.log("size", ui.components.size)
    return ui.components.size == 2
  }

  let uiComponentsReady = () => 
       ui.components.size == ui.numComponents
    && [...ui.components.values()].reduce((accu, component) => accu & component.ready, true)

  ui.on('component-ready', (component) => {
    if ( !ui.components.has(component))
      throw new InternalError(`Unregistered component '${component.name}' is ready`)
      
    ui.components.get(component).ready = true
    
    if ( uiComponentsReady())
      ui.emit('components-ready')
  })

  ui.on('components-ready', () => {
    console.groupCollapsed("[info] ui: ready")
    console.log(ui.components)
    console.groupEnd()
  })

  $(() => { 
    ui.layout.render() 
    require('../components/console-button')(app)
    require('../components/refresh-button')(app)
    require("../components/input-file-dialog")(app)
    require("../components/session-control-toolbar")(app)
    require('../components/info-button')(app)
    require("../components/editor")(app)
  })
  return ui;
}

