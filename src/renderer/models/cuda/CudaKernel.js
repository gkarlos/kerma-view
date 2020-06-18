/** @ignore @typedef {import("@renderer/models/source/FunctionInfo")} FunctionInfo */
/** @ignore @typedef {import("@renderer/models/cuda/CudaLaunch")} CudaLaunch */

/**
 * @memberof module:cuda
 */
class CudaKernel {
  /** @type {Number} */
  #id
  /** @type {FunctionInfo} */
  #source
  /** @type {Array.<CudaLaunch>} */
  #launches

  /**
   * @param {Number} id
   * @param {FunctionInfo} source 
   */
  constructor(id,source) {
    this.#id = id
    this.#source = source
    this.#launches = []
  }

  /** @type {Number} */
  get id() { return this.#id }

  /** @type {FunctionInfo} */
  get source() { return this.#source }

  /** @type {Array.<CudaLaunch>} */
  get launches() { return this.#launches }

  equals(other) {
    return (other instanceof CudaKernel)
      && this.#id === other.id
      && this.#source.equals(other.source)
      && ((self) => {
        if ( self.#launches.length !== other.launches.length)
          return false
        for( let i = 0; i < this.#launches.length; ++i)
          if ( !self.#launches[i].equals(other.launches[i]))
            return false
        return true
      })(this)
  }
  
}

module.exports = CudaKernel