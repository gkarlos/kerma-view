const KernelSelection      = require('@renderer/services/kernel-selection/KernelSelection')
const KernelSelectionModel = require('@renderer/services/kernel-selection/KernelSelectionModel')
const KernelSelectionView  = require('@renderer/services/kernel-selection/KernelSelectionView')
const SourceRange          = require('@renderer/models/source').SourceRange
const Service              = require('@renderer/services/Service')

/**
 * @memberof module:kernel-selection
 */
class KernelSelectionService extends Service {

  /** @type {KernelSelection[]} */
  #selections
  /** @type {KernelSelection} */
  #current

  constructor() {
    super("KernelSelectionService")
    this.#selections = []
    this.#current = null
  }

  /**
   * Create a new KernelSelection and optionally make it the current one
   * @param {Boolean} [makeCurrent] Make the selection the current displayed selection
   * @returns {KernelSelection}
   */
  createNew(makeCurrent=false) {
    const selection = new KernelSelection()
    this.#selections.push(selection)
    if ( makeCurrent) {
      this.activate(selection)
    }
    return selection
  }

  /**
   * Retrieve the currently displaying selection
   * @returns {KernelSelection}
   */
  getCurrent() { return this.#current }

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

    return selection? selection.addKernels(kernels) : this.createNew().addKernels(kernels)
  }

  /**
   * 
   * @param {KernelSelection} selection 
   */
  createNewMock2(selection=null) {
    const CudaKernel = require('@renderer/models/cuda/CudaKernel')
    const FunctionInfo = require('@renderer/models/source/FunctionInfo')
    const Mock = require('@mock/cuda-source')

    let kernels = []

    Mock.kernels.forEach( (kernel, i) => {
      let fi = new FunctionInfo({
        filename : kernel.source.filename,
        name : kernel.source.name + "SECOND",
        arguments : kernel.source.signature,
        range : SourceRange.fromArray(kernel.source.range),
        isKernel : true
      })
      kernels.push( new CudaKernel(i, fi))
    })

    return selection? selection.addKernels(kernels) : this.createNew().addKernels(kernels)
  }

  /**
   * 
   * @param {KernelSelection} kernelSelection
   * @returns {KernelSelectionService} this
   */
  activate(kernelSelection) {
    if ( kernelSelection && this.#current !== kernelSelection) {
      if ( !this.#selections.find(sel => sel === kernelSelection))
        this.#selections.push(kernelSelection)
      this.#current && this.#current.dispose(true)
      this.#current = kernelSelection
      this.#current.view.render()
    }
    return this
  }

  /**
   * Dispose a KernelSelection. A disposed selection
   * is not currently displayed but may be chosed later on
   * @param {KernelSelection} kernelSelection 
   * @returns {KernelSelectionService} this
   */
  dispose(kernelSelection) {
    if ( this.#current === kernelSelection)
      this.#current = null
    kernelSelection.dispose(true)
    return this
  }

  /**
   * Enable the Service
   * @returns {KernelSelectionService} this
   */
  enable() {
    super.enable()
    for ( let selection of this.#selections)
      selection.enable()
    return this
  }

  /**
   * Disable the Service
   * @returns {KernelSelectionService} this
   */
  disable() {
    super.disable()
    for ( let selection of this.#selections)
      selection.disable()
    return this
  }

}

module.exports = KernelSelectionService