const App = require('@renderer/app')
const Component = require('@renderer/ui/component/Component')
const fs = require('@common/util/fs')
const { InternalError } = require('@common/util/error')
const Events = require('@renderer/events')
const path = require('path')
const EditorToolbar = require('./EditorToolbar')

/** @ignore @typedef {import("@renderer/services/editor/EditorTabs")} EditorTabs */
/** @ignore @typedef {import("@renderer/services/editor/EditorTab")} EditorTab */

/** */
class Editor extends Component {

  /**@type EditorToolbar*/
  Toolbar
  /**@type EditorTabs   */
  Tabs
  // /**@type {Object.<string, { model: TextModel, state: IEditorViewState, tab: EditorTab}} */
  // Data = {}

  /**@type {string[]} */
  #decorations

  /** */
  constructor(id, container) {
    super(id, container)
    this.name = `Editor[${this.id}]`
    this.rendered = false;
    this.monaco = null
    this.editor = null

    this.Toolbar = new EditorToolbar('editor-toolbar', `#${App.ui.layout.body.left.top.id}`)
    this.Tabs = this.Toolbar.tabs;

    this.AMDLoader = require('../../../../node_modules/monaco-editor/min/vs/loader.js');
    this.AMDRequire = this.AMDLoader.require;
    this.AMDDefine = this.AMDLoader.require.define;
    this.AMDRequire.config({
      baseUrl: fs.uriFromPath(path.join(__dirname, '../../../../node_modules/monaco-editor/min'))
    });
    this.finishedLoading = false;
    this.#decorations = []
  }

  isRendered() { return this.rendered }
  get tabs() { return Tabs }

  openWithTab(data, tab) {
    if (this.isRendered()) {
      if (tab) {
        this.Tabs.closeAll()
        this.Tabs.add(tab, true)
      }
      this.editor.setValue(data)
      this.updateLayout()
    }
  }

  /**
   * 
   * @param {number} lineStart 
   * @param {number} lineEnd 
   */
  highlightRange(lineStart, lineEnd) {
    this.#decorations = this.editor.deltaDecorations([], [
      {
        range: new this.monaco.Range(lineStart, 1, lineEnd, 1),
        options: {
          isWholeLine: true,
          linesDecorationsClassName: 'editor-kernel-line-decoration',
          className: 'editor-kernel-line-highlight',
          wordWrap: 'on',
          wordWrapColumn: 110,
          wrappingIndent: "indent",
        }
      }
    ])
    //     mock.kernels.forEach(kernel => {
    //       decorations.push({
    //         range: new this.monaco.Range(...(kernel.source.range)),
    //         options: {
    //           isWholeLine : true, 
    //           linesDecorationsClassName: 'editor-kernel-line-decoration',
    //           className : 'editor-kernel-line-highlight'
    //         }
    //       })
    //     })
  }

  /**
   * @param {number} lineStart
   * @param {number} lineEnd
   * @param {number} type
   */
  colorGlyphRange(lineStart, lineEnd, type) {
    console.log(lineStart, lineEnd, type)
    this.editor.deltaDecorations([], [
      {
        range: new this.monaco.Range(lineStart, 1, lineEnd, 1),
        options: {
          glyphMarginClassName: type == 1 ? 'gutter-glyph-memory-read' : (type == 2 ? 'gutter-glyph-memory-write' : 'gutter-glyph-memory-read-write')
        }
      }
    ])
  }

  jumpToRange(range) {
    this.editor.revealLinesInCenter(range.from.line, range.to.line)
  }
  // /**
  //  * @param {String} value
  //  * @param {EditorTab} tab
  //  * @param {boolean} open
  //  * @param {boolean} focus
  //  */
  // add(value, lang, tab, open=false, focus=false) {
  //   if ( tab)
  //     this.Tabs.add(tab, open)
  //   this.Data[tab.name] = {
  //     model: this.monaco.editor.createModel(value, lang),
  //     state: null,
  //     tab: tab
  //   }
  //   if ( Object.keys(this.Data) == 1) {
  //     this.editor.setModel(this.Data[tab.name].model)
  //     this.first = true
  //   }
  //   if( open && focus)
  //     this._selectTab(tab)
  // }

  // _selectTab(tab) {
  //   if ( this.rendered) {
  //     var currentState = this.editor.saveViewState()
  //     console.log(currentState)
  //     let found = false
  //     for ( let k in this.Data) {
  //       if ( this.Data[k].tab.equals(tab)) {
  //         this.Data[k].state = currentState
  //         found = true;
  //         break;
  //       }
  //     }
  //     if ( found) {
  //       this.editor.setModel(this.Data[tab.name].model)
  //       this.editor.restoreViewState(this.Data[tab.name].state)
  //       this.editor.focus();
  //     } else {
  //       App.Logger.error("[editor]", "Requested tab does not exist")
  //     }
  //   }
  // }

  markLineRead(lineno) {
    // glyphMarginClassName: 'gutter-glyph-memory-read-write',
  }

  markLineWrite(lineno) {

  }

  showKernelLaunchSelection() {

  }

  hideKernelLaunchSelection() {

  }

  updateLayout() {
    if (this.editor)
      this.editor.layout()
  }

  hasFinishedLoading() {
    return this.finishedLoading;
  }

  render() {
    if (this.isRendered()) {
      console.log(`[warn] multiple render() calls for ${this.name}. This is a no-op`)
      return this;
    }

    this.Toolbar.render()

    window.onresize = this.updateLayout()

    // Asynchronously load the editor and emit a completion("editor-loaded") event
    this.AMDRequire(['vs/editor/editor.main'], (monaco) => {
      this.node = $(`<div id="${this.id}" class="w-100"></div>`).appendTo(this.container)
      this.node.on('resize', () => console.log("RESIZE"))
      this.monaco = monaco
      this.editor = monaco.editor.create(document.getElementById(this.id), {
        language: 'cpp',
        glyphMargin: true,
        contextmenu: true,
        readOnly: true,
        automaticLayout: true
      })
      this.finishedLoading = true;
      this.rendered = true;
      this.Tabs.onSelect(tab => this._selectTab(tab))
      App.on(Events.UI_RESIZE, () => {
        this.editor.layout()
      });
      App.emit(Events.EDITOR_LOADED, monaco)
    })

    // on(Events.EDITOR_LOADED, () => App.emit(Events.UI_COMPONENT_READY, this))
    return this;
  }

  useDefaultControls() {
    if (!this.rendered)
      throw new InternalError('Component must be rendered before calling defaultControls()')

    // let on = (event, cb) => App.on(event, cb)

    // User selected a file so load it to the editor
    // on(Events.INPUT_FILE_SELECTED, () => {
    //   let path = App.Input.path;
    //   fs.readFile(path, 'utf-8', (err, data) => {
    //     if ( err) {
    //       App.Logger.error('Editor open', err)
    //       App.Notifier.error(`Could not open file '${path}'`)
    //       return;
    //     }
    //     // App.input.content = data
    //     this.setValue(data);
    //     // TODO this delay is not really needed
    //     setTimeout(() => App.emit(Events.EDITOR_INPUT_LOADED), 500)
    //   })
    // })

    // on(Events.INPUT_KERNEL_SELECTED, () => {
    //   let kernel = App.Services.KernelSelection.getCurrent().getSelection()
    //   this.instance.revealLinesInCenter(kernel.source.range.from.line, kernel.source.range.to.line)
    // })

    // Monaco finished loading the input file
    //   on(Events.EDITOR_INPUT_LOADED, () => { 
    //     if ( mock.kernels.length == 0)
    //       return;

    //     let decorations = []

    //     mock.kernels.forEach(kernel => {
    //       decorations.push({
    //         range: new this.monaco.Range(...(kernel.source.range)),
    //         options: {
    //           isWholeLine : true, 
    //           linesDecorationsClassName: 'editor-kernel-line-decoration',
    //           className : 'editor-kernel-line-highlight'
    //         }
    //       })
    //     })

    //     mock.kernels.forEach(kernel => {
    //       // if ( kernel.statements.read.length == 0 && kernel.statements.write.length == 0 && kernel.statements.readwrite.length == 0)
    //       //   console.log(`No statements found for kernel: ${kernel.source.name}`)
    //       // else
    //       //   console.log(`Statements for kernel: ${kernel.source.name}`)

    //       kernel.statements.read.forEach(readStmt => {
    //         readStmt.reads.forEach(read => {
    //           decorations.push({
    //             range: new this.monaco.Range(read.from.row, read.from.col, read.to.row, read.to.col),
    //             options : { 
    //               glyphMarginClassName: 'gutter-glyph-memory-read',
    //               minimap: {
    //                 color: 'rgb(191, 127, 63)',
    //                 position: 1
    //               }
    //             }
    //           })
    //         })
    //       })

    //       kernel.statements.write.forEach(writeStmt => {
    //         writeStmt.forEach(write => {
    //           decorations.push({
    //             range: new this.monaco.Range(write.from.row, write.from.col, write.to.row, write.to.col),
    //             options : {
    //               glyphMarginClassName: 'gutter-glyph-memory-write'
    //             }
    //           })
    //         })
    //       })

    //       kernel.statements.readwrite.forEach(readWriteStmt => {
    //         decorations.push({
    //           range: new this.monaco.Range(readWriteStmt.source.from.row, readWriteStmt.source.from.col, 
    //                                        readWriteStmt.source.to.row, readWriteStmt.source.to.col),
    //           options : { 
    //             glyphMarginClassName: 'gutter-glyph-memory-read-write',
    //             minimap: {
    //               color: 'rgb(191, 127, 63)',
    //               position: 1
    //             }
    //           }
    //         })
    //       })
    //     })

    //     this.instance.deltaDecorations([], decorations)
    //   })

    // }
  }
}

module.exports = Editor