const App     = require('@renderer/app')
const Service = require('@renderer/services/Service')

const InputToolbar = require('@renderer/services/input/InputToolbar')
const { Input } = require('@renderer/app')
const fs = require('fs')


/** @type InputToolbar*/ 
var Toolbar = undefined;

/**
 * @memberof module:input
 */
class InputService extends Service {

  constructor() {
    super("InputService")
    if ( !Toolbar) {
      Toolbar = new InputToolbar().render().disable();
      if ( !App.ui.editor.hasFinishedLoading())
        App.on(App.Events.EDITOR_LOADED, () => Toolbar.enable() )
      else
        Toolbar.enable();
    }

    Toolbar.on('fileSelect', (path) => {
      // 1. make sure the file exists
      if ( !fs.existsSync(path)) {
        App.Notifier.error(`Could not find file ${path}`)
        setTimeout(() => {
          Toolbar.resetPathInput();
        }, 1500)
      } else {
        App.Input.path = path;
        App.emit(App.Events.INPUT_FILE_SELECTED, path);
      }
    })

    App.on(App.Events.EDITOR_INPUT_LOADED, () => Toolbar.disablePath())
    App.on(App.Events.KERMAD_INPUT_ERROR, () => this.reset())
  }

  reset() {
    Toolbar.reset();
  }

  getPath() {
    return InputService.Toolbar.getPath()
  }

  getArgs() {
    return InputService.Toolbar.getArgs()
  }

  getInput() {
    return {
      path: InputService.Toolbar.getPath(),
      args: InputService.Toolbar.getArgs()
    }
  }
}

module.exports = InputService