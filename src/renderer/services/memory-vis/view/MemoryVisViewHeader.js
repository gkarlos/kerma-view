/** @ignore @typedef {import("@renderer/services/memory-vis/view/MemoryVisView")} MemoryVisView */
/** @ignore @typedef {import("@renderer/models/memory/Memory")} Memory */
/** @ignore @typedef {import("@renderer/models/types/Type")} Type */
/** @ignore @typedef {import("@renderer/models/types/ArrayType")} ArrayType */
/** @ignore @typedef {import("@renderer/models/types/StructType")} StructType */

const Types = require('@renderer/models/types/Types')

/** 
 * @param {Memory} memory 
 */
function renderMemorySource(memory, uuid) {

  let res = $('<div class="memory-src-wrapper" title="Source"></div>').tooltip({delay: 300})

  let src = memory.getSrc(),
      declPos = src.getDeclContext().indexOf(src.getDecl())

  let source = $(`<span class="memory-src" id="mem${uuid}"><i class="fas fa-code"></i></span>`).appendTo(res)

  source.popover({
    title: `Source @ <a href="#">${src.getRange().fromLine}:${src.getRange().fromColumn}</a>`,
    trigger: 'manual',
    placement: 'left',
    html: true,
    content: `
      <p class="memory-src-context">
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
      <div class="popover memory-src-popover memory-src-popover-${uuid}" role="tooltip">
        <div class="arrow"></div>
        <span class="popover-header memory-src-popover-header" id="mem${uuid}"></span>
        <div class="popover-body memory-src-popover-body" id="mem${uuid}"></div>
      </div>`
  })
  
  res.on("click", () => {
    source.popover('toggle')
    res.tooltip('hide')
    if ( !$(res).hasClass("active") )
      $(res).addClass("active")
    else
      $(res).removeClass("active")
  })

  //hide popover when clicking anywhere else
  $(document).click(e => {
    let exclude1 = $(source)
    let exclude2 = $(`.memory-src-popover-${uuid}`)
    if ( !$(exclude1).is(e.target) && $(exclude1).has(e.target).length === 0 && !$(exclude2).is(e.target) && $(exclude2).has(e.target).length === 0) {
      source.popover('hide')
      res.removeClass("active")
    }
  })

  return res
}

/** 
 * @param {Memory} memory 
 */
function renderMemoryName(memory, uuid) {
  let res = $('<div class="memory-name-wrapper"></div>')
  let name = $(`<span class="memory-name">${memory.getSrc().getName()}</span>`).appendTo(res)
  return res
}

/** @param {Memory} memory */
function renderMemoryType(memory, uuid) {

  let res = $(`<span class="memory-type-wrapper"></span>`)

  if ( MemoryVisViewHeader.Options.showTitles)
    $(`<span class="memory-type-title" title="Type"><i class="fas fa-font"></i></span>`)
      .appendTo(res)
      .tooltip()

  let tyVal = $(`<span class="memory-type-value"></span>`).appendTo(res)

  /** @param {Type} type */
  function renderType(type) {
    let val = type.toString()
    let res

    if ( val.length < 20) {
      res = $(`<a href="#" onclick="return false;">${val}</a>`)
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
          <pre>${type.pp(true)}</pre>
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
 * Render the number of elements in this memory
 * @param {Memory} memory
 * @returns {JQuery}
 */
function renderMemorySize(memory) {

  let res = $(`<span class="memory-size-wrapper"></span>`)
  
  // if ( MemoryVisViewHeader.Options.showTitles)
  //   $(`<span class="memory-size-title" title="dimensions"><i class="fas fa-ruler"></i></span>`).tooltip().appendTo(res)
  
  let sizeValue = $(`<span class="memory-size-value"></span>`).appendTo(res)

  if ( memory.getType().isArrayType()) {
    if ( memory.getType().getDim().is1D()) {
      sizeValue.append($(`<span class="memory-size-value-dim-value" title="x">${memory.getType().getDim().x}</span>`).tooltip({delay: 300}))
    } else if ( memory.getType().getDim().is2D()) {
      sizeValue.append($(`<span class="memory-size-value-dim-value" title="x">${memory.getType().getDim().x}</span>`).tooltip({delay: 300}))
      sizeValue.append($(`<span class="memory-size-value-dim-times"><i class="fas fa-times times"></i></span>`))
      sizeValue.append($(`<span class="memory-size-value-dim-value" title="y">${memory.getType().getDim().y}</span>`).tooltip({delay: 300}))
    } else {
      sizeValue.append($(`<span class="memory-size-value-dim-value" title="x">${memory.getType().getDim().x}</span>`).tooltip({delay: 300}))
      sizeValue.append($(`<span class="memory-size-value-dim-times"><i class="fas fa-times"></i></span>`))
      sizeValue.append($(`<span class="memory-size-value-dim-value" title="y">${memory.getType().getDim().y}</span>`).tooltip({delay: 300}))
      sizeValue.append($(`<span class="memory-size-value-dim-times"><i class="fas fa-times"></i></span>`))
      sizeValue.append($(`<span class="memory-size-value-dim-value" title="z">${memory.getType().getDim().z}</span>`).tooltip({delay: 300}))
    }
  } else {
    sizeValue.append($(`<span class="memory-size-value-dim-value">1</span>`))
  }

  return res
}

/**
 * Render the size of 
 * @param {Memory} memory 
 */
function renderMemoryTypeSize(memory) {

  let res = $(`<span class="memory-type-size-wrapper"></span>`)

  /** @type {Type} */
  let type = memory.isArray() ? memory.getType().getElementType() : memory.getType()
  
  if ( MemoryVisViewHeader.Options.showTitles)
    $(`<span class="memory-type-size-title" title="Size (bytes)"><i class="fas fa-text-width"></i></span>`).appendTo(res).tooltip()
  
  let typeSizeValue = $(`<span class="memory-type-size-value">${type.getRequiredBytes()}</span>`).appendTo(res)

  if ( !MemoryVisViewHeader.Options.showTitles)
    typeSizeValue.tooltip({title: "Width"})
  return res
}

/**
 * @returns {JQuery}
 */
function renderSeparator() {
  return $(`<div class="border-left d-sm-none d-md-block memory-vis-header-separator" style="width: 0px;"></div>`)
}

/**
 * @param {MemoryVisView} view
 * @returns {JQuery}
 */
function renderCollapseControl(view, node) {
  let res = $(`<div class="memory-vis-collapse"></div>`)
  let icon = $(`<i class="fas ${view.isCollapsed() ? 'fa-angle-double-down' : 'fa-angle-double-up'}"></i>`).appendTo(res)

  res.on("click", () => view.toggleCollapse(() => {
    icon.removeClass('fa-angle-double-down')
    icon.addClass('fa-angle-double-up')
    res.addClass('opacity-70')
  }, () => {
    icon.removeClass('fa-angle-double-up')
    icon.addClass('fa-angle-double-down')
    res.removeClass('opacity-70')
  }))

  node.dblclick( e => {
    if ( e.target === node[0]) 
      view.toggleCollapse(() => {
        icon.removeClass('fa-angle-double-down')
        icon.addClass('fa-angle-double-up')
        res.addClass('opacity-70')
      }, () => {
        icon.removeClass('fa-angle-double-up')
        icon.addClass('fa-angle-double-down')
        res.removeClass('opacity-70')
      })
  })

  return res
}


/**
 * The header of a memory visualization
 * 
 * @memberof module:memory-vis
 */
class MemoryVisViewHeader {

  static Options = {
    showTitles: true
  }

  static MAX_VISIBLE_NAME = 10

  /** @type {MemoryVisView}  */ #view
  /** @type {Boolean}        */ #rendered
  /** @type {JQuery}         */ #memorySrc
  /** @type {JQuery}         */ #memoryName
  /** @type {JQuery}         */ #memoryType
  /** @type {JQuery}         */ #memorySize
  /** @type {JQuery}         */ #memoryTypeSize
  /** @type {JQuery}         */ #collapseControl

  /** @type {JQuery}         */ node

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
        <div class="top-bar btn-toolbar card-header bg-light memory-vis-header" role="toolbar" aria-label="Toolbar with button groups">
        </div>`)

      this.#memorySrc  = renderMemorySource(this.#view.memory, this.#view.id).appendTo(this.node)
                         renderSeparator().appendTo(this.node)

      this.#memoryName = renderMemoryName(this.#view.memory, this.#view.id).appendTo(this.node)
                         renderSeparator().appendTo(this.node)
      
      this.#memorySize = renderMemorySize(this.#view.memory, this.#view.id).appendTo(this.node)
                         renderSeparator().appendTo(this.node)
                         
      this.#memoryType = renderMemoryType(this.#view.memory, this.#view.id).appendTo(this.node)
                         renderSeparator().appendTo(this.node)
      
      this.#memoryTypeSize = renderMemoryTypeSize(this.#view.memory, this.#view.id).appendTo(this.node)
                             renderSeparator().appendTo(this.node)

      this.#collapseControl = renderCollapseControl(this.#view, this.node).appendTo(this.node)

      this.#rendered = true
    }

    // console.log(this.node)

    return this.node
  }

  
  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////

  /** @returns {Boolean} */
  isRendered() { return this.#rendered }
}

module.exports = MemoryVisViewHeader