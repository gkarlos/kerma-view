const Mode = require('@renderer/services/compute-selection/ComputeUnitSelectionMode')
const CudaIndex = require('@renderer/cuda').Index

/** @ignore @typedef {import("@renderer/cuda/CudaIndex")} CudaIndex */
/** @ignore @typedef {import("@renderer/cuda/CudaGrid")} CudaGrid */
/** @ignore @typedef {import("@renderer/cuda/CudaBlock")} CudaBlock */
/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeUnitSelectionMode").} ComputeUnitSelectionMode */

/**
 * A model for a selection of a thread or warp in a Cuda block
 * @memberof module:compute-unit-selection
 */
class ComputeSelectionModel {

  /** @type {CudaGrid} */
  #grid
  /** @type {CudaBlock} */
  #block
  /** @type {ComputeUnitSelectionMode} */
  #mode
  /** @type {Index} */
  #blockSelection
  /** @type {Index} */
  #unitSelection

  /**
   * Create a new ComputeSelectionModel
   * @param {CudaGrid} grid A Cuda grid description
   * @param {CudaBlock} block A Cuda block description
   * @param {ComputeUnitSelectionMode} [mode] 
   */
  constructor(grid, block, mode=Mode.Thread) {
    if ( !grid) throw new Error('Required argument `grid` is missing')
    if ( !block) throw new Error('Required argument `block` is missing')
    this.#grid = grid
    this.#block = block
    this.#mode = mode
    this.#blockSelection = null
    this.#unitSelection  = null
  }

  /**
   * Retrieve the grid
   * @returns {CudaGrid}
   */
  get grid() { return this.#grid}

  /** 
   * Retrieve the block 
   * @returns {CudaBlock}
   */
  get block() { return this.#block}

  /** 
   * Retrieve the mode
   * @returns {ComputeUnitSelectionMode}
   */
  get mode() { return this.#mode }
  
  /** Check if in thread mode. If so, the selected unit is a thread in the block */
  inThreadMode() { return this.#mode == Mode.Thread}

  /** Check if in warp mode. If so, the selected unit is a warp in the block */
  inWarpMode() { return this.#mode == Mode.Warp}

  /**
   * Check if there is a block currently selected
   * @returns {Boolean}
   */
  hasBlockSelected() { return this.#blockSelection != null }

  /**
   * Remove the the currently selected block
   * @returns {ComputeUnitSelectionModel}
   */
  clearSelectedBlock() { 
    this.#blockSelection = null 
    return this
  }

  /**
   * 
   * @param {CudaIndex|Number} index  
   */
  selectBlock(index) {
    /** @type {CudaIndex} */
    let idx
    if ( Number.isInteger(index)) {
      idx = CudaIndex.delinearize(index, xDim)
    } else {
      idx = index
    }
    if ( !this.#grid.hasIndex(idx))
      throw new Error(`Invalid index '${idx.toString()}'`)
    this.#blockSelection = idx
  }

  selectWarp(index) {

  }

  selectThread(index) {
    
  }

  getSelectedBlock() {

  }

  getSelectedThread() {

  }

  getSelectedWarp() {

  }

  /**
   * Select a thread
   * 
   * Multidimensional indexing is only available for threads
   * 
   * @param {Integer}  x  The x-coordinate
   * @param {Integer} [y] The y-coordinate
   * @param {Integer} [z] The z-coordinate
   * @returns {ComputeUnitSelectionModel}
   */
  select(x, y = 0, z = 0) {
    if ( x === undefined )
      throw new Error("Missing required argument `x`")
    if ( this.#mode == Mode.Warp)
      throw new Error("Multidimensional selection is only available in thread-mode")
    if ( x < 0 || x >= this.#block.x)
      throw new Error("Invalid Selection: x-value out of range")
    if ( y < 0 || y >= this.#block.y)
      throw new Error("Invalid Selection: y value out of range")
    if ( z < 0 || z >= this.#block.z)
      throw new Error("Invalid Selection: z value out of range")
    // this.#selection = new Point(x, y, z)
    return this
  }

  /**
   * Check if there is currently a selection
   * This function is usefull after the mode changed whether the selection is invalidated
   * @returns {Boolean}
   */
  hasSelection() {  }

  getSelection() { }

  /**
   * Select a thread/warp
   * @param {Integer} idx A linear index 
   */
  selectLinear(idx) {

  }

  /**
   * Change the selection mode
   * A mode
   * @param {ComputeUnitSelectionMode} mode
   */
  setMode(mode) {
    if (typeof mode !== Mode || !(mode instanceof Mode))
      throw new Error("Invalid argument type")
    if ( !this.#mode.equals(mode)) {
      this.#mode = mode
      return true
    }
    return false
  }

  /**
   * Retrieve the number of threads in a block
   * @returns {Integer}
   */
  getBlockSize() { return this.#block.size; }
}

module.exports = ComputeUnitSelectionModel