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
    this.app.emit(Events.EDITOR_VALUE_CHANGED)
  }

  markLineRead(lineno) {

  }

  markLineWrite(lineno) {

  }

  showKernelLaunchSelection() {
    
  }

  hideKernelLaunchSelection() {
    
  }

  updateLayout() {
    this.instance.layout()
  }

  render() {
    if ( this.rendered ) {
      console.log(`[warn] multiple render() calls for ${this.name}. This is a no-op`)
      return this;
    }

    // register myself to the ui
    // this.app.ui.registerComponent(this)

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
        contextmenu: true
      });

      this.app.emit(Events.EDITOR_LOADED, monaco)
      this.tabs.select('Cuda')
    });

    let on = (event, cb) => this.app.on(event, cb)

    on(Events.UI_RESIZE, () => this.updateLayout())
    window.onresize = () => this.updateLayout()

    on(Events.EDITOR_LOADED, () => this.app.emit(Events.UI_COMPONENT_READY, this))
    this.rendered = true;
    return this;
  }

  useDefaultControls() {
    if ( !this.rendered)
      throw new InternalError('Component must be rendered before calling defaultControls()')

    let on = (event, cb) => this.app.on(event, cb)
    
    // User selected a file so load it to the editor
    on(Events.INPUT_FILE_SELECTED, path => {
      this.app.input.path = path
      fs.readFile(path, 'utf-8', (err, data) => {
        if ( err)
          console.log('[error] failed to load file to the editor')
          
        this.app.input.content = data
        this.setValue(data);
        // TODO this delay is not really needed
        setTimeout(() => this.app.emit(Events.EDITOR_INPUT_LOADED), 500)
      })
    })

    // Monaco finished loading the input file
    on(Events.EDITOR_INPUT_LOADED, () => { 
      if ( mock.kernels.length == 0)
        return;
    
      let decorations = []

      mock.kernels.forEach(kernel => {
        decorations.push({
          range: new this.monaco.Range(...(kernel.source.range)),
          options: {
            isWholeLine : true, 
            linesDecorationsClassName: 'editor-kernel-line-decoration',
            className : 'editor-kernel-line-highlight'
          }
        })
      })

      mock.kernels.forEach(kernel => {
        if ( kernel.statements.read.length == 0 && kernel.statements.write.length == 0 && kernel.statements.readwrite.length == 0)
          console.log(`No statements found for kernel: ${kernel.source.name}`)
        else
          console.log(`Statements for kernel: ${kernel.source.name}`)

        kernel.statements.read.forEach(readStmt => {
          readStmt.reads.forEach(read => {
            decorations.push({
              range: new this.monaco.Range(read.from.row, read.from.col, read.to.row, read.to.col),
              options : { 
                glyphMarginClassName: 'gutter-glyph-memory-read',
                minimap: {
                  color: 'rgb(191, 127, 63)',
                  position: 1
                }
              }
            })
          })
        })

        kernel.statements.write.forEach(writeStmt => {
          writeStmt.forEach(write => {
            decorations.push({
              range: new this.monaco.Range(write.from.row, write.from.col, write.to.row, write.to.col),
              options : {
                glyphMarginClassName: 'gutter-glyph-memory-write'
              }
            })
          })
        })

        kernel.statements.readwrite.forEach(readWriteStmt => {
          decorations.push({
            range: new this.monaco.Range(readWriteStmt.source.from.row, readWriteStmt.source.from.col, 
                                         readWriteStmt.source.to.row, readWriteStmt.source.to.col),
            options : { 
              glyphMarginClassName: 'gutter-glyph-memory-read-write',
              minimap: {
                color: 'rgb(191, 127, 63)',
                position: 1
              }
            }
          })
        })
      })

      this.instance.deltaDecorations([], decorations)
    })

  }
}

module.exports = Editor