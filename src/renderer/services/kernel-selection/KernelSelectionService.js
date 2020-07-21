const KernelSelection  = require('@renderer/services/kernel-selection/KernelSelection')
const SrcRange         = require('@renderer/models/source/SrcRange')
const Service          = require('@renderer/services/Service')
const CudaKernel       = require('@renderer/models/cuda/CudaKernel')
const FunctionCallSrc  = require('@renderer/models/source')
const CudaLaunch = require('@renderer/models/cuda/CudaLaunch')
const CudaBlock  = require('@renderer/models/cuda/CudaBlock')
const CudaGrid   = require('@renderer/models/cuda/CudaGrid')
const CudaDim    = require('@renderer/models/cuda/CudaDim')

/**@ignore @typedef {import("@renderer/services/kernel-selection/KernelSelection").KernelSelectionOnSelectCallback} KernelSelectionOnSelectCallback*/

/**
 * @memberof module:kernel-selection
 * @extends Service
 */
class KernelSelectionService extends Service {

  /** @type {KernelSelection[]} */
  #selections
  /** @type {KernelSelection} */
  #current
  /** @type {KernelSelectionOnSelectCallback[]} */
  #defaultOnSelectCallbacks

  /**
   * 
   */
  constructor() {
    super("KernelSelectionService")
    this.#selections = []
    this.#current = null
    this.#defaultOnSelectCallbacks = []
  }

  /**
   * Create a new KernelSelection for a given list of kernels
   * @param {CudaKernel[]} kernels An array of CudaKernel objects
   * @param {Boolean} [makeCurrent] Make the selection the currently displayed selection
   * @returns {KernelSelection}
   */
  create(kernels, makeCurrent=false) {
    const selection = this.createEmpty(makeCurrent)
    kernels.forEach(kernel => selection.addKernel(kernel))
    return selection
  }

  /**
   * Create an empty KernelSelection and optionally make it the current one
   * @param {Boolean} [makeCurrent] Make the selection the currently displayed selection
   * @returns {KernelSelection}
   */
  createEmpty(makeCurrent=false) {
    const selection = new KernelSelection()
    this.#defaultOnSelectCallbacks.forEach(callback => selection.onSelect(callback))
    this.#selections.push(selection)
    if ( makeCurrent)
      this.activate(selection)
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
  createMock(selection=null) {
    const CudaKernel = require('@renderer/models/cuda/CudaKernel')
    const FunctionSrc = require('@renderer/models/source/FunctionSrc')
    const FunctionCallSrc = require('@renderer/models/source/FunctionCallSrc')
    const Mock = require('@mock/cuda-source')

    let kernels = []

    Mock.kernels.forEach( (kernel, i) => {
      let kernelFI = new FunctionSrc({
        filename : kernel.source.filename,
        name : kernel.source.name,
        type : "void",
        arguments : kernel.source.signature,
        range : SrcRange.fromArray(kernel.source.range),
        isKernel : true
      })

      let cudaKernel = new CudaKernel(i, kernelFI)

      kernel.launches.forEach((launch, j) => {
        let caller    = new FunctionSrc({ name : launch.caller.source.name, type : launch.caller.source.type, arguments : launch.caller.source.signature})
        let launchFCS = new FunctionCallSrc({
          name : cudaKernel.name,
          isKernelLaunch : true,
          launchParams : launch.source.params,
          range : SrcRange.fromArray(launch.source.range),
          arguments : launch.source.arguments,
          caller : caller
        })

        let cudaLaunch = new CudaLaunch(cudaKernel, new CudaGrid(1024, j % 2 == 0? 1000 : 200), { id : j, source: launchFCS})
        cudaKernel.addLaunch(cudaLaunch)
      })


      kernels.push(cudaKernel)
    })

    return selection? selection.addKernels(kernels) : this.createEmpty().addKernels(kernels)
  }

  /**
   * 
   * @param {KernelSelection} selection 
   */
  createMock2(selection=null) {
    const CudaKernel = require('@renderer/models/cuda/CudaKernel')
    const FunctionSrc = require('@renderer/models/source/FunctionSrc')
    const Mock = require('@mock/cuda-source')

    let kernels = []

    Mock.kernels.forEach( (kernel, i) => {
      let fsrc = new FunctionSrc({
        filename : kernel.source.filename,
        name : kernel.source.name + "SECOND",
        arguments : kernel.source.signature,
        range : SrcRange.fromArray(kernel.source.range),
        isKernel : true
      })
      kernels.push( new CudaKernel(i, fsrc))
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
      this.#current && this.#current.dispose(false)
      this.#current = kernelSelection
      this.#current.view.render()
    }
    return this
  }

  /**
   * Dispose a KernelSelection. A disposed selection
   * is not currently displayed but may be chosen later on
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

  /**
   * Register callback(s) that will be hooked to every KernelSelection created by the service
   * @param {...KernelSelectionOnSelectCallback} callbacks
   * @returns {KernelSelectionService} this
   */
  defaultOnSelect(...callbacks) {
    callbacks.forEach(callback => this.#defaultOnSelectCallbacks.push(callback))
    return this
  }
}

module.exports = KernelSelectionService