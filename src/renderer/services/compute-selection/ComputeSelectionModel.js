const Mode      = require('./ComputeSelectionMode')
const CuWarp = require('@renderer/models/cuda/CuWarp')
const CuThread = require('@renderer/models/cuda/CuThread')
const CudaIndex = require('@renderer/models/cuda').Index
const CudaBlock = require('@renderer/models/cuda').Block

/** @ignore @typedef {import("@renderer/models/cuda/CuGrid")} CuGrid */
/** @ignore @typedef {import("@renderer/models/cuda/CuLaunch")} CuLaunch */
/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelectionMode").} ComputeSelectionMode */

/**
 * A model for a selection of a thread or warp in a Cuda block
 * @memberof module:compute-selection
 */
class ComputeSelectionModel {

  /** @type {CuLaunch} */
  #launch
  /** @type {CuGrid} */
  #gridDescription
  /** @type {ComputeSelectionMode} */
  #mode
  /** @type {CudaBlock} */
  #blockSelection
  /** @type {CuWarp | CuThread} */
  #unitSelection

  /**
   * Create a new ComputeSelectionModel
   * @param {CuLaunch} launch A Cuda kernel launch
   * @param {ComputeSelectionMode} [mode] Optionally set the mode upon creation. {@link module:compute-selection.ComputeSelectionMode.Thread} by default
   */
  constructor(launch, mode=Mode.Default) {
    this.#launch = launch
    this.#gridDescription  = launch.grid
    this.#mode = mode
    
    this.selectBlockByIdx(new CudaIndex(ComputeSelectionModel.Defaults.block.x, ComputeSelectionModel.Defaults.block.y))
                    
    this.#unitSelection = null
  }

  /**
   * The grid description this selection is relevant for
   * @readonly
   * @type {CuGrid}
   */
  get grid() { return this.#gridDescription }

  // /** 
  //  * The grid description this selection is relevant for
  //  * @readonly
  //  * @returns {CudaDim}
  //  */
  // get block() { return this.grid.block }

  /** 
   * The mode of this selection. Thread or Warp
   * @readonly
   * @type {ComputeSelectionMode}
   */
  get mode() { return this.#mode }

  /**
   * The relevant Cuda kernel launch
   * @readonly
   * @type {CuLaunch}
   */
  get launch() { return this.#launch }

  /**
   * Get the grid description this selection is relevant for
   * @returns {CuGrid}
   */
  getGrid() { return this.#gridDescription }

  // /**
  //  * Get the block description this selection is relevant for
  //  * @returns {CudaBlock}
  //  */
  // getBlock() { return this.#blockDescription }

  /**
   * Get the selection mode
   * @returns {ComputeSelectionMode}
   */
  getMode() { return this.#mode }

  /**
   * Get the relevant Cuda kernel launch
   * @returns {CuLaunch}
   */
  getLaunch() { return this.#launch }

  /** 
   * @return {CudaBlock} 
   */
  getBlockSelection() { return this.#blockSelection }

  /**
   * @return {CuWarp|CuThread}
   */
  getUnitSelection() {
    return this.#unitSelection
  }

  /**
   * @returns {CuWarp}
   */
  getWarpSelection() {
    return this.inWarpMode()? this.#unitSelection : undefined
  }

  /**
   * @returns {CuThread}
   */
  getThreadSelection() {
    return this.inThreadMode()? this.#unitSelection : undefined
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
  selectBlockByIdx(index) {
    let isInteger = Number.isInteger(index)
    let isCuIndex = (index instanceof CudaIndex)
    
    if ( !(isInteger || isCuIndex))
      throw new Error(`Argument 'index' must be an Integer or a CudaIndex instance`)

    let idx = isInteger? CudaIndex.delinearize(index, this.grid.block) : index

    if ( !this.#gridDescription.hasIndex(idx))
      throw new Error(`Invalid index '${isInteger? index : index.toString()}' for Grid '${this.#gridDescription.toString(true)}'`)

    this.#blockSelection = new CudaBlock(this.grid, idx)
    return this;
  }

  /**
   * Select a warp in the selected block, by index
   * @param {CudaIndex|Number} index
   * @returns {ComputeSelectionModel} this
   */
  selectWarpWithIdx(index) {
    // this.#unitSelection = Number.isInteger(index) ? new CudaIndex(index) : index
    this.#unitSelection = this.#blockSelection.getWarp(index)
    if ( this.inThreadMode())
      this.#mode = Mode.Warp
    return this
  }

  /**
   * Select a warp in the selected block
   * @param {CuWarp} warp 
   * @returns {ComputeSelectionModel} this
   */
  selectWarp(warp) {
    if ( !(warp instanceof CuWarp))
      throw new Error('warp must be a CuWarp')
    this.#unitSelection = warp
    if ( this.inThreadMode())
      this.#mode = Mode.Warp
    return this
  }

  /**
   * Select a thread in the selected block, by index
   * @param {CudaIndex|Number} index  
   */
  selectThreadWithIdx(index) {
    this.#unitSelection = Number.isInteger(index) ? CudaIndex.delinearize(index, this.grid.block) : index
    if ( this.inWarpMode())
      this.#mode = Mode.Thread
    return this
  }

  /**
   * Select a thread in the selected block
   * @param {CuThread} thread 
   */
  selectThread(thread) {
    if ( !(thread instanceof CuThread))
      throw new Error('thread must be a CuThread')
    this.#unitSelection = thread
    if ( this.inWarpMode())
      this.#mode = Mode.Thread
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
    if ( other instanceof ComputeSelectionModel) {
      if ( !this.#launch.equals(other.launch) || !this.mode.equals(other.mode))
        return false

      if ( this.inThreadMode()) {
        if ( this.hasThreadSelected() && !other.hasThreadSelected() || !this.hasThreadSelected() && other.hasThreadSelected())
          return false        
        if ( this.hasThreadSelected())
          return this.getThreadSelection().equals(other.getThreadSelection())
      } else {
        if ( this.hasWarpSelected() && !other.hasWarpSelected() || !this.hasWarpSelected() && other.hasWarpSelected())
          return false
        if ( this.hasThreadSelected())
          return this.getWarpSelection().equals(other.getWarpSelection())
      }

      return true
    }

    return false
      // && 
      // && 
      // && ( this.inThreadMode() 
      //       ? this.hasThreadSelected() && this.getThreadSelection().equals(other.getThreadSelection())
      //       : this.hasWarpSelected() && this.getWarpSelection().equals(other.getWarpSelection()))
  }

  /**
   * Compare with another selection if both are selection for the same grid
   * Basically the same as `equals()` except that current selection and mode are not checked
   * @param {ComputeSelectionModel} other
   * @returns {Boolean} 
   */
  eql(other) {
    return ( other instanceof ComputeSelectionModel)
      && this.#launch.equals(other.launch)
  }
}

ComputeSelectionModel.Defaults = {
  block : { x : 0, y : 0}
}

module.exports = ComputeSelectionModel