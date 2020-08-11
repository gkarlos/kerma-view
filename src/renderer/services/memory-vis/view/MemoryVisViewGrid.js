/**@ignore @typedef {import("@renderer/services/memory-vis/view/MemoryVisView")} MemoryVisView */
/**@ignore @typedef {import("@renderer/models/types/ArrayType")} ArrayType */
/** @ignore @typedef {import("@renderer/models/Index")} Index */

const d3 = require('d3')

const Index = require('@renderer/models/Index')

/**
 * @memberof module:memory-vis
 */
class MemoryVisViewGrid {
  static DEFAULT_VIEWPORT = {x: 64, y: 10}
  static DEFAULT_SIZE     = 12

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

    axis: {
      y : {
        ticks : []
      },

      x : {

      }
    },

    cell : {
      sizes: [8, 10, 12, 14, 16, 20, 22, 24, 26, 28],
      sizeIdx: undefined,    // px
      get size() { return this.sizes[this.sizeIdx]},
      spacings: [2, 2, 2, 2, 2, 2, 3, 3, 3, 3,],
      get spacing() { return this.spacings[this.sizeIdx]}
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
  /** @type {d3.ScaleLinear}           */ #yScale
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

    this.Options.cell.sizeIdx = this.Options.cell.sizes.indexOf(MemoryVisViewGrid.DEFAULT_SIZE)

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

  /** @returns {Boolean} */
  isInDefaultSize() { return this.Options.cell.size === MemoryVisViewGrid.DEFAULT_SIZE }

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
    this.Options.cell.sizeIdx = (this.Options.cell.sizeIdx + 1) % this.Options.cell.sizes.length
    this._adjust()
  }

  /**
   * Decrease the size of (the cells of) the grid
   */
  decreaseSize() {
    this.Options.cell.sizeIdx = (this.Options.cell.sizeIdx - 1) % this.Options.cell.sizes.length
    this._adjust()
  }

  /**
   * Reset the grid's size to the default value
   */
  resetSize() {
    this.Options.cell.sizeIdx = this.Options.cell.sizes.indexOf(MemoryVisViewGrid.DEFAULT_SIZE)
    this._adjust()
  }

  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////

  _adjustNode() {
    this.#node.css('height', this.Options.grid.height + this.Options.grid.padding * 2)
              .css('padding-top', this.Options.grid.padding)
              .css('padding-bottom', this.Options.grid.padding)
  }

  _adjustSvg() {
    this.#svg.attr('width', this.Options.grid.width)
             .attr('height', this.Options.grid.height)
  }

  _adjustCells() {
    let self = this

    this.#cells.selectAll('rect').each( function() {
      d3.select(this)
        .attr('width', self.Options.cell.size)
        .attr('height', self.Options.cell.size)
        .attr('y', parseInt(d3.select(this).attr('pos-y')) * (self.Options.cell.size + self.Options.cell.spacing))
        .attr('x', (parseInt(d3.select(this).attr('pos-x')) + 1) * (self.Options.cell.size + self.Options.cell.spacing))
        .attr('rx', 2)
        .attr('ry', 2)
    })
  }

  _adjustYAxis() {
    let self = this
    
    let r = [Math.ceil(self.Options.cell.size / 2)]

    if ( this.Options.viewport.y === 1)
      r.push(r[0])
    else
      for ( let i = 1; i < this.Options.viewport.y; ++i)
        r.push(r[i - 1] + this.Options.cell.size + this.Options.cell.spacing)

    this.#yScale.range(r)

    this.#yAxis.attr("transform", `translate(${self.Options.cell.size + 10},0)`)
        .call(d3.axisLeft(self.#yScale)
                .tickValues(this.#yScale.domain())
                .tickFormat(d3.format("d")))
        .call(g => g.select('.domain').remove())
        .call(g => g.selectAll('.tick').select('line').remove())
                                                    
    this.#yAxis.selectAll('text').attr('font-size', `${self.Options.cell.size}px`)
                                 .style('fill', '#767676')
  }

  /** 
   * adjust the svg based on the current size options.
   * See {@link MemoryVisViewGrid#Options}
   */
  _adjust() {
    let oldWidth  = this.Options.grid.width, 
        oldHeight = this.Options.grid.height

    this.Options.grid.width  = (this.Options.viewport.x + 1) * (this.Options.cell.size + this.Options.cell.spacing)
    this.Options.grid.height = (this.Options.viewport.y * this.Options.cell.size) + (this.Options.viewport.y - 1) * this.Options.cell.spacing

    // do nothing if we are not rendered
    if ( !this.isRendered())
      return

    // do nothing if no changes
    if ( oldWidth === this.Options.grid.width && oldHeight === this.Options.grid.height)
      return

    this._adjustNode()
    this._adjustSvg()
    this._adjustCells()
    this._adjustYAxis()
  }

  _createNode() {
    this.#node = 
      $(`<div class="memory-vis-grid" id=${this.#nodeId}></div>`).appendTo(this.#view.body)
            // .css('max-height', this.Options.container.height)
            // .css('max-width', this.Options.container.width)
  }
  
  _createSvg() {
    this.#svg = 
      d3.select(this.#node[0])
        .append('svg')
        .attr('class', 'memory-vis-grid-svg')  
  }

  /**
   * Create the grid cells
   */
  _createCells() {
    this.#cells = this.#svg.append('g').attr('id', 'cells').attr('transform','translate(0, 0)')
    
    // create the cells
    for ( let i = 0; i < this.Options.viewport.y; ++i) {
      for ( let j = 0; j < this.Options.viewport.x; ++j)
        this._drawCell(this.#cells, j, i)
    }
  }

  /**
   * Create a cell in the vis' grid
   * @param {d3.Selection<SVGElement>} svg
   * @param {Number} x
   * @param {Number} y
   */
  _drawCell(svg, x, y) {
    svg.append('rect')
        .attr('pos-x', x)
        .attr('pos-y', y)
        .attr('class', 'memory-vis-cell')
  }

  /**
   * Create the yAxis of the vis
   * @param {d3.Selection<SVGElement>} yAxis 
   */
  _createYAxis() {
    this.#yAxis = this.#svg.append('g').attr('id', 'yaxis')
    if ( this.Options.viewport.y === 1)
      this.#yScale = d3.scaleLinear().domain([0,0])
    else
      this.#yScale = d3.scaleLinear().domain([...Array(this.Options.viewport.y).keys()])
  }

  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////


  /** @returns {JQuery} */
  render() {
    if ( !this.isRendered()) {
      this.#containerResizeObserver = new ResizeObserver(() => console.log("svg resized"))

      this._createNode()
      this._createSvg()
      this._createCells()
      this._createYAxis()

      // add the listener only when the svg is created to avoid
      // acting on the initial rendering of this.#node
      this.#svg.on('ready', () => observer.observe( $(this.#node)[0]))
      this.read(new Index(1,1))

      this.#rendered = true
      this._adjust()
    }
    return this.#node
  }

  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////

  /**
   * @param {Index} idx
   */
  read(idx) {
    console.log("Reading:", idx.toString())
  }


}

module.exports = MemoryVisViewGrid