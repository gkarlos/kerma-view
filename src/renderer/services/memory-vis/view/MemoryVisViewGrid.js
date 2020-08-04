/**@ignore @typedef {import("@renderer/services/memory-vis/view/MemoryVisView")} MemoryVisView */
/**@ignore @typedef {import("@renderer/models/types/ArrayType")} ArrayType */

const d3 = require('d3')
const { ResizeObserver } = require('resize-observer')

/**
 * @memberof module:memory-vis
 */
class MemoryVisViewGrid {
  static DEFAULT_VIEWPORT = {x: 'auto', y: 'auto'}
  static DEFAULT_SIZE     = 20

  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////

  Options = {
    viewport: {
      x: 100, 
      y: 20,
    },

    grid : {
      padding: 5
    },

    cell : {
      sizes: [10, 15, 20, 25, 30, 35],
      size: 15,   // px
      spacing: 2  // px
    },
    
    
  }

  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////

  /** @type {MemoryVisView} */ #view
  /** @type {Boolean}       */ #rendered
  /** @type {JQuery}        */ #node
  /** @type {JQuery}        */ #nodeId
  /** @type {JQuery}        */ #wrapper

  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////

  /**
   * @param {MemoryVisView} view 
   */
  constructor(view) {
    this.#view = view
    this.#rendered = false
    this.#nodeId = `grid-${this.#view.id}`

    if ( view.model.getMemory().isArray()) {
      /** @type {ArrayType} */
      let ty = view.model.getMemory().getType()
      this.Options.viewport.x = Math.min(ty.getDim().x, this.Options.viewport.x)
      this.Options.viewport.y = Math.min(ty.getDim().y, this.Options.viewport.y)
    }
  }

  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////

  
  /** @returns {Boolean} */
  isRendered() { return this.#rendered }

  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////

  incraseSize() {
    //TODO
  }

  decreaseSize() {
    //TODO
  }

  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////

  _computeRequiredWidth() {
    this.Options.viewport.x = Math.floor(this.Options.viewport.xMax)
  }
  
  _drawSvg() {
    let w = this.Options.viewport.x * (this.Options.cell.size + this.Options.cell.spacing)
    let h = this.Options.viewport.y * (this.Options.cell.size + this.Options.cell.spacing)

    console.log(`svg.size: ${w}x${h} for memory: ${this.#view.model.getMemory().toString()}`)

    return d3.select(this.#node[0])
             .style('position', 'relative')
             .append('svg')
             .style('overflow', 'auto')
             .attr('class', 'memory-vis-grid-svg')
             .style('width', w)
             .style('height', h)
  }

  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////


  /** @returns {JQuery} */
  render() {
    if ( !this.isRendered()) {
      this.#node = $(`<div class="memory-vis-grid" id=${this.#nodeId}></div>`).appendTo(this.#view.body)

      $(document).ready(() => {
        console.log($(this.#view.body).width())
        console.log($(this.#node).width())
      })

      let svg = this._drawSvg()

      let observer = new ResizeObserver(() => console.log("svg resized"))

      // add the listener only when the svg is created to avoid
      // acting on the initial rendering of this.#node
      svg.on('ready', () => observer.observe( $(this.#node)[0]))
      
      new SimpleBar($(`.memory-vis-grid-svg`)[0])

      let cells = svg.append('g').attr('id', 'cells')
                   
      for ( let i = 0; i < this.Options.viewport.y; ++i)
        for ( let j = 0; j < this.Options.viewport.x; ++j)
          svg.append('rect').attr('y', i * this.Options.cell.size + this.Options.cell.spacing)
                              .attr('x', j * this.Options.cell.size + this.Options.cell.spacing)
                              .attr('rx', 2)
                              .attr('ry', 2)
                              .attr('width', this.Options.cell.size)
                              .attr('height', this.Options.cell.size)
                              .attr('stroke', 'black')
                              .attr('fill', 'transparent')



      // console.log(this.svg.node().parentElement.style.width)
      this.#rendered = true
    }
    return this.#node
  }



}

module.exports = MemoryVisViewGrid