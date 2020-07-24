const App = require('@renderer/app')

const Component     = require('@renderer/ui/component').Component
const Events        = require('@renderer/app').Events
const EditorTab     = require('@renderer/ui/editor/EditorTab')

/** @ignore @typedef {import("@renderer/ui/editor/EditorTab")} EditorTab */

function searchTabs(tabs, title) {
  for ( let i = 0; i < tabs.length; ++i)
    if ( tabs[i].title === title)
      return true
  return false
}

/**
 * @memberof module:editor
 */
class EditorTabs extends Component {

  /** @type {EditorTab} */ 
  static TabSource
    = new EditorTab("Source", '<span class="editor-tab-icon"><i class="fas fa-code"></i></span>').preventClose()

  /** @type {EditorTab} */ 
  static TabLLVM 
    = new EditorTab("llvm", `<img class="editor-tab-icon" src="../../../assets/icons/llvm.svg"/>`, "llvm-ir")

  /** @type {EditorTab} */
  static TabPtx  
    = new EditorTab("ptx", `<img class="editor-tab-icon" src="../../../assets/icons/nvidia.svg"/>`)

  /** @type {EditorTab} */ 
  static TabCompileCommands 
    = new EditorTab("compile-commands", `<img class="editor-tab-icon" src="../../../assets/icons/json-file.svg"/>`)

  /** @type {EditorTab} */ 
  static TabOutput 
    = new EditorTab("output", `<img class="editor-tab-icon" src="../../../assets/icons/receipt.svg"/>`)

  /** @type {Boolean}     */ #rendered
  /** @type {EditorTab[]} */ #tabs
  /** @type {JQuery}      */ #node
  /** @type {EditorTab}   */ #selected

  /** 
   * @param {*} container 
   */
  constructor(container) {
    super('editor-tabs', container)
    this.#rendered = false
    this.#tabs = []
  }

  /** @type {EditorTab[]} */
  get tabs() { return this.#tabs }

  /**
   * Search the open tabs
   * @param {EditorTab} tab 
   * @returns {Boolean}
   */
  lookup(tab) {
    for ( let i = 0; i < this.#tabs.length; ++i)
      if ( this.#tabs[i].equals(tab)) {
        return true
      }
    return false
  }

  /**
   * @returns {Boolean}
   */
  _hasSelectedTab() { return this.#selected !== undefined }

  /**
   * @param {String} name 
   * @returns {EditorTab}
   */
  findByName(name) {
    return this.#tabs.find(tab => tab.name === name)
  }

  /**
   * @param {String} title
   * @returns {EditorTab} 
   */
  findByTitle(title) {
    return this.#tabs.find(tab => tab.title === title)
  }

  /**
   * @param {EditorTab} tab 
   * @returns {EditorTabs}
   */
  open(tab, select=false) {
    if ( this.lookup(tab))
      App.Logger.warn("[editor]", "Requested to open duplicate tab", tab.toString())
    else {
      App.Logger.debug("[tabs]", `Opening tab '${tab.title}'`)
      this.#tabs.push(tab)
      if ( this.isRendered()) {
        this.#node.append(tab.render())
        tab.open()
      }
      if ( select)
        this.select(tab)
    }
    return this;
  }

  /**
   * @param {EditorTab} tab 
   */
  select(tab) {
    if ( this._hasSelectedTab() && this.#selected.equals(tab))
      return this

    if ( this.lookup(tab)) {
      this._hasSelectedTab() && this.#selected.deactivate()
      tab.activate()
      this.#selected = tab
    } else {
      App.Logger.warn("[editor]", `Requested to select non-existent tab ${tab.toString()}`)
    }
    return this;
  }

  /**
   * @param {EditorTab} tab 
   */
  close(tab) {
    if ( !tab)
      App.Logger.warn("[editor][tabs] Requested close for invalid tab:", tab)

    //1. close the tab
    if ( !this.lookup(tab))
      App.Logger.warn("[editor][tabs]", "Requested close for non-existent tab:", tab.toString())
    else
      if ( !tab.canClose()) {
        App.Logger.debug("[editor][tabs]", "Cannot close tab:", tab.title)
      } else {
        //2. if #opentabs > 1, find next tab in line (mod #opentabs) to select else select then src tab (0) which is always open
        for ( let i = 0; i < this.#tabs.length; ++i) {
          if ( this.#tabs[i].equals(tab)) {
            this.#tabs.splice(i, 1)
            this.#node.remove(tab.node)
            tab.close()
            if ( this.isRendered()) {
              if ( this.#tabs.length > 0)
                this.select(this.#tabs[i % this.#tabs.length])
            }
            break;
          }
        }
      }

      return this 
  }

  /**
   * @returns {Boolean}
   */
  isRendered() { return this.#rendered }

  /**
   * @returns {JQuery} this
   */
  render() {
    if ( !this.isRendered()) {
      this.#node = 
        $(`<ul id="${this.id}" role="tablist"> </ul>`)
          .addClass("nav")
          .addClass("nav-tabs")
          .css('width', '100%')
          .appendTo($(this.container))
      this.#rendered = true
    }
    return this.#node
  }
}

module.exports = EditorTabs