const App          = require("@renderer/app")

/**
 * @memberof module:editor
 */
class EditorTab {
  /** @type {String} */
  #name
  /** @type {String} */
  #icon
  /** @type {String} */
  #title
  /** @type {JQuery} */
  #node
  /** @type {Boolean} */
  #rendered
  /** @type {Boolean} */
  #closable
  /** @type {Boolean} */
  #open
  /** @type {Boolean} */
  #active
  /** @type {EventEmitter} */
  #emitter

  /**
   * @param {String} name 
   * @param {String} [icon]
   * @param {String} [title]
   */
  constructor(name, icon, title) {
    this.#name     = name
    this.#icon     = icon
    this.#title    = title !== undefined? title : name
    this.#rendered = false
    this.#closable = true
  }

  /** @type {String} */
  get name() { return this.#name }

  /** @type {String} */
  get icon() { return this.#icon }

  /** @type {String} */
  get title() { return this.#title }

  /** @type {JQuery} */
  get node() { return this.#node }

  /**
   * @param {EditorTab}
   * @returns {Boolean}
   */
  equals(other) {
    return (other instanceof EditorTab)
      && this.#name  === other.name
      && this.#icon  === other.icon
      && this.#title === other.title
  }

  /**
   * @returns {Boolean}
   */
  canClose() {
    return this.#closable
  }

  /**
   * @returns {EditorTab}
   */
  preventClose() {
    this.#closable = false
    return this
  }

  /**
   * @returns {Boolean}
   */
  isOpen() {
    return this.#open
  }

  /**
   * @returns {Boolean}
   */
  isActive() {
    return this.#active
  }

  /** 
   * @returns {Boolean} 
   */
  isRendered() {
    return this.#rendered
  }

  /**
   * @returns {EditorTab} this
   */
  open() {
    if ( !this.isOpen() && this.isRendered())
      this.#node.show()
    this.#open = true
    return this
  }

  /**
   * @returns {EditorTab} this
   */
  close() {
    if ( this.isOpen() && this.isRendered())
      this.#node.hide()
    this.#open = false
    return this
  }

  /**
   * @returns {EditorTab} this
   */
  activate() {
    this.#active = true
    if ( this.isRendered()) {
      this.#node.children('a').addClass("active")
      this.#node.children('a').removeClass("editor-tab-deactivated")
      this.#node.children('a').addClass("editor-tab-activated")
    }
    return this;
  }

  /**
   * @returns {EditorTab} this
   */
  deactivate() {
    this.#active = false
    if ( this.isRendered()) {
      this.#node.children('a').removeClass("active")
      this.#node.children('a').addClass("editor-tab-deactivated")
      this.#node.children('a').removeClass("editor-tab-activated")
    }
    return this
  }


  /**
   * @returns {JQuery}
   */ 
  render() {
    if ( !this.isRendered()) {
      this.#node = $(`
        <li class="nav-item editor-tab" id="tab-${this.title}">
        </li>
      `)

      let tabContent = $(`
        <a class="nav-link" href="#" role="tab">
          ${this.#icon}
          <span class="editor-tab-title">${this.#title}</span>
        </a>
      `).appendTo(this.#node)

      let self = this

      let tabCloseWrapper = $(`<span class="editor-tab-close-wrapper"></span>`).appendTo(tabContent)
      let tabClose = $(`<i class="fas fa-times editor-tab-close"></i>`).appendTo(tabCloseWrapper)

      tabContent
        .on('click', (e) => {
          if ( e.target.classList.contains("editor-tab-close")) {
            // tab-close button pressed
            if ( !self.canClose()) 
              App.Notifier.info(`Tab '${self.title}' is not closable.`)
            else {
              App.Logger.info("[user-action]", "Close tab:", self.title)
              App.ui.toolbar.editor.tabs.close(self)
            }
          } else {
            if ( !this.isActive())
              App.ui.toolbar.editor.tabs.select(self)
          }
        })
        .on('mouseover', () => {
          tabClose.addClass("opacity-1")
        })
        .on('mouseleave', () => {
          tabClose.removeClass("opacity-1")
        })

      this.#rendered = true
    }

    if ( !this.isActive())
      this.deactivate()
    return this.#node
  }
  
  /**
   * @returns {String}
   */
  toString() {
    return `{name: ${this.#name}, title: ${this.#title}}`
  }
}

module.exports = EditorTab