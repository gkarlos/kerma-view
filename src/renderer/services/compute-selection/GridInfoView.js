const Service = require('@renderer/services').Service
const CudaGrid = require('@renderer/cuda').Grid
const CudaBlock = require('@renderer/cuda').Block
const App = require('@renderer/app')

/**
 * Displays information about the grid
 * 
 * @memberof module:compute-unit-selection
 */
class GridInfoView {
  /**
   * @param {CudaGrid} grid A Cuda grid
   * @param {CudaBlock} block A Cuda block
   */
  constructor(grid, block) {
    this.grid = grid;
    this.block = block
    this.container = App
    this.node = undefined
  }

  setGrid(grid) {
    this.grid = grid;
    // TODO update view
  }

  setBlock(block) {
    this.block = block;
    // TODO update view
  }

  render() {
    $()
  }

  show() {

  }

  hide() {

  }
}

module.exports = GridInfoView