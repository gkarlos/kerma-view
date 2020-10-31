const App     = require('@renderer/app')
const Service = require('@renderer/services/Service')
const path = require('path')
const InputToolbar = require('@renderer/services/input/InputToolbar')
const fs = require('fs')

/**
 * @typedef {Object} Input
 * @property {String} dir
 * @property {String} source
 * @property {String} compiledb
 */

/** @type InputToolbar*/
var Toolbar = undefined;

/**
 * @memberof module:input
 */
class InputService extends Service {

  #dir
  #source
  #compiledb

  constructor() {
    super("InputService")
    if ( !Toolbar) {
      Toolbar = new InputToolbar().render().disable();
      if ( !App.Editor)
        App.on(App.Events.EDITOR_LOADED, () => Toolbar.enable() )
      else
        Toolbar.enable();
    }

    Toolbar.on('fileSelect', (sourcePath) => {
      // 1. make sure the source file exists
      if ( !fs.existsSync(sourcePath)) {
        App.Notifier.error(`Could not find file ${sourcePath}`)
        setTimeout(() => Toolbar.resetPathInput(), 1500)
      }
      // 2. make sure compile_commands.json exists
      let sourcedir = path.dirname(sourcePath)
      let compiledb = path.join( sourcedir, "compile_commands.json")
      if ( fs.existsSync(compiledb)) {
        this.#dir = sourcedir
        this.#source = path.basename(sourcePath)
        this.#compiledb = "compile_commands.json"
        App.emit(App.Events.INPUT_SELECTED, this.getInput());
      }
      else {
        App.Notifier.error(`Could not find compile_commands.json`)
        setTimeout(() => Toolbar.resetPathInput(), 1500)
      }
    })

    App.on(App.Events.EDITOR_INPUT_LOADED, () => Toolbar.disablePath())
    App.on(App.Events.KERMAD_INPUT_ERROR, () => this.reset())
  }

  reset() {
    Toolbar.reset();
    this.#dir = undefined
    this.#source = undefined
    this.#compiledb = undefined
  }

  getDir() {
    return this.#dir || "";
  }

  getSource() {
    return this.#source || "";
  }

  getCompileDb() {
    return this.#compiledb || "";
  }

  getSourceDirectory() {
    return this.#source? path.dirname(this.#source) : ""
  }

  getArgs() {
    return Toolbar.getArgs()
  }

  /** @returns Input */
  getInput() {
    return {
      dir: this.getDir(),
      source: this.getSource(),
      compiledb: this.getCompileDb(),
      args: this.getArgs()
    }
  }

  onFileSelect(cb) {
    Toolbar.on("fileSelect", cb);
  }
}

module.exports = InputService