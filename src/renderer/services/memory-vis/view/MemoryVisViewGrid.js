/**@ignore @typedef {import("@renderer/services/memory-vis/view/MemoryVisView")} MemoryVisView */
/**@ignore @typedef {import("@renderer/models/types/ArrayType")} ArrayType */
/** @ignore @typedef {import("@renderer/models/Idx")} Index */

const d3 = require('d3')

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
    container: { width: '100%', height: '300px' },

    viewport: {
      x: MemoryVisViewGrid.DEFAULT_VIEWPORT.x,
      y: MemoryVisViewGrid.DEFAULT_VIEWPORT.y,
      range: {
        x: { lo: 0, hi: MemoryVisViewGrid.DEFAULT_VIEWPORT.x },
        y: { lo: 0, hi: MemoryVisViewGrid.DEFAULT_VIEWPORT.y }
      },
    },

    grid : {
      padding: 10,
      width: undefined,
      height: undefined
    },

    axis: {
      tickEvery: 8
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
  /** @type {String}        */ #nodeId
  /** @type {JQuery}        */ #wrapper
  /** @type {d3.Selection<SVGElement>} */ #svg
  /** @type {d3.Selection<SVGElement>} */ #cells
  /** @type {d3.Selection<SVGElement>} */ #yAxis
  /** @type {d3.Selection<SVGElement>} */ #xAxis
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

    // if ( view.model.getMemory().isArray()) {
    //   /** @type {ArrayType} */
    let ty = view.model.getMemory().getType()
    this.Options.viewport.x = Math.min(ty.getDim().x, this.Options.viewport.x)
    this.Options.viewport.y = Math.min(ty.getDim().y, this.Options.viewport.y)
    this.Options.viewport.range.x.hi = this.Options.viewport.x
    this.Options.viewport.range.y.hi = this.Options.viewport.y
    // } else {
    //   this.Options.viewport.x = 1
    //   this.Options.viewport.y = 1
    // }
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

  
  /**
   * @returns {Number[]}
   */
  getXRange() {
    return [this.Options.viewport.range.x.lo, this.Options.viewport.range.x.hi];
  }

  /** 
   * @returns {Number[]}
   */
  getYRange() {
    return [this.Options.viewport.range.y.lo, this.Options.viewport.range.y.hi];
  }

  /**
   * Shift the grid to the right
   * The amount is deterined by `Options.viewport.x`
   * @returns {MemoryVisViewGrid}
   */
  right() {
    let ty = this.#view.model.getMemory().getType()
    if ( ty.getDim().x > this.Options.viewport.range.x.hi) { //can mode right
      this.Options.viewport.range.x.lo += this.Options.viewport.x;
      this.Options.viewport.range.x.hi = 
        Math.min(this.Options.viewport.range.x.hi + this.Options.viewport.x, ty.getDim().x)
      if ( this.isRendered())
        this._adjust();
    }
    return this
  }

  /**
   * Shift the grid to the left
   * The amount is determined by `Options.viewport.x`
   * @returns {MemoryVisViewGrid}
   */
  left() {
    let ty = this.#view.model.getMemory().getType()
    if ( this.Options.viewport.range.x.lo > 0) { //can move left
      this.Options.viewport.range.x.lo -= this.Options.viewport.x;
      if ( this.Options.viewport.range.x.hi === ty.getDim().x)
        this.Options.viewport.range.x.hi -= Math.floor(ty.getDim().x % this.Options.viewport.x)
      else
        this.Options.viewport.range.x.hi -= this.Options.viewport.x;
      if ( this.isRendered())
        this._adjust();
    }
    return this;
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
        .attr('y', (parseInt(d3.select(this).attr('pos-y')) + 1) * (self.Options.cell.size + self.Options.cell.spacing))
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

    this.#yAxis.attr("transform", `translate(${self.Options.cell.size + 10},${self.Options.cell.size + self.Options.cell.spacing})`)
        .call(d3.axisLeft(self.#yScale)
                .tickValues(this.#yScale.domain())
                .tickFormat(d3.format("d")))
        .call(g => g.select('.domain').remove())
        .call(g => g.selectAll('.tick').select('line').remove())
                                                    
    this.#yAxis.selectAll('text').attr('font-size', `${Math.max(self.Options.cell.size - 5, 7)}px`)
                                 .style('fill', '#767676')
  }

  _adjustXAxis() {
    let self = this
    // this.#xAxis.attr("transform", `translate(0,0)`)
    this.#xAxis.selectAll('text').each( function(d, i, nodes) {
        d3.select(nodes[i])
          .text(self.Options.viewport.range.x.lo + (i + 1) * self.Options.axis.tickEvery)
          .attr('x', (self.Options.cell.size + self.Options.cell.spacing) 
                    + parseInt(d3.select(nodes[i]).attr('pos')) * self.Options.axis.tickEvery * (self.Options.cell.size + self.Options.cell.spacing))
          .attr('font-size', `${Math.max(self.Options.cell.size - 5, 7)}px`)
          .attr('text-align', 'center')
          .attr('y', self.Options.cell.size)
          .style('fill', '#767676')
    })
  }

  /** 
   * adjust the svg based on the current size options.
   * See {@link MemoryVisViewGrid#Options}
   */
  _adjust() {
    let oldWidth  = this.Options.grid.width, 
        oldHeight = this.Options.grid.height

    this.Options.grid.width  = (this.Options.viewport.x + 1) * (this.Options.cell.size + this.Options.cell.spacing)
    // this.Options.grid.height = ((this.Options.viewport.y + 1) * this.Options.cell.size) + (this.Options.viewport.y) * this.Options.cell.spacing
    this.Options.grid.height  = (this.Options.viewport.y + 1) * (this.Options.cell.size + this.Options.cell.spacing)   

    // do nothing if we are not rendered
    if ( !this.isRendered())
      return

    // do nothing if no changes
    // if ( oldWidth !== this.Options.grid.width || oldHeight !== this.Options.grid.height) {}
    //   return

    this._adjustNode()
    this._adjustSvg()
    this._adjustCells()
    this._adjustXAxis()
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
    this.#cells = this.#svg.append('g').attr('id', `${this.#nodeId}-cells`).attr('transform','translate(0, 0)')
    
    // create the cells
    for ( let i = 0; i < this.Options.viewport.y; ++i) {
      for ( let j = 0; j < this.Options.viewport.x; ++j)
        this._createCell(this.#cells, j, i)
    }
  }

  /**
   * Create a cell in the vis' grid
   * @param {d3.Selection<SVGElement>} svg
   * @param {Number} x
   * @param {Number} y
   */
  _createCell(svg, x, y) {
    let self = this
    svg.append('rect')
        .attr('pos-x', x)
        .attr('pos-y', y)
        .attr('class', 'memory-vis-cell')
        .on('mouseover', () => {
          self.#view.toolbar.tooltip.contents(`<span class="grid-tooltip-text">${self.Options.viewport.range.y.lo + y},${self.Options.viewport.range.x.lo + x}</span>`)
          self.#view.toolbar.tooltip.show()
        })
        .on('mouseout', () => self.#view.tooltip.hide())
  }

  /**
   * Create the yAxis of the vis
   */
  _createYAxis() {
    this.#yAxis = this.#svg.append('g').attr('id', `${this.#nodeId}-yaxis`)
    if ( this.Options.viewport.y === 1)
      this.#yScale = d3.scaleLinear().domain([0,0])
    else
      this.#yScale = d3.scaleLinear().domain([...Array(this.Options.viewport.y).keys()])
  }

  /**
   * Create the yAxis of the vis 
   */
  _createXAxis() {
    let self = this
    this.#xAxis = this.#svg.append('g').attr('id', `${this.#nodeId}-xaxis`)

    let numTicks = this.Options.viewport.x / this.Options.axis.tickEvery - 1;

    for ( let i = 0; i < numTicks; ++i )
      this.#xAxis.append('text').attr('pos', i + 1)

    this.#xAxis.selectAll('text').attr('font-size', `${self.Options.cell.size}px`)
               .style('fill', '#767676')
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
      this._createXAxis()
      this._createYAxis()

      // add the listener only when the svg is created to avoid
      // acting on the initial rendering of this.#node
      this.#svg.on('ready', () => observer.observe( $(this.#node)[0]))

      let Index = require('@renderer/models/Idx')
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