/**
 * @module ui/editor
 * @category ui
 */
const fs              = require('@common/util/fs')
const {InternalError} = require('@common/util/error')

const mock      = require('@mock/cuda-source')
const Component = require('@renderer/ui/component').Component
const Events    = require('@renderer/events')
const App       = require('@renderer/app')

const path = require('path')

const EditorTabs = require('./EditorTabs')

/**
 */
class Editor extends Component {

  /** */
  constructor( id, container) {
    super(id, container)
    this.name = `Editor[${this.id}]`
    this.monaco = null
    this.instance = null

    // this.tabs = new EditorTabs("editor-tabs", this.container, app)

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

  get tabs() { return App.ui.toolbar.editor.tabs }

  selectTab(title) { this.tabs.select(title) }

  setValue(s) { 
    this.instance.setValue(s) 
    App.emit(Events.EDITOR_VALUE_CHANGED)
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
    if( this.instance)
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

    // Asynchronously load the editor and emit a completion("editor-loaded") event
    this.AMDRequire(['vs/editor/editor.main'], (monaco) => {
      this.node = $(`<div id="${this.id}" class="w-100"></div>`).appendTo(this.container)
      this.monaco = monaco
      this.instance = monaco.editor.create(document.getElementById(this.id), {
        language : 'cpp',
        glyphMargin: true,
        contextmenu: true,
        readOnly: true
      });

      App.emit(Events.EDITOR_LOADED, monaco)
      this.tabs.select('Cuda')
    });

    let on = (event, cb) => App.on(event, cb)

    on(Events.UI_RESIZE, () => this.updateLayout())
    window.onresize = () => this.updateLayout()

    on(Events.EDITOR_LOADED, () => App.emit(Events.UI_COMPONENT_READY, this))
    this.rendered = true;
    return this;
  }

  useDefaultControls() {
    if ( !this.rendered)
      throw new InternalError('Component must be rendered before calling defaultControls()')

    let on = (event, cb) => App.on(event, cb)
    
    // User selected a file so load it to the editor
    on(Events.INPUT_FILE_SELECTED, path => {
      App.input.path = path
      fs.readFile(path, 'utf-8', (err, data) => {
        if ( err)
          console.log('[error] failed to load file to the editor')
          
        App.input.content = data
        this.setValue(data);
        // TODO this delay is not really needed
        setTimeout(() => App.emit(Events.EDITOR_INPUT_LOADED), 500)
      })
    })

    on(Events.INPUT_KERNEL_SELECTED, () => {
      let kernel = App.Services.KernelSelection.getCurrent().getSelection()
      this.instance.revealLinesInCenter(kernel.source.range.from.line, kernel.source.range.to.line)
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