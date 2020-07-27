/** @ignore @typedef {import("@renderer/services/memory-vis/view/MemoryVisView")} MemoryVisView */
/** @ignore @typedef {import("@renderer/models/memory/Memory")} Memory */
/** @ignore @typedef {import("@renderer/models/types/Type")} Type */
/** @ignore @typedef {import("@renderer/models/types/ArrayType")} ArrayType */
/** @ignore @typedef {import("@renderer/models/types/StructType")} StructType */

/** @param {Memory} memory */
function renderMemoryName(memory) {
  //TODO

  let res = $('<div class"memory-name"wrapper"></div>')
  let name = $(`<span class="memory-name">${memory.getSrc().getName()}</span>`).appendTo(res)

  
  let src = memory.getSrc()
  let declPos = src.getDeclContext().indexOf(src.getDecl())

  let source = $(`<span class="memory-name-src"><i class="fas fa-code"></i></span>`).prependTo(res)
  source.popover({
    title: `<i class="fas fa-at"></i><strong>${src.getRange().fromLine}</strong>`,
    trigger: 'manual',
    html: true,
    content: `
      <p>${src.getDeclContext()}</p>
    `,
    template: `
      <div class="popover" role="tooltip">
        <div class="arrow"></div>
        <span class="popover-header memory-name-popover-header"></span>
        <div class="popover-body memory-name-popover-body"></div>
      </div>`
  }).on("click", () => {
    $(source).popover('toggle')
    if ( !$(source).hasClass("opacity-50") )
      $(source).addClass("opacity-50")
    else
      $(source).removeClass("opacity-50")
  })
  
  
    .on("mouseover", () =>  $(source).popover('show'))
    .on("mouseout", () => $(source).popover('hide'))

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

      this.#memoryName = renderMemoryName(this.#view.memory).appendTo(this.node)
      
      this.#memoryType = renderMemoryType(this.#view.memory).appendTo(this.node)

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