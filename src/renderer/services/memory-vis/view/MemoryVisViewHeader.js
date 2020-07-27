/** @ignore @typedef {import("@renderer/services/memory-vis/view/MemoryVisView")} MemoryVisView */
/** @ignore @typedef {import("@renderer/models/memory/Memory")} Memory */
/** @ignore @typedef {import("@renderer/models/types/Type")} Type */
/** @ignore @typedef {import("@renderer/models/types/ArrayType")} ArrayType */
/** @ignore @typedef {import("@renderer/models/types/StructType")} StructType */

const { left } = require("cli-color/move")

/** @param {Memory} memory */
function renderMemoryName(memory, uuid) {
  //TODO

  let res = $('<div class"memory-name"wrapper"></div>')
  let name = $(`<span class="memory-name">${memory.getSrc().getName()}</span>`).appendTo(res)

  
  let src = memory.getSrc()
  let declPos = src.getDeclContext().indexOf(src.getDecl())

  let source = $(`<span class="memory-name-src" id="mem${uuid}"><i class="fas fa-code"></i></span>`).prependTo(res)
  source.popover({
    title: `<i class="fas fa-at"></i><a href="#"> ${src.getRange().fromLine}:${src.getRange().fromColumn}</a>`,
    trigger: 'manual',
    html: true,
    placement: 'left',
    container: 'body',
    content: `
      <p>
        <span> ${src.getDeclContext().substring(0, declPos)}</span>
        <span class="emph"> ${src.getDecl()}</span>
        <span> ${src.getDeclContext().substring(declPos  + src.getDecl().length , src.getDeclContext().length)}</span>...
      </p>
    `,
    template: `
      <div class="popover memory-name-popover memory-name-popover-${uuid}" role="tooltip">
        <div class="arrow"></div>
        <span class="popover-header memory-name-popover-header" id="mem${uuid}"></span>
        <div class="popover-body memory-name-popover-body" id="mem${uuid}"></div>
      </div>`
  }).on("click", () => {
    source.popover('toggle')
    if ( !$(source).hasClass("opacity-50") )
      $(source).addClass("opacity-50")
    else
      $(source).removeClass("opacity-50")
  })

  //hide popover when clicking anywhere else
  $(document).click(e => {
    let exclude1 = $(source)
    let exclude2 = $(`.memory-name-popover-${uuid}`)
    if ( !$(exclude1).is(e.target) && $(exclude1).has(e.target).length === 0 && !$(exclude2).is(e.target) && $(exclude2).has(e.target).length === 0)
      source.popover('hide')
  })
  
  
    // .on("mouseover", () =>  $(source).popover('show'))
    // .on("mouseout", () => $(source).popover('hide'))

  return res
}

/** @param {Memory} memory */
function renderMemoryType(memory) {

  /** @param {Type} ty */
  function renderArrayTy(ty) {
    /** @param {Type} ty */
    function renderArrayOfBasicTypes(ty) {

    }

    /** @param {Type} ty */
    function renderArrayOfStructs(ty) {

    }
  }



  let res = $(`<span class="memory-type"></span>`)
  let tyTitle = $(`<span class="memory-type-title">ty:</span>`).appendTo(res)
  let tyVal = $(`<span class="memory-type-value"><a href="#" onclick="return false;"> ${memory.getType().toString()}</a></span>`).appendTo(res)
  tyVal.popover({
    title : "type"
  })

  return res
}

/**
 * @memberof module:memory-vis
 */
class MemoryVisViewHeader {
  static MAX_VISIBLE_NAME = 10

  /** @type {MemoryVisView}  */ #view
  /** @type {Boolean}        */ #rendered
  /** @type {JQuery}         */ #memoryName
  /** @type {JQuery}         */ #memoryType

  /**
   * @param {MemoryVisView} view 
   */
  constructor(view) {
    this.#view = view
    this.#rendered = false
  }
  
  /**
   * @returns {JQuery}
   */
  render() {
    if ( !this.isRendered()) {
      this.node = $(`
        <div class="top-bar btn-toolbar bg-light memory-vis-header" role="toolbar" aria-label="Toolbar with button groups">
        </div>`)

      this.#memoryName = renderMemoryName(this.#view.memory, this.#view.id).appendTo(this.node)
      
      this.#memoryType = renderMemoryType(this.#view.memory, this.#view.id).appendTo(this.node)

      this.#rendered = true
    }
    return this.node
  }

  
  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////

  /** @returns {Boolean} */
  isRendered() { return this.#rendered }
}

module.exports = MemoryVisViewHeader