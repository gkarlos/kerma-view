
const Component      = require('@renderer/ui/component/Component')
const Events         = require('@renderer/events')
const App            = require('@renderer/app')
const EditorTab      = require('@renderer/services/editor/EditorTab')
const EditorTabs     = require('@renderer/services/editor/EditorTabs')

/**
 * @memberof module:editor
 */
class EditorToolbar extends Component {
  /** @type {EditorTabs}    */ #tabs
  /** @type {EditorTabsAdd} */ #add
  /** @type {Boolean}       */ #rendered
  /** @type {JQuery}        */ #node
  /** @type {EditorTab}     */ #tabCuda
  /** @type {EditorTab}     */ #tabLLVM
  /** @type {EditorTab}     */ #tabPtx
  /** @type {EditorTab}     */ #tabCompileCommands
  /** @type {EditorTab}     */ #tabOutput

  /**
   * @param {String} id 
   * @param {String} container 
   */
  constructor(id, container) {
    super(id, container)
    this.#node = null
    this.#rendered = false
    this.#tabs = new EditorTabs(`#${this.id}`, App, true)
  }

  /** @type {EditorTabs} */
  get tabs() { return this.#tabs }

  /** @type {EditorToolbarAdd} */
  get add() { return this.#add }

  /** @returns {Boolean} */
  isRendered() {
    return this.#rendered
  }

  /** @returns {EditorToolbar} */
  openAllTabs() {
    if ( !EditorTabs.TabLLVM.isOpen())
      App.ui.toolbar.editor.tabs.open(EditorTabs.TabLLVM)
    if ( !EditorTabs.TabPtx.isOpen())
      App.ui.toolbar.editor.tabs.open(EditorTabs.TabPtx)
    if ( !EditorTabs.TabCompileCommands.isOpen())
      App.ui.toolbar.editor.tabs.open(EditorTabs.TabCompileCommands)
    if ( !EditorTabs.TabOutput.isOpen())
      App.ui.toolbar.editor.tabs.open(EditorTabs.TabOutput)
    return this
  }

  /** @returns {EditorToolbar} */
  closeAllTabs() {
    if ( EditorTabs.TabLLVM.isOpen())
      App.ui.toolbar.editor.tabs.close(EditorTabs.TabLLVM)
    if ( EditorTabs.TabPtx.isOpen())
      App.ui.toolbar.editor.tabs.close(EditorTabs.TabPtx)
    if ( EditorTabs.TabCompileCommands.isOpen())
      App.ui.toolbar.editor.tabs.close(EditorTabs.TabCompileCommands)
    if ( EditorTabs.TabOutput.isOpen())
      App.ui.toolbar.editor.tabs.close(EditorTabs.TabOutput)
    return this
  }

  render() {
    if ( ! this.isRendered() ) {
      this.node = $(`<div id=${this.id} class="nav-tabs"></div>`).appendTo(this.container)
      this.#tabs.render()
      this.rendered = true
    }
    return this;
  }

  onTabSelect(cb) { this.#tabs.onSelect(cb); }

  useDefaultControls() {
    // this.tabs.useDefaultControls()
    // this.codenav.useDefaultControls()
  }
}

module.exports = EditorToolbar