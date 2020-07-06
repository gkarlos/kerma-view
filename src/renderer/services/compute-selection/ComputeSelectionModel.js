const Mode = require('./ComputeSelectionMode')
const CudaIndex = require('@renderer/models/cuda').Index
const CudaBlock = require('@renderer/models/cuda').Block

/** @ignore @typedef {import("@renderer/models/cuda/CudaGrid")} CudaGrid */
/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelectionMode").} ComputeSelectionMode */




/**
 * A model for a selection of a thread or warp in a Cuda block
 * @memberof module:compute-selection
 */
class ComputeSelectionModel {

  /** @type {CudaGrid} */
  #gridDescription
  /** @type {CudaBlock} */
  #blockDescription
  /** @type {ComputeSelectionMode} */
  #mode
  /** @type {CudaIndex} */
  #blockSelection
  /** @type {CudaIndex} */
  #unitSelection

  /**
   * Create a new ComputeSelectionModel
   * @param {CudaGrid} grid A Cuda grid description
   * @param {CudaBlock} block A Cuda block description
   * @param {ComputeSelectionMode} [mode] Optionally set the mode upon creation. {@link module:compute-selection.ComputeSelectionMode.Thread} by default
   */
  constructor(grid, block, mode=Mode.Default) {
    // if ( !grid) throw new Error('Required argument `grid` is missing')
    // if ( !block) throw new Error('Required argument `block` is missing')
    this.#gridDescription  = grid
    this.#blockDescription = block
    this.#mode = mode
    
    this.selectBlock(new CudaIndex(ComputeSelectionModel.Defaults.blockX, ComputeSelectionModel.Defaults.blockY))
                    
    this.#unitSelection  = null
  }

  /**
   * The grid description this selection is relevant for
   * @readonly
   * @returns {CudaGrid}
   */
  get grid() { return this.#gridDescription }

  /** 
   * The grid description this selection is relevant for
   * @readonly
   * @returns {CudaBlock}
   */
  get block() { return this.#blockDescription }

  /** 
   * The mode of this selection. Thread or Warp
   * @readonly
   * @type {ComputeSelectionMode}
   */
  get mode() { return this.#mode }

  /**
   * Get the grid description this selection is relevant for
   * @returns {CudaGrid}
   */
  getGrid() { return this.#gridDescription }

  /**
   * Get the block description this selection is relevant for
   * @returns {CudaBlock}
   */
  getBlock() { return this.#blockDescription }

  /**
   * Get the selection mode
   * @returns {ComputeSelectionMode}
   */
  getMode() { return this.#mode }

  /** 
   * @return {CudaBlock} 
   */
  getBlockSelection() { return this.#blockSelection }

  getUnitSelection() {
    //TODO
  }

  getWarpSelection() {
    //TODO
  }

  getThreadSelection() {
    //TODO
  }

  /** 
   * Check if in thread mode. If so, the selected unit is a thread in the block
   * @returns {Boolean}
   */
  inThreadMode() { 
    return this.#mode.equals(Mode.Thread)
  }

  /** 
   * Check if in warp mode. If so, the selected unit is a warp in the block
   * @returns {Boolean}
   */
  inWarpMode() { 
    return this.#mode.equals(Mode.Warp)
  }

  /**
   * Check if there is a block currently selected
   * @returns {Boolean}
   */
  hasBlockSelected() { 
    return this.#blockSelection != null
  }

  /**
   * Check if there is a warp currently selected
   * @returns {Boolean}
   */
  hasWarpSelected() { 
    return this.#unitSelection != null && this.inWarpMode() 
  }

  /**
   * Check if there is a thread currently selected
   * @returns {Boolean}
   */
  hasThreadSelected() { 
    return this.#unitSelection != null && this.inThreadMode()
  }

  /**
   * Remove the the currently selected block
   * @returns {ComputeUnitSelectionModel}
   */
  clearBlockSelection() { 
    this.#blockSelection = null 
    return this
  }

  clearUnitSelection() {
    this.#unitSelection = null
    return this
  }

  /**
   * Select a block from the grid
   * @param {CudaIndex|Number} index  
   */
  selectBlock(index) {
    let isInteger = Number.isInteger(index)
    let isCuIndex = (index instanceof CudaIndex)
    
    if ( !(isInteger || isCuIndex))
      throw new Error(`Argument 'index' must be an Integer or a CudaIndex instance`)

    let idx = isInteger? CudaIndex.delinearize(index, this.#blockDescription.dim) : index

    if ( !this.#gridDescription.hasIndex(idx))
      throw new Error(`Invalid index '${isInteger? index : index.toString()}' for Grid '${this.#gridDescription.toString(true)}'`)

    this.#blockSelection = new CudaBlock(this.#blockDescription.dim, idx)
    return this;
  }

  /**
   * Select a warp in the selected block
   * @param {CudaIndex|Number} index  
   */
  selectWarp(index) {
    this.#unitSelection = Number.isInteger(index) ? new CudaIndex(index) : index
    if ( this.inThreadMode())
      this.#mode = Mode.Warp
    return this
  }

  /**
   * Select a thread in the selected block
   * @param {CudaIndex|Number} index  
   */
  selectThread(index) {
    this.#unitSelection = Number.isInteger(index) ? CudaIndex.delinearize(index, this.#blockDescription.dim) : index
    if ( this.inWarpMode())
      this.#mode = Mode.Thread
    return this
  }

  /**
   * Select a compute unit from the block (wapr/thread)
   * @param {CudaIndex} index 
   * @param {ComputeUnitSelectionMode} [mode] Choose the Selection mode. If present the current mode is overriden
   * @returns {ComputeSelectionModel} this
   */
  selectUnit(index, mode=null) {
    if ( mode != null && (mode instanceof ComputeUnitSelectionMode))
      this.#mode = mode
    return this.inWarpMode()? this.selectWap(index) : this.selectThread(index)
  }

  /**
   * Retrieve the selected block
   * @returns {CudaIndex}
   */
  getBlockSelection() { 
    return this.#blockSelection
  }

  /** 
   * Retrieve the selected warp index if a warp selection has been made. `null` otherwise
   * @returns {CudaIndex} 
   */
  getWarpSelection() { 
    return this.inWarpMode()? this.#unitSelection : null
  }

  /** 
   * Retrieve the selected thread index if a thread selection has been made. `null` otherwise
   * @returns {CudaIndex} 
   */
  getThreadSelection() { 
    return this.inThreadMode()? this.#unitSelection : null
  }

  /** 
   * Retrieve the selected warp index if a warp selection has been made. `null` otherwise
   * @returns {CudaIndex} 
   */
  getSelection() { 
    return this.inWarpMode()? this.#unitSelection : null
  }

  /**
   * Change the selection mode. If a different mode is passed, the current unit-selection is invalidated
   * @param {ComputeUnitSelectionMode} mode A selection mode
   * @returns {Boolean} `true` if the mode is changed. `false` otherwise
   */
  setMode(mode) {
    if ( !this.#mode.equals(mode)) {
      this.#mode = mode
      this.clearUnitSelection()
      return true
    }
    return false
  }

  /**
   * Compare with another ComputeSelectionModel for equality
   * @param {ComputeSelectionModel} other
   * @returns {Boolean}
   */
  equals(other) {
    return ( other instanceof ComputeSelectionModel)
      && this.grid.equals(other.grid)
      && this.block.equals(other.block)
      && this.mode === other.mode
      && ( this.inThreadMode() 
            ? this.hasThreadSelected() && this.getThreadSelection().equals(other.getThreadSelection())
            : this.hasWarpSelected() && this.getWarpSelection().equals(other.getWarpSelection()))
  }

  /**
   * Compare with another selection if both are selection for the same launch parameters (grid/block)
   * Basically the same as `equals()` except that current selection and mode are not checked
   * @param {ComputeSelectionModel} other
   * @returns {Boolean} 
   */
  eql(other) {
    return ( other instanceof ComputeSelectionModel)
      && this.grid.equals(other.grid)
      && this.block.equals(other.block)
      && this.mode === other.mode
  }
}

ComputeSelectionModel.Defaults = {
  blockX : 0,
  blockY : 0
}

module.exports = ComputeSelectionModel