const KernelSelection      = require('@renderer/services/kernel-selection/KernelSelection')
const KernelSelectionModel = require('@renderer/services/kernel-selection/KernelSelectionModel')
const KernelSelectionView  = require('@renderer/services/kernel-selection/KernelSelectionView')
const SourceRange          = require('@renderer/models/source').SourceRange
const Service              = require('@renderer/services/Service')


/**
 * @memberof module:kernel-selection
 */
class KernelSelectionService extends Service {

  /** @type {Array.<KernelSelection>} */
  #selections

  constructor() {
    super("KernelSelectionService")
    this.#selections = []
  }

  createNew() {
    const selection = new KernelSelection()
    this.#selections.push(selection)
    return selection
  }

  createNewMock() {
    const CudaKernel = require('@renderer/models/cuda/CudaKernel')
    const FunctionInfo = require('@renderer/models/source/FunctionInfo')
    const Mock = require('@mock/cuda-source')

    let selection = this.createNew()
    for ( let i = 0; i < Mock.kernels.length; ++i) {
      console.log(Mock.kernels[i].source)
      selection.addKernel(new CudaKernel(i, new FunctionInfo({
        filename : Mock.kernels[i].source.filename,
        name : Mock.kernels[i].source.name,
        arguments : Mock.kernels[i].source.signature,
        range : SourceRange.fromArray(Mock.kernels[i].source.range),
        isKernel : true
      })))
    }

    // selection.addKernel(new CudaKernel(2, new FunctionInfo({name: "kernelC", arguments: "()"})))
    return selection
  }

  activate(kernelSelection) {

  }

  enable() {
    super.enable()
    for ( let selection of this.#selections)
      selection.enable()
  }

  disable() {
    super.disable()
    for ( let selection of this.#selections)
      disable.enable()
  }

}

module.exports = KernelSelectionService