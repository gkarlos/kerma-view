const KernelSelection      = require('@renderer/services/kernel-selection/KernelSelection')
const SourceRange          = require('@renderer/models/source').SourceRange
const Service              = require('@renderer/services/Service')
const CudaKernel           = require('@renderer/models/cuda/CudaKernel')

/**@ignore @typedef {import("@renderer/services/kernel-selection/KernelSelection").KernelSelectionOnSelectCallback} KernelSelectionOnSelectCallback*/

/**
 * @memberof module:kernel-selection
 */
class KernelSelectionService extends Service {

  /** @type {KernelSelection[]} */
  #selections
  /** @type {KernelSelection} */
  #current
  /** @type {KernelSelectionOnSelectCallback[]} */
  #defaultOnSelectCallbacks

  constructor() {
    super("KernelSelectionService")
    this.#selections = []
    this.#current = null
    this.#defaultOnSelectCallbacks = []
  }

  /**
   * Create a new KernelSelection for a given list of kernels
   * @param {CudaKernel[]} kernels An array of CudaKernel objects
   * @param {Coolean} [makeCurrent] Make the selection the currently displayed selection
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

    return selection? selection.addKernels(kernels) : this.createEmpty().addKernels(kernels)
  }

  /**
   * 
   * @param {KernelSelection} selection 
   */
  createMock2(selection=null) {
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
   * Register a callback that will be hooken to every KernelSelection created by the service
   * @param {...KernelSelectionOnSelectCallback} callbacks
   * @returns {KernelSelectionService} this
   */
  defaultOnSelect(...callbacks) {
    callbacks.forEach(callback => this.#defaultOnSelectCallbacks.push(callback))
    return this
  }



}

module.exports = KernelSelectionService