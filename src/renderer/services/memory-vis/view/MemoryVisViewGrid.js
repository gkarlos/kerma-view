/**@ignore @typedef {import("@renderer/services/memory-vis/view/MemoryVisView")} MemoryVisView */
/**@ignore @typedef {import("@renderer/models/types/ArrayType")} ArrayType */

const d3 = require('d3')
const { ResizeObserver } = require('resize-observer')

/**
 * @memberof module:memory-vis
 */
class MemoryVisViewGrid {
  static DEFAULT_VIEWPORT = {x: 64, y: 10}
  static DEFAULT_SIZE     = 20

  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////

  Options = {
    container: {
      width: '100%',
      height: '300px'
    },

    viewport: {
      x: MemoryVisViewGrid.DEFAULT_VIEWPORT.x,
      y: MemoryVisViewGrid.DEFAULT_VIEWPORT.y
    },

    grid : {
      padding: 10,
      width: undefined,
      height: undefined
    },

    cell : {
      sizes: [8, 10, 12, 14, 16, 20, 22, 24, 26, 28],
      sizeIdx: 2,    // px
      get size() { return this.sizes[this.sizeIdx]},
      spacing: 3  // px
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
  /** @type {d3.Selection<SVGElement>} */ #svg
  /** @type {d3.Selection<SVGElement>} */ #cells
  /** @type {d3.Selection<SVGElement>} */ #yAxis
  /** @type {ResizeObserver} */ #containerResizeObserver

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
    console.log(this.Options.cell.size)
  }

  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////

  
  /** @returns {Boolean} */
  isRendered() { return this.#rendered }

  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////

  /** 
   * Check if size can be increased further
   * @returns {Boolean}
   */
  canIncreaseSize() { return this.Options.cell.sizeIdx < this.Options.cell.sizes.length - 1}

  /**
   * Check if size can be decreased further 
   * @returns {Boolean}
   */
  canDecreaseSize() { return this.Options.cell.sizeIdx > 0 }

  /**
   * Retrieve the current size. The value returned corresponds
   * to the size of the cells of the grid, in px 
   * @returns Number 
   */
  getSize() { return this.Options.cell.size }

  /**
   * Increase the size of (the cells of) the grid
   */
  increaseSize() {
    //TODO
    this.Options.cell.sizeIdx = (this.Options.cell.sizeIdx + 1) % this.Options.cell.sizes.length
    this._resize()
  }

  /**
   * Decrease the size of (the cells of) the grid
   */
  decreaseSize() {
    this.Options.cell.sizeIdx = (this.Options.cell.sizeIdx - 1) % this.Options.cell.sizes.length
    this._resize()
  }

  /**
   * Reset the grid's size to the default value
   */
  resetSize() {
    //TODO
  }

  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////

  /** 
   * Resize the svg based on the current size options.
   * See {@link MemoryVisViewGrid#Options}
   */
  _resize() {

    let oldWidth = this.Options.grid.width, oldHeight = this.Options.grid.height

    this.Options.grid.width  = (this.Options.viewport.x + 1) * (this.Options.cell.size + this.Options.cell.spacing) + 3 * this.Options.grid.padding
    this.Options.grid.height = this.Options.viewport.y * (this.Options.cell.size + this.Options.cell.spacing) + 3 * this.Options.grid.padding

    // do nothing if we are not rendered
    if ( !this.isRendered())
      return

    // do nothing if no changes
    if ( oldWidth === this.Options.grid.width && oldHeight === this.Options.grid.height)
      return

    let self = this

    // resize wrapper
    this.#node.height(parseInt(this.#svg.attr('height')))

    // resize the svg
    this.#svg.attr('width', this.Options.grid.width)
             .attr('height', this.Options.grid.height)
    
    // resize text
    this.#svg.selectAll('text').each(function() { 
      let label = d3.select(this)
      label
        .attr('y', self.Options.grid.padding + parseInt(label.attr('pos-y')) * (self.Options.cell.size + self.Options.cell.spacing))
        .attr('font-size',  `${self.Options.cell.size}px`)
    })

    // resize cells
    this.#svg.selectAll('rect').each( function(d){
      let newX = (d3.select(this).attr('pos-x') + 1) * (self.Options.cell.size + self.Options.cell.spacing)
      let newY = d3.select(this).attr('pos-y') * (self.Options.cell.size + self.Options.cell.spacing)
      d3.select(this).attr('width', self.Options.cell.size)
                     .attr('height', self.Options.cell.size)
                     .attr('y', 2 + parseInt(d3.select(this).attr('pos-y')) * (self.Options.cell.size + self.Options.cell.spacing))
                     .attr('x', (parseInt(d3.select(this).attr('pos-x')) + 1) * (self.Options.cell.size + self.Options.cell.spacing))
    })
  }

  _computeRequiredWidth() {
    this.Options.viewport.x = Math.floor(this.Options.viewport.xMax)
  }

  _renderNode() {
    return $(`<div class="memory-vis-grid" id=${this.#nodeId}></div>`)
            .appendTo(this.#view.body)
            // .css('max-height', this.Options.container.height)
            // .css('max-width', this.Options.container.width)
  }
  
  _drawSvg() {
    let w = (this.Options.viewport.x + 1) * 
            (this.Options.cell.sizes[this.Options.cell.sizes.length -1] + this.Options.cell.spacing) + 3 * this.Options.grid.padding
    let h = this.Options.viewport.y * 
            (this.Options.cell.sizes[this.Options.cell.sizes.length -1] + this.Options.cell.spacing) + 3 * this.Options.grid.padding

    let vw = (this.Options.viewport.x + 1) * 
             (this.Options.cell.size + this.Options.cell.spacing) + 3 * this.Options.grid.padding,
        vh = this.Options.viewport.y * 
             (this.Options.cell.size + this.Options.cell.spacing) + 3 * this.Options.grid.padding

    console.log(`svg.size: ${w}x${h} for memory: ${this.#view.model.getMemory().toString()}`)

    return d3.select(this.#node[0])
             .style('position', 'relative')
             .append('svg')
             .attr('width', vw)
             .attr('height', vh)
            //  .attr('viewbox', `0 0 ${this.Options.viewport.x} ${this.Options.viewport.y}`)
             .attr('class', 'memory-vis-grid-svg')
             .style('padding', '10px')
             .style('display', 'block')
             .style('overflow', 'auto')
             
  }

  /**
   * @param {d3.Selection<SVGElement>} svg
   * @param {Number} x
   * @param {Number} y
   */
  _drawCell(svg, x, y) {
    svg.append('rect').attr('y', 2 + y * (this.Options.cell.size + this.Options.cell.spacing))
        .attr('x', (x + 1) * (this.Options.cell.size + this.Options.cell.spacing))
        .attr('rx', 2)
        .attr('ry', 2)
        .attr('pos-x', x)
        .attr('pos-y', y)
        .attr('width', this.Options.cell.size)
        .attr('height', this.Options.cell.size) 
        .attr('class', 'memory-vis-cell')
  }

  /**
   * @param {d3.Selection<SVGElement>} yAxis 
   */
  _drawYAxis(yAxis) {
    for ( let i = 0; i < this.Options.viewport.y; ++i)
      yAxis.append('text').text(i)
           .attr('x', 0)
           .attr('pos-y', i)
           .attr('pos-x', 0)
           .attr('y', this.Options.grid.padding + i * (this.Options.cell.size + this.Options.cell.spacing))
           .attr('font-size',  `${this.Options.cell.size}px`)
  }

  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////


  /** @returns {JQuery} */
  render() {
    if ( !this.isRendered()) {
      this.#containerResizeObserver = new ResizeObserver(() => console.log("svg resized"))

      this.#node = this._renderNode()

      $(document).ready(() => {
        console.log($(this.#view.body).width())
        console.log($(this.#node).width())
      })

      this.#svg = this._drawSvg()

      // add the listener only when the svg is created to avoid
      // acting on the initial rendering of this.#node
      this.#svg.on('ready', () => observer.observe( $(this.#node)[0]))


      this.#yAxis = this.#svg.append('g')
      this.#cells = this.#svg.append('g').attr('id', 'cells').attr('transform','translate(0, 0)')
    
      // create the cells
      for ( let i = 0; i < this.Options.viewport.y; ++i) {
        for ( let j = 0; j < this.Options.viewport.x; ++j)
          this._drawCell(this.#svg, j, i)
      }

      this._drawYAxis(this.#yAxis)

      this.#rendered = true
    }
    return this.#node
  }



}

module.exports = MemoryVisViewGrid