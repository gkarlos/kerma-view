
/** @ignore @typedef {import("@renderer/models/Kernel")} Kernel */
const KernelInformerView = require('@renderer/services/kernel-informer/KernelInformerView')

class KernelInformerService {

  #view

  constructor() {
    this.#view = new KernelInformerView().render()
  }


  /**
   * @param {Kernel} kernel
   */
  show(kernel) {
    this.#view.show(kernel)
  }
}

module.exports = KernelInformerService

