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

  /**
   * 
   * @param {KernelSelection} selection 
   */
  createNewMock(selection=null) {
    const CudaKernel = require('@renderer/models/cuda/CudaKernel')
    const FunctionInfo = require('@renderer/models/source/FunctionInfo')
    const Mock = require('@mock/cuda-source')

    let kernels = []

    Mock.kernels.forEach( (kernel, i) => {
      let fi = new FunctionInfo({
        filename : kernel.source.filename,
        name : kernel.source.name,
        arguments : kernel.source.signature,
        range : SourceRange.fromArray(kernel.source.range),
        isKernel : true
      })
      kernels.push( new CudaKernel(i, fi))
    })

    return selection? selection.addKernels(kernels) : this.createNew(kernels)
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