const Component = require('@renderer/ui/component/Component')

/**
 * @memberof module:editor
 */
class EditorTabsAdd extends Component {
  /** @type {JQuery} */
  #node
  /** @type {Boolean} */
  #rendered

  /**
   * @param {String} container 
   */
  constructor(container) {
    super("editor-tabs-add", container)
    this.#rendered = false

  }

  /** @returns {Boolean} */
  isRendered() {
    return this.#rendered
  }

  /** 
   * @returns {EditorTabsAdd}
   */
  render() {
    if ( this.isRendered())
      return this

    this.#node = $(`
      <div class="nav navbar-nav" id="editor-tabs-add">
        <button class="btn btn-sm btn-outline-secondary nav-item dropdown-toggle" data-toggle="dropdown" aria-haspopup="true">
          <i class="fas fa-plus" id="editor-tabs-add-button-plus-sign"></i>
        </button>
      </div>
    `).appendTo(this.container)
    
    this.addDropdownMenu = $(`<div class="dropdown-menu"></div>`).appendTo(this.#node)

    this.itemLLVM = $(`
      <a class="dropdown-item" id="llvm-option" href="#">
        <img height="20" width="20" src="../../../assets/icons/llvm.svg"/>
        <span class="title">llvm-ir</span>
      </a>
    `).appendTo(this.addDropdownMenu)
    
    this.itemPtx = $(`
      <a class="dropdown-item" href="#">
        <img height="20" width="20" src="../../../assets/icons/nvidia.svg"/>
        <span class="title">ptx</span>
      </a>
    `).appendTo(this.addDropdownMenu)
  

    this.itemCompileCommands = $(`
      <a class="dropdown-item" href="#">
        <img height="20" width="20" src="../../../assets/icons/json-file.svg"/>
        <span class="title">compile-commands</span>
      </a>
    `).appendTo(this.addDropdownMenu)
  

    this.itemOutput = $(`
      <a class="dropdown-item" href="#">
        <img height="20" width="20" src="../../../assets/icons/receipt.svg"/>
        <span class="title">output<span>
      </a>
    `).appendTo(this.addDropdownMenu)

    $(`<div class="dropdown-divider"></div>`).appendTo(this.addDropdownMenu)
    
    this.itemOpenAll = $(`
      <a class="dropdown-item" href="#">
        <span><i class="far fa-copy"></i><span> 
        <span>Open all<span>
      </a>
    `).appendTo(this.addDropdownMenu)

    $(`<div class="dropdown-divider"></div>`).appendTo(this.addDropdownMenu)
    
    this.itemCloseAll = $(`
      <a class="dropdown-item" href="#">
        <span><i class="fas fa-times"></i><span> 
        <span>Close all<span>
      </a>
    `).appendTo(this.addDropdownMenu)

    this.#rendered = true

    return this
  }
}

module.exports = EditorTabsAdd