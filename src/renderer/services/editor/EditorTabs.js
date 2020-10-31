const App = require('@renderer/app')
const Component     = require('@renderer/ui/component').Component
const EditorTab     = require('@renderer/services/editor/EditorTab')
const EventEmitter  = require('events').EventEmitter

/**
 * @memberof module:editor
 */
class EditorTabs extends Component {
  /** @type {Boolean}     */ #rendered
  /** @type {EditorTab[]} */ #tabs
  /** @type {EditorTab[]} */ #openTabs
  /** @type {JQuery}      */ #tabsNode
  /** @type {JQuery}      */ #selectorNode
  /** @type {JQuery}      */ #selectorDropdown
  /** @type {EditorTab}   */ #selected
  /** @type {EventEmmiter}*/ #Emitter

  /**
   * @param {*} container
   */
  constructor(container) {
    super('editor-tabs', container)
    this.#rendered = false
    this.#tabs = []
    this.#openTabs = []
    this.#Emitter = new EventEmitter()
  }

  /** @type {EditorTab[]} */
  get tabs() { return this.#tabs }

  /**
   * Search the available tabs
   * @param {EditorTab} tab
   * @returns {Boolean}
   */
  lookup(tab) {
    for ( let i = 0; i < this.#tabs.length; ++i)
      if ( this.#tabs[i].equals(tab))
        return true
    return false
  }

  /**
   * Search the open tabs
   * @param {EditorTab} tab
   * @returns {Boolean}
   */
  lookupOpen(tab) {
    for ( let i = 0; i < this.#openTabs.length; ++i)
      if ( this.#openTabs[i].equals(tab))
        return true
    return false
  }

  /**
   * @param {EditorTab} tab
   * @param {boolean} open
   */
  add(tab, open=false) {
    if ( !tab)
      App.Logger.warn("[editor]", "Requested add for invalid tab:", tab)
    if ( !this.lookup(tab)) {
      tab.onClick(() => this.select(tab))
      tab.onClose(() => this.close(tab))

      this.#tabs.push(tab);
      tab.onClick(() => this.select(tab))
      if ( this.isRendered())
        this._renderOpenTab(tab)
      if ( open)
        this.open(tab)
    }
    return this
  }

  /**
   * @param {EditorTab} tab
   * @returns {EditorTabs}
   */
  open(tab, select=false) {
    if ( !open)
      App.Logger.warn("[editor]", "Requested open for invalid tab:", tab)
    if ( this.lookupOpen(tab))
      App.Logger.warn("[editor]", "Tab already open", tab.toString())
    else {
      if ( !this.lookup(tab))
        this.add(tab)
      App.Logger.debug("[editor]", `Opening tab '${tab.title}'`)
      this.#openTabs.push(tab)
      if ( this.isRendered()) {
        this._renderOpenTab(tab)
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
    if ( !tab)
      App.Logger.warn("[editor][tabs] Requested select for invalid tab:", tab)
    if ( this.#selected && this.#selected.equals(tab))
      return this
    if ( !this.lookup(tab))
      open(tab)
    App.Logger.info(`[editor][tabs] User selected tab '${tab.name}'`)
    let oldSelected = this.#selected
    this.#selected && this.#selected.deactivate()
    tab.activate()
    this.#selected = tab
    if ( oldSelected && !oldSelected.equals(tab))
      this.#Emitter.emit('select', tab)
    return this;
  }

  closeAll() {
    this.#tabs.forEach(tab => this.close(tab))
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
    else {
      if ( !tab.canClose()) {
        App.Logger.debug("[editor][tabs]", "Cannot close tab:", tab.title)
      } else {
        //2. if #opentabs > 1, find next tab in line (mod #opentabs) to select else select then src tab (0) which is always open
        for ( let i = 0; i < this.#openTabs.length; ++i) {
          if ( this.#openTabs[i].equals(tab)) {
            this.#openTabs.splice(i, 1)
            this.#tabsNode.remove(tab.node)
            tab.close()
            if ( this.isRendered()) {
              if ( this.#tabs.length > 0)
                this.select(this.#tabs[i % this.#tabs.length])
            }
            this.#Emitter.emit('tabClose', tab)
            break;
          }
        }
      }
    }
    return this
  }

  /**
   * @returns {Boolean}
   */
  isRendered() { return this.#rendered }


  onSelect(cb) { this.#Emitter.on('select', cb) }
  onClose(cb) { this.#Emitter.on('close', cb) }

  _renderAvailableTab(tab) {
    $(`<a class="dropdown-item" id="tab-${tab.name}">
        ${tab.icon}
        <span class="title">${tab.name}</span>
       </a>`)
      .appendTo(this.#selectorDropdown)
      .on('click', () => this.open(tab))
  }

  _renderOpenTab(tab) {
    this.#tabsNode.append(tab.render())
    // select the first tab we render
    // if we dont have another other marked selected
    if ( !this.#selected)
      this.select(tab)
  }

  _renderTabs() {
    this.#tabsNode =
      $(`<ul id="${this.id}" role="tablist"> </ul>`)
        .addClass("nav")
        .addClass("nav-tabs")
        .css('width', '100%')
        .appendTo($(this.container))
    this.#openTabs.forEach(tab => this._renderOpenTab(tab))
  }

  _renderTabSelector() {
    this.#selectorNode =
      $(`<div class="nav navbar-nav" id="editor-tabs-add">
          <button class="btn btn-sm btn-outline-secondary nav-item dropdown-toggle" data-toggle="dropdown" aria-haspopup="true">
            <i class="fas fa-plus" id="editor-tabs-add-button-plus-sign"></i>
          </button>
        </div>`).prependTo(this.container)
    this.#selectorDropdown = $(`<div class="dropdown-menu"></div>`).appendTo(this.#selectorNode)
  }

  /**
   * @returns {JQuery} this
   */
  render() {
    if ( !this.isRendered()) {
      this._renderTabs()
      // this._renderTabSelector()
      this.#rendered = true
    }
    return this
  }

  /**
   * @returns {EditorTab}
   */
  getSelected() {
    return this.#selected;
  }
}

module.exports = EditorTabs