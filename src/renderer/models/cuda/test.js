require('module-alias/register')
const CudaGrid = require('./CudaGrid')
const { CudaBlock } = require('.')

let grid = new CudaGrid(10,10)

let block = grid.getBlock('asd')