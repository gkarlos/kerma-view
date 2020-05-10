/**
 * @module renderer/components/editor
 */
const fs        = require('../../../util/fs')
const DUMMYDATA = require('../../../dummy-data')
const Component = require('../component')
const Events    = require('../../events')
const {InternalError} = require('../../../util/error')


const EditorTabs = require('./editor-tabs')

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
    this.tabs = new EditorTabs("editor-tabs", this.container, app)
  }

  selectTab(title) {
    this.tabs.select(title)
  }

  render(app) {
    if ( this.rendered )
      return console.log(`[warn] multiple render() calls for ${this.name}. This is a no-op`)
    
    this.tabs.addNew("Cuda")
             .addNew("LLVM-IR")
             .addNew("PTX")
             .select("Cuda")
             .render()
  

    let AMDLoader  = require('monaco-editor/min/vs/loader')
    let AMDRequire = AMDLoader.require;
    let AMDDefine  = AMDRequire.define;
    AMDRequire.config({
      baseUrl: fs.uriFromPath(__dirname),
      paths : { 
        'vs' : '../../../../node_modules/monaco-editor/min/vs'
      }
    });


    /*
     * Asynchronously load the editor and emit a completion("editor-loaded") event
     */
    AMDRequire(['vs/editor/editor.main'], (monaco) => {
      this.node = $(`<div id="${this.id}" class="w-100"></div>`).appendTo(this.container)
      this.monaco = monaco
      this.instance = monaco.editor.create(document.getElementById(this.id), {
        language : 'cpp',
        glyphMargin: true,
        automaticLayout: true,
        contextmenu: true
      });
      this.app.ui.editor.instance = this.instance
      this.app.ui.emit(Events.EDITOR_LOADED, monaco)
      this.tabs.select('PTX')
    });

    return this;
  }
}

module.exports = (app) => {
  const ui     = app.ui
  const editor = new Editor('editor', '#left-top', app).render()


  /*
   * Monaco finished loading
   */
  ui.on(Events.EDITOR_LOADED, (monaco) => {
    ui.editor.monaco = monaco
    ui.emit(Events.UI_COMPONENT_READY, editor)
  })

  ui.on(Events.INPUT_SELECTED, path => {
    console.log("[info] Loading input to the editor")
    app.input.path = path
    fs.readFile(path, 'utf-8', (err, data) => {
      app.input.content = data
      editor.instance.setValue(data);
      setTimeout(() => ui.emit('editor:input-loaded'), 500)
    })
  })

  ui.on(Events.UI_RESIZE, () => ui.editor.instance && app.ui.editor.instance.layout())

  // Monaco finished loading the input file
  ui.on(Events.EDITOR_INPUT_LOADED, () => {
    if ( DUMMYDATA.kernels.length == 0)
      return;
    
    // let editor = editor.instance;
    // let monaco = editor.monaco;
    let decorations = []

    DUMMYDATA.kernels.forEach(kernel => {
      decorations.push({
        range: new monaco.Range(...(kernel.source.range)),
        options: {
          isWholeLine : true, 
          linesDecorationsClassName: 'editor-kernel-line-decoration',
          className : 'editor-kernel-line-highlight'
        }
      })
    })

    editor.instance.deltaDecorations([], decorations)
  })

  /**
   * Force resize monaco with window resize
   */
  window.addEventListener('resize', () => {
    if ( editor.instance)
      editor.instance.layout()
  })

  window.$(`#${app.ui.editor.location}`).on('click', () => {
    console.log('resize')
    if ( ui.editor.instance)
      ui.editor.instance.layout()
  })
}