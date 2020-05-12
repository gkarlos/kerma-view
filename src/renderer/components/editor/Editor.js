/**
 * @module renderer/components/editor
 */
const fs        = require('../../../util/fs')
const mock = require('../../../mock/cuda-source')
const Component = require('../component')
const Events    = require('../../events')
const {InternalError} = require('../../../util/error')
const path = require('path')


const EditorTabs = require('./EditorTabs')

/**
 * @class
 */
class Editor extends Component {

  /** */
  constructor( id, container, app) {
    super()
    this.id = id
    this.name = `Editor[${this.id}]`
    this.container = container  
    this.monaco = null
    this.instance = null
    this.app = app
    this.app.ui.editor = this
    this.tabs = new EditorTabs("editor-tabs", this.container, app)
    this.AMDLoader  = require('../../../../node_modules/monaco-editor/min/vs/loader.js');
    this.AMDRequire = this.AMDLoader.require;
    this.AMDDefine  = this.AMDLoader.require.define;
    this.AMDRequire.config({
      baseUrl: fs.uriFromPath(path.join(__dirname, '../../../../node_modules/monaco-editor/min'))
      // paths : { 
      //   'vs' : ''
      // }
    });
  }

  selectTab(title) { this.tabs.select(title) }

  setValue(s) { 
    this.instance.setValue(s) 
    this.app.ui.emit(Events.EDITOR_VALUE_CHANGED)
  }

  render() {
    if ( this.rendered ) {
      console.log(`[warn] multiple render() calls for ${this.name}. This is a no-op`)
      return this;
    }

    // register myself to the ui
    this.app.ui.registerComponent(this)

    this.tabs.addNew("Cuda")
             .addNew("LLVM-IR")
             .addNew("PTX")
             .select("Cuda")
             .render()

    // Asynchronously load the editor and emit a completion("editor-loaded") event
    this.AMDRequire(['vs/editor/editor.main'], (monaco) => {
      this.node = $(`<div id="${this.id}" class="w-100"></div>`).appendTo(this.container)
      this.monaco = monaco
      this.instance = monaco.editor.create(document.getElementById(this.id), {
        language : 'cpp',
        glyphMargin: true,
        automaticLayout: true,
        contextmenu: true
      });
      
      this.app.ui.emit(Events.EDITOR_LOADED, monaco)
      this.tabs.select('Cuda')
    });

    return this;
  }
}

function defaultCreate(app) {
  const ui     = app.ui
  const editor = new Editor('editor', '#left-top', app).render()

  let on = (event, cb) => ui.on(event, cb)

  // Monaco finished loading
  on(Events.EDITOR_LOADED, monaco => {
    ui.editor.monaco = monaco
    ui.emit(Events.UI_COMPONENT_READY, editor)
  })

  // User selected a file so load it to the editor
  on(Events.INPUT_FILE_SELECTED, path => {
    console.log("[info] Loading input to the editor")
    app.input.path = path
    fs.readFile(path, 'utf-8', (err, data) => {
      app.input.content = data
      editor.setValue(data);
      // TODO this delay is not really needed
      setTimeout(() => ui.emit(Events.EDITOR_INPUT_LOADED), 500)
    })
  })

  on(Events.UI_RESIZE, () => ui.editor.instance && app.ui.editor.instance.layout())

  // Monaco finished loading the input file
  on(Events.EDITOR_INPUT_LOADED, () => { 
    if ( mock.kernels.length == 0)
      return;
  
    let decorations = []

    mock.kernels.forEach(kernel => {
      decorations.push({
        range: new editor.monaco.Range(...(kernel.source.range)),
        options: {
          isWholeLine : true, 
          linesDecorationsClassName: 'editor-kernel-line-decoration',
          className : 'editor-kernel-line-highlight'
        }
      })
    })

    editor.instance.deltaDecorations([], decorations)
  })

  // Force resize monaco with window resize
  window.addEventListener('resize', () => {
    if ( editor.instance)
      editor.instance.layout()
  })

  window.$(`#${editor.id}`).on('click', () => {
    console.log('resize')
    if ( ui.editor.instance)
      ui.editor.instance.layout()
  })
}

module.exports = {
  Editor,
  defaultCreate
}