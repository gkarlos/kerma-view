/** @ignore @typedef {import("@renderer/models/source/FunctionSrc")} FunctionSrc */
/** @ignore @typedef {import("@renderer/models/cuda/CuLaunch")} CuLaunch */

/**
 * @memberof module:cuda
 */
class CuKernel {
  /** @type {Number} */
  #id
  /** @type {FunctionSrc} */
  #source
  /** @type {Array.<CuLaunch>} */
  #launches
  /** @type {String} */
  #color

  /**
   * @param {Number} id
   * @param {FunctionSrc} source 
   */
  constructor(id,source) {
    this.#id = id
    this.#source = source || null
    this.#launches = []
  }

  /** @type {Number} */
  get id() { return this.#id }

  /** @type {FunctionSrc} */
  get source() { return this.#source }

  /** @type {String} */
  get name() { return this.#source.name }

  /** @type {Array.<CuLaunch>} */
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
   * @param {CuLaunch} launch 
   * @returns {CuKernel} this
   */
  addLaunch(launch) {
    if (launch)
      this.#launches.push(launch)
    return this
  }

  /**
   * Compare with another kernel for equality
   * @param {CuKernel} other 
   */
  equals(other) {
    return (other instanceof CuKernel)
      && this.#id === other.id
      && !(this.#source === null || other.source === null)
      && this.#source.equals(other.source)
      // && ((self) => {
      //   if ( self.#launches.length !== other.launches.length)
      //     return false
      //   for( let i = 0; i < self.#launches.length; ++i)
      //     if ( !self.#launches[i].equals(other.launches[i]))
      //       return false
      //   return true
      // })(this)
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

module.exports = CuKernel