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
  /** @type {String} */
  #color

  /**
   * @param {Number} id
   * @param {FunctionInfo} source 
   */
  constructor(id,source) {
    this.#id = id
    this.#source = source || null
    this.#launches = []
  }

  /** @type {Number} */
  get id() { return this.#id }

  /** @type {FunctionInfo} */
  get source() { return this.#source }

  /** @type {String} */
  get name() { return this.#source.name }

  /** @type {Array.<CudaLaunch>} */
  get launches() { return this.#launches }

  /** @type {String} */
  get color() { return this.#color }

  /**
   * 
   * @param {String} color 
   * @return this;
   */
  setColor(color){ 
    this.#color = color
    return this
  }

  /**
   * @param {CudaLaunch} launch 
   * @returns {CudaKernel} this
   */
  addLaunch(launch) {
    if (launch)
      this.#launches.push(launch)
    return this
  }

  /**
   * Compare with another kernel for equality
   * @param {CudaKernel} other 
   */
  equals(other) {
    return (other instanceof CudaKernel)
      && this.#id === other.id
      && !(this.#source === null || other.source === null)
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

  /**
   * String representation of this kernel
   * @param {Boolean} [short=false] If set a compact String representation is returned
   * @returns {String}
   */
  toString(short=false) {
    return short? `#${this.id}, ${this.source.name} [x${this.launches.length}]` : `kernel(id: ${this.#id}, name: ${this.#source.name}, ${this.launches.length} launches)`
  }
  
}

module.exports = CudaKernel