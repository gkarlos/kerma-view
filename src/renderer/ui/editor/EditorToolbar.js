
const Component      = require('@renderer/ui/component/Component')
const Events         = require('@renderer/events')
const App            = require('@renderer/app')
const EditorTabs     = require('@renderer/ui/editor/EditorTabs')
const EditorTabsAdd  = require('@renderer/ui/editor/EditorTabsAdd')

/**
 * @memberof module:editor
 */
class EditorToolbar extends Component {
  /** @type {EditorTabs} */
  #tabs
  /** @type {EditorTabsAdd} */
  #add
  /** @type {Boolean} */
  #rendered
  /** @type {JQuery} */
  #node

  constructor(id, container) {
    super(id, container)
    this.#node = null
    this.#rendered = false
    this.#tabs = new EditorTabs('editor-tabs', `#${this.id}`, App, true)
    this.#add  = new EditorTabsAdd(`#${this.id}`)
    // this.codenav = new CodeNavToolbar('codenav-toolbar', `#${this.id}`, App, true)
  }

  /** @type {EditorTabs} */
  get tabs() { return this.#tabs }

  /** @type {EditorToolbarAdd} */
  get add() { return this.#add }

  /** @returns {Boolean} */
  isRendered() {
    return this.#rendered
  }

  render() {
    if ( ! this.isRendered() ) {
      this.node = $(`<div id=${this.id} class="nav-tabs"></div>`).appendTo(this.container)

      this.add.render()
      this.tabs.render()

      //TODO populate tabs
      
      this.rendered = true
      App.emit(Events.UI_COMPONENT_READY, this)
    } 
    return this;
  }

  useDefaultControls() {
    this.tabs.useDefaultControls()
    // this.codenav.useDefaultControls()
  }
}

module.exports = EditorToolbar