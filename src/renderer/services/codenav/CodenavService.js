const App     = require('@renderer/app')
const Service = require('@renderer/services/Service')

const CodenavToolbar = require('@renderer/services/codenav/CodenavToolbar')

/**
 * @memberof module:codenav
 */
class CodenavService extends Service {

  static toolbar = undefined
  static editor  = undefined

  constructor() {
    super("CodenavService")
    if ( !CodenavService.toolbar)
      CodenavService.toolbar = new CodenavToolbar()
  }
}

module.exports = CodenavService