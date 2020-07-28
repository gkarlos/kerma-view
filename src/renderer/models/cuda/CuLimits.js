/** @ignore @typedef {import("@renderer/models/cuda/CuDim")} CuDim */

/** 
 * @class 
 * @memberof module:cuda
 * @hideconstructor
 */
class CuLimits {

  static cc2 = {
    
  }

  static cc6 = {

  }

  static cc7 = {

  }


  /** 
   * Size of the default runtime heap size. In bytes
   * More: {@link https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#heap-memory-allocation}
   * @type {Number} 
   */
  static defaultRuntimeHeapSize = 8 * (1 << 20) // 8M


  /** Min number of threads in the x-dimension */
  static minBlockX    = 1
  /** Max number of threads in the x-dimension */
  static maxBlockX    = 1024
  /** Min number of threads in the y-dimension */
  static minBlockY    = 1
  /** Max number of threads in the y-dimension */
  static maxBlockY    = 1024
  /** Min number of threads in the z-dimension */
  static minBlockZ    = 1
  /** Max number of threads in the z-dimension */
  static maxBlockZ    = 64
  /** Min total number of threads in a Cuda block */
  static minBlockSize = 1
  /** Max total number of threads in a Cuda block */
  static maxBlockSize = 1024

  // https://llvm.org/doxygen/NVVMIntrRange_8cpp_source.html

  /** Min number of blocks in the x-dimension */
  static minGridX = 1
  /** Max number of blocks in the x-dimension */
  static maxGridX = 0x7fffffff //TODO MaxGridX for < sm_30 is 0xffff 
  /** Min number of blocks in the y-dimension */
  static minGridY = 1
  /** Max number of blocks in the y-dimension */
  static maxGridY = 65535
  /** Min number of blocks in the z-dimension */
  static minGridZ = 1
  /** Max number of blocks in the y-dimension */
  static maxGridZ = 65535
  /** Min total number of blocks in a Cuda grid */
  static minGridSize = 1
  /** Max total number of blocks in a Cuda grid */
  static maxGridSize = 2147483647 * 65535 * 65535

  /** Size of a Cuda warp */
  static warpSize = 32

  /**
   * 
   * @param {CuDim} dim 
   */
  static validBlockDim(dim) {
    return CuLimits.validBlockDims(dim.x, dim.y, dim.z)
  }

  /**
   * 
   * @param {Integer}  x  Value of block's x-dimension
   * @param {Integer} [y] Value of block's y-dimension
   * @param {Integer} [z] Value of block's z-dimension
   */
  static validBlockDims(x, y=1, z=1) {
    if ( !x || !Number.isInteger(x) || !Number.isInteger(y) || !Number.isInteger(z)) 
      return false
    
    if ( x < CuLimits.minBlockX || x > CuLimits.maxBlockX || y < CuLimits.minBlockY || y > CuLimits.maxBlockY 
      || z < CuLimits.minBlockZ || z > CuLimits.maxBlockZ )
      return false

    let total = x * y * z
    
    if ( total < CuLimits.minBlockSize || total > CuLimits.maxBlockSize )
      return false
    
    return true
  }

  /**
   * 
   * @param {CuDim} dim 
   */
  static validGridDim(dim) {
    return CuLimits.validGridDims(dim.x, dim.y, dim.z)
  }

  /**
   * @param {Integer}  x  Value of grid's x-dimension
   * @param {Integer} [y] Value of grid's y-dimension
   * @param {Integer} [z] Value of grid's z-dimension
   */
  static validGridDims(x, y=1, z=1) {
    if ( !x || !Number.isInteger(x) || !Number.isInteger(y) || !Number.isInteger(z)) 
      return false
    
    if ( x < CuLimits.minGridX || x > CuLimits.maxGridX || y < CuLimits.minGridY || y > CuLimits.maxGridY || z < CuLimits.minGridZ || z > CuLimits.maxGridZ )
      return false

    let total = x * y * z

    if ( total < CuLimits.minGridSize || total > CuLimits.maxGridSize )
      return false
    
    return true
  }
}

module.exports = CuLimits