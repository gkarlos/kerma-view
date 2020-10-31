/** @ignore @typedef {import("@renderer/models/cuda/CuKernel")} CuKernel */

class Session {
  id = null;
  /** @type CuKernel   */ #kernel
  /** @type CuKernel[] */ #kernels
  constructor(id=null) {
    if ( !id) {
      this.id = require('crypto').randomBytes(16).toString('base64');
    }
    this.#kernels = []
  }

  /**
   * @param {CuKernel} kernel
   */
  addKernel(kernel) {  this.#kernels.push(kernel); }

  /**
   * @param {CuKernel} kernels
   */
  setKernels(kernels) { this.#kernels = kernels }

  /**
   * @param {CuKernel} kernel
   */
  setKernel(kernel) {
    this.#kernel = kernel
    return this
  }

  /** @returns {CuKernel[]} */
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