const Editor = require('./Editor')

const Component     = require('@renderer/ui/component').Component
const Events        = require('@renderer/app').Events

/** @ignore @typedef {import("@renderer/ui/editor/EditorTab")} EditorTab */
/**
 * @memberof module:editor
 */
class EditorTabs extends Component {

  /** @type {Boolean}     */ #rendered
  /** @type {EditorTab[]} */ #tabs

  /** 
   * @param {*} container 
   */
  constructor(container) {
    super('editor-tabs', container)
    this.#rendered = false
  }

  /** @type {EditorTab[]} */
  get tabs() { return this.#tabs }

  /**
   * 
   * @param {*} tab 
   */
  open(tab) {
    
  }

  /**
   * 
   * @param {*} tab 
   */
  close(tab) {

  }

  /**
   * @returns {Boolean}
   */
  isRendered() { return this.#rendered }

  /**
   * @returns {EditorTabs} this
   */
  render() {
    if ( !this.is)
  }
}

module.exports = EditorTabs