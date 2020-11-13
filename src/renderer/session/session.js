/** @ignore @typedef {import("@renderer/models/Kernel")} Kernel */

class Session {
  id = null;
  /** @type Kernel   */ #kernel
  /** @type Kernel[] */ #kernels
  constructor(id=null) {
    if ( !id) {
      this.id = require('crypto').randomBytes(16).toString('base64');
    }
    this.#kernels = []
  }

  /**
   * @param {Kernel} kernel
   */
  addKernel(kernel) {  this.#kernels.push(kernel); }

  /**
   * @param {Kernel} kernels
   */
  setKernels(kernels) { this.#kernels = kernels }

  /**
   * @param {Kernel} kernel
   */
  setKernel(kernel) {
    this.#kernel = kernel
    return this
  }

  /** @returns {Kernel[]} */
  getKernels() { return this.#kernels }

  /**
   * @param {Number} id
   */
  getKernelById(id) {
    for ( let i = 0; i < this.#kernels.length; ++i)
      if ( this.#kernels[i].id == id)
        return this.#kernels[i]
    return undefined
  }

}

module.exports = Session