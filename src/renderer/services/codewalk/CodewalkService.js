const Service = require('@renderer/services/Service')
const CodewalkToolbar = require('@renderer/services/codewalk/CodewalkToolbar')

/**
 * @memberof module:codenav
 */
class CodewalkService extends Service {

  /** @type {CodewalkToolbar} */
  #Toolbar

  constructor() {
    super("CodenavService")
    this.#Toolbar = new CodewalkToolbar().render()
  }

  /** @returns CodewalkService */
  enable() {
    this.#Toolbar.enable();
    return this;
  }

  /** @returns CodewalkService */
  disable() {
    this.#Toolbar.disable();
    return this;
  }
}

module.exports = CodewalkService