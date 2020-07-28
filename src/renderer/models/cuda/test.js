require('module-alias/register')
const CuGrid = require('./CuGrid')
const { CudaBlock } = require('.')

let grid = new CuGrid(10,10)

let block = grid.getBlock('asd')