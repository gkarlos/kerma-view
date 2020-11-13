const App = require('@renderer/app')
const Service = require('@renderer/services/Service')
const fs = require('fs')
const EditorView = require('@renderer/services/editor/Editor')
const EditorTab = require('@renderer/services/editor/EditorTab')
const resolve = require('@common/util/path').resolve
const path = require('path')

/** @ignore @typedef {import("@renderer/models/cuda/CuKernel")} CuKernel */


/** @type EditorView */ var Editor = undefined

  /** @type {EditorTab} */
  const TabSource
    = new EditorTab("Source", '<span class="editor-tab-icon"><i class="fas fa-code"></i></span>').preventClose()

  /** @type {EditorTab} */
  const TabCompileCommands
    = new EditorTab("compile-commands", `<img class="editor-tab-icon" src="../../../assets/icons/json-file.svg"/>`)

class EditorService extends Service {

  /** @type {EditorTab} */ #SourceTab
  /** @type {EditorTab} */ #CompileDdTab

  constructor() {
    super("EditorService");
    if ( !Editor)
      Editor = new EditorView('editor', `#${App.ui.layout.body.left.top.id}`).render()
    // Editor.addTab(TabSource,true)
    // Editor.addTab(TabCompileCommands)
  }

  getSourceTab() {

  }

  getCompileDbTab() {

  }
  /**
   * Open a source file. If dir is set, the file path is considered
   * relative to the dir. if it is not set the path is considered
   * absolute.
   * @param {String} file
   * @param {String} [dir]
   */
  openSource(file, dir) {
    let self = this
    return new Promise((resolve, reject) => {
      let filepath = dir? path.join(dir, file) : file
      fs.readFile(filepath, 'utf-8', (err, data) => {
        if ( !err) {
          self.#SourceTab = new EditorTab(
            "source", '<span class="editor-tab-icon"><i class="fas fa-code"></i></span>',
            file, filepath).preventClose()
          Editor.openWithTab(data, self.#SourceTab);
          setTimeout(() => App.emit(App.Events.EDITOR_INPUT_LOADED), 500)
          resolve();
        } else {
          App.Logger.error('Editor open', err)
          reject();
        }
      })
    })
  }

  /**
   * @param {CuKernel[]} kernels
   */
  highlightKernels(kernels) {
    if ( kernels) {
      kernels.forEach(kernel => {
        // gray background for kernel text
        Editor.highlightRange(kernel.range.fromLine, kernel.range.toLine)

        // mark statements
        kernel.stmts.forEach(stmt => Editor.colorGlyphRange(stmt.range.fromLine, stmt.range.toLine, stmt.type))
      })
    }
  }


  /**
   * @param {CuKernel} kernel
   */
  jumptToKernel(kernel) { Editor.jumpToRange(kernel.range) }
  /** opens both source and compile commands */
  // open(input) {
  //   let self = this
  //   return new Promise((resolve, reject) => {
  //     if ( !input)
  //       return reject("Invalid input")
  //     let sourcePath = path.join(input.dir, input.source)
  //     let compiledbPath = path.join(input.dir, input.compiledb)

  //     console.log(sourcePath)
  //     console.log(compiledbPath)

  //     if ( !fs.existsSync(sourcePath))
  //       return reject(`Could not locate source '${sourcePath}'`)
  //     if ( !fs.existsSync(compiledbPath))
  //       return reject(`Could not locate compiledb '${compiledbPath}'`)

  //     self.#SourceTab = new EditorTab(
  //       "source", '<span class="editor-tab-icon"><i class="fas fa-code"></i></span>',
  //       input.source, sourcePath).preventClose()
  //     self.#CompileDdTab = new EditorTab(
  //       "compile-commands", `<img class="editor-tab-icon" src="../../../assets/icons/json-file.svg"/>`,
  //       "compile_commands.json", compiledbPath).preventClose()

  //     fs.readFile(sourcePath, 'utf-8', (errSource, dataSource) => {
  //       if (errSource) {
  //         App.Logger.error('[editor2]', errSource);
  //         return reject(errSource)
  //       }
  //       Editor.add(dataSource, 'cpp', self.#SourceTab, true, true)

  //       fs.readFile(compiledbPath, 'utf-8', (errCompiledb, dataCompiledb) => {
  //         if ( !errCompiledb) {
  //           Editor.add(dataCompiledb, 'javascript', self.#CompileDdTab, true)
  //           setTimeout(() => App.emit(App.Events.EDITOR_INPUT_LOADED), 500)
  //           return resolve()
  //         }
  //         App.Logger.error('[editor1]', errCompiledb);
  //       })
  //     })
  //   });
  // }

  // open(input) {
  //   let ReadFile = (file) => new Promise((resolve, reject) => {
  //     fs.readFile(file, (err, data) => {
  //       if ( err)
  //         reject(err)
  //       else
  //         resolve(data)
  //     })
  //   })
  //   let self = this;

  //   const SourcePath = path.join(input.dir, input.source)
  //   const CompileDbPath = path.join(input.dir, input.compiledb)
  //   return new Promise( (resolve, reject) => {
  //     const promises = [ ReadFile(SourcePath), ReadFile(CompileDbPath)]

  //     Promise
  //       .all(promises)
  //       .then( res => {
  //         self.#SourceTab = new EditorTab(
  //           "source", '<span class="editor-tab-icon"><i class="fas fa-code"></i></span>',
  //           input.source, SourcePath).preventClose()
  //         self.#CompileDdTab = new EditorTab(
  //           "compile-commands", `<img class="editor-tab-icon" src="../../../assets/icons/json-file.svg"/>`,
  //           "compile_commands.json", CompileDbPath).preventClose()
          
  //         console.log(res)
  //         Editor.add(res[0], 'cpp', self.#SourceTab, true)
  //         Editor.add(res[1], 'json', self.$CompileDdTab, true)
  //         resolve()
  //       })
  //       .catch(err, () => {
  //         console.log(err)
  //         reject(err)
  //       })
  //   })
  // }

  reset() {
    // TODO
  }

  viewLoaded() {
    return Editor.hasFinishedLoading();
  }
}

module.exports = EditorService