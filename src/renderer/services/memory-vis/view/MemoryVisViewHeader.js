/** @ignore @typedef {import("@renderer/services/memory-vis/view/MemoryVisView")} MemoryVisView */
/** @ignore @typedef {import("@renderer/models/memory/Memory")} Memory */
/** @ignore @typedef {import("@renderer/models/types/Type")} Type */
/** @ignore @typedef {import("@renderer/models/types/ArrayType")} ArrayType */
/** @ignore @typedef {import("@renderer/models/types/StructType")} StructType */

const { left } = require("cli-color/move")
const Types = require('@renderer/models/types/Types')

/** @param {Memory} memory */
function renderMemoryName(memory, uuid) {
  //TODO

  let res = $('<div class"memory-name-wrapper"></div>')
  let name = $(`<span class="memory-name">${memory.getSrc().getName()}</span>`).appendTo(res)

  
  let src = memory.getSrc()
  let declPos = src.getDeclContext().indexOf(src.getDecl())

  let source = $(`<span class="memory-name-src" id="mem${uuid}"><i class="fas fa-code"></i></span>`).prependTo(res)
  source.popover({
    title: `Source @ <a href="#">${src.getRange().fromLine}:${src.getRange().fromColumn}</a>`,
    trigger: 'manual',
    html: true,
    placement: 'left',
    container: 'body',
    content: `
      <p class="memory-name-context">
        <span class="line">
          <span class="line-number">${src.getRange().fromLine - 1}</span> 
          <span class="implied-content"> ...</span>
        </span>
        <span class="line line-emph">
          <span class="line-number line-number-highlighted">${src.getRange().fromLine}</span> 
          <span class="line-content">${src.getDeclContext().substring(0, declPos)}</span>
          <span class="line-content emph"> ${src.getDecl()}</span>
          <span class="line-content"> 
            ${src.getDeclContext().substring(declPos  + src.getDecl().length , src.getDeclContext().length)}
          </span>
        </span>
        <span class="line">
          <span class="line-number">${src.getRange().fromLine + 1}</span>
          <span class="implied-content"> ...</span>
        </span>
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
    if ( !$(exclude1).is(e.target) && $(exclude1).has(e.target).length === 0 && !$(exclude2).is(e.target) && $(exclude2).has(e.target).length === 0) {
      source.popover('hide')
      source.removeClass("opacity-50")
    }
  })

  return res
}

/** @param {Memory} memory */
function renderMemoryType(memory, uuid) {

  let res = $(`<span class="memory-type-wrapper"></span>`)

  let tyTitle = $(`
    <span class="memory-type-title">
      
    </span>`).appendTo(res)

  let tyVal = $(`<span class="memory-type-value"></span>`).appendTo(res)

  /** @param {Type} type */
  function renderType(type) {
    let val = Types.pp(type)
    let res

    if ( val.length < 20) {
      res = $(`<a href="#" onclick="return false;">${type.toString()}</a>`)
    } else {
      if ( type.isStructType()) {
        res = $(`<a href="#" onclick="return false">{...}</a>`)
      } else {
        res = $(`<a href="#" onclick="return false">...</a>`)
      }
    }

    res.popover({
      title: "Type",
      html: true,
      trigger: 'manual',
      container: 'body',
      content: `
        <div class="memory-type-content">
          <pre>${Types.pp(type)}</pre>
        </div>
      `,
      template: `
      <div class="popover memory-type-popover-${uuid}" role="tooltip">
        <div class="arrow"></div>
        <span class="popover-header memory-type-popover-header"></span>
        <div class="popover-body memory-type-popover-body"></div>
      </div>`
    })

    res.on('click', () => {
      res.popover('toggle')
    })
    
    //hide popover when clicking anywhere else
    $(document).click(e => {
      let exclude1 = $(res)
      let exclude2 = $(`.memory-type-popover-${uuid}`)
      if ( !$(exclude1).is(e.target) && $(exclude1).has(e.target).length === 0 && !$(exclude2).is(e.target) && $(exclude2).has(e.target).length === 0)
        res.popover('hide')
    })

    return res
  }

  let typeToRender = memory.getType()

  if ( memory.isArray())
    typeToRender = memory.getType().getElementType()
  
  renderType(typeToRender).appendTo(tyVal)


  return res
}

/** 
 * @param {Memory} memory
 * @returns {JQuery}
 */
function renderMemorySize(memory) {

  let res = $(`<span class="memory-size-wrapper"></span>`)
  // let sizeTitle = $(`<span class="memory-size-title"></span>`).appendTo(res)
  let sizeValue = $(`<span class="memory-size-value"></span>`).appendTo(res)

  if ( memory.getType().isArrayType()) {
    if ( memory.getType().getDim().is1D()) {
      sizeValue.append($(`<span class="memory-size-value-dim-value" title="x-dim">${memory.getType().getDim().x}</span>`))
    } else if ( memory.getType().getDim().is2D()) {
      sizeValue.append($(`<span class="memory-size-value-dim-value" title="x-dim">${memory.getType().getDim().x}</span>`))
      sizeValue.append($(`<span><i class="fas fa-times times"></i></span>`))
      sizeValue.append($(`<span class="memory-size-value-dim-value" title="y-dim">${memory.getType().getDim().y}</span>`))
    } else {
      sizeValue.append($(`<span class="memory-size-value-dim-value" title="x-dim">${memory.getType().getDim().x}</span>`))
      sizeValue.append($(`<span class="memory-size-value-times><i class="fas fa-times"></i></span>`))
      sizeValue.append($(`<span class="memory-size-value-dim-value" title="y-dim">${memory.getType().getDim().y}</span>`))
      sizeValue.append($(`<span class="memory-size-value-times><i class="fas fa-times"></i></span>`))
      sizeValue.append($(`<span class="memory-size-value-dim-value" title="z-dim">${memory.getType().getDim().z}</span>`))
    }
  } else {
    sizeValue.append($(`<span class="memory-size-value-dim-value">1</span>`))
  }

  return res
}

/**
 * @returns {JQuery}
 */
function renderSeparator() {
  return $(`<div class="border-left d-sm-none d-md-block memory-vis-header-separator" style="width: 0px;"></div>`)
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
  /** @type {JQuery}         */ #memorySize

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
                         renderSeparator().appendTo(this.node)
      
      this.#memorySize = renderMemorySize(this.#view.memory, this.#view.id).appendTo(this.node)
                         renderSeparator().appendTo(this.node)
                         
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