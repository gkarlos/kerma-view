require('module-alias/register')
const expect = require('chai').expect

const KernelSelectionModel = require('@renderer/services/kernel-selection/KernelSelectionModel')
const CudaKernel = require('@renderer/models/cuda/CudaKernel')
const FunctionInfo = require('@renderer/models/source/FunctionInfo')

describe("renderer/services/kernel-selection/KernelSelectionModel", () => {
  describe("constructor", () => {
    it("should not throw", () => {
      expect(() => new KernelSelectionModel()).to.not.throw()
    })
  })

  describe("addKernel", () => {
    it("should correctly insert a kernel", () => {
      let model = new KernelSelectionModel()
      let kernel = new CudaKernel(0, new FunctionInfo({filename:"test.cu"}))
      expect(model.addKernel(kernel).numOptions).to.equal(1)
    })

    it("should insert duplicates", () => {
      let model = new KernelSelectionModel()
      let kernel = new CudaKernel(0, new FunctionInfo({filename:"test.cu"}))
      expect(model.addKernel(kernel).addKernel(kernel).numOptions).to.equal(2)
    })
  })

  describe("selectKernel", () => {
    it("should find an existing kernel", () => {
      let model = new KernelSelectionModel()
      let kernel1 = new CudaKernel(0, new FunctionInfo({name:"kernel"}))
      let kernel2 = new CudaKernel(1, new FunctionInfo({name:"kernel2"}))

      model.addKernel(kernel1).addKernel(kernel2)

      let success = model.selectKernel(kernel1)

      expect(success).to.be.true
      expect(model.hasSelection()).to.be.true
      expect(model.getSelection().equals(kernel1)).to.be.true
    })

    it("should not select a kernel that doesnt exist", () => {
      let model = new KernelSelectionModel()
      let kernel1 = new CudaKernel(0, new FunctionInfo({name:"kernel"}))
      let kernel2 = new CudaKernel(1, new FunctionInfo({name:"kernel2"}))

      model.addKernel(kernel1)

      let success = model.selectKernel(kernel2)

      expect(success).to.be.false
      expect(model.hasSelection()).to.be.false
      expect(model.getSelection()).to.be.null

    })
  })

  describe("selectKernelByName", () => {
    it("should select an existing kernel", () => {
      let model = new KernelSelectionModel()
      let kernel1 = new CudaKernel(0, new FunctionInfo({name:"kernel"}))
      let kernel2 = new CudaKernel(1, new FunctionInfo({name:"kernel2"}))
      model.addKernel(kernel1).addKernel(kernel2)
      let success = model.selectKernelByName("kernel2")
      expect(success).to.be.true
      expect(model.hasSelection()).to.be.true
      expect(model.getSelection()).to.not.be.null
      expect(model.getSelection().equals(kernel2)).to.be.true
    })
    
    it("should not select a kernel that doesnt exist", () => {
      let model = new KernelSelectionModel()
      let kernel1 = new CudaKernel(0, new FunctionInfo({name:"kernel"}))
      let kernel2 = new CudaKernel(1, new FunctionInfo({name:"kernel2"}))
      model.addKernel(kernel1).addKernel(kernel2)
      let success = model.selectKernelByName("kernel3")
      expect(success).to.be.false
      expect(model.hasSelection()).to.be.false
      expect(model.getSelection()).to.be.null
    })
  })

  describe("selectKernelById", () => {
    it("should select an existing kernel", () => {
      let model = new KernelSelectionModel()
      let kernel1 = new CudaKernel(0, new FunctionInfo({name:"kernel"}))
      let kernel2 = new CudaKernel(1, new FunctionInfo({name:"kernel2"}))
      model.addKernel(kernel1).addKernel(kernel2)
      let success = model.selectKernelById(1)
      expect(success).to.be.true
      expect(model.hasSelection()).to.be.true
      expect(model.getSelection()).to.not.be.null
      expect(model.getSelection().equals(kernel2)).to.be.true
    })
    
    it("should not select a kernel that doesnt exist", () => {
      let model = new KernelSelectionModel()
      let kernel1 = new CudaKernel(0, new FunctionInfo({name:"kernel"}))
      let kernel2 = new CudaKernel(1, new FunctionInfo({name:"kernel2"}))
      model.addKernel(kernel1).addKernel(kernel2)
      let success = model.selectKernelByName(15)
      expect(success).to.be.false
      expect(model.hasSelection()).to.be.false
      expect(model.getSelection()).to.be.null
    })
  })

  describe("clearSelection", () => {
    it("should work with selection", () => {
      let model = new KernelSelectionModel()
      let kernel1 = new CudaKernel(0, new FunctionInfo({name:"kernel"}))
      model.addKernel(kernel1)
      model.selectKernel(kernel1)
      model.clearSelection()
      expect(model.hasSelection()).to.be.false
    })

    it("should work without selection", () => {
      let model = new KernelSelectionModel()
      model.clearSelection()
      expect(model.hasSelection()).to.be.false
    })
  })

})