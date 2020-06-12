require('module-alias/register')
const CudaBlock  = require('@renderer/cuda').Block
const CudaLimits = require('@renderer/cuda').Limits

const expect = require('chai').expect

describe('renderer/cuda/CudaBlock', () => {
  describe('equals', () => {
    it("should be equal 1D (1)", () => {
      expect(new CudaBlock(256).equals(new CudaBlock(256))).to.be.true
    })

    it("should be equal 1D (2)", () => {
      expect(new CudaBlock(1).equals(new CudaBlock(1))).to.be.true
    })

    it("should be equal 1D (2)", () => {
      expect(new CudaBlock(12345).equals(new CudaBlock(12345))).to.be.true
    })

    it("should be equal 2D (1)", () => {
      expect(new CudaBlock(256,256).equals(new CudaBlock(256,256))).to.be.true
    })

    it("should be equal 2D (2)", () => {
      expect(new CudaBlock(1,256).equals(new CudaBlock(1,256))).to.be.true
    })

    it("should be equal 2D (2)", () => {
      expect(new CudaBlock(12345,100).equals(new CudaBlock(12345,100))).to.be.true
    })

    it("should be equal 3D (1)", () => {
      expect(new CudaBlock(256,256,256).equals(new CudaBlock(256,256,256))).to.be.true
    })

    it("should be equal 3D (2)", () => {
      expect(new CudaBlock(1,256,16).equals(new CudaBlock(1,256,16))).to.be.true
    })

    it("should be equal 3D (2)", () => {
      expect(new CudaBlock(12345,100, 200).equals(new CudaBlock(12345,100,200))).to.be.true
    })

    it("should be equal Mixed (1)", () => {
      expect(new CudaBlock(1).equals(new CudaBlock(1,1))).to.be.true
      expect(new CudaBlock(1).equals(new CudaBlock(1,1,1))).to.be.true
    })

    it("should be equal Mixed (2)", () => {
      expect(new CudaBlock(256,256).equals(new CudaBlock(256,256,1))).to.be.true
      expect(new CudaBlock(1,1024).equals(new CudaBlock(1,1024,1))).to.be.true
    })
  
    it("should not be equal 1D (1)", () => {
      expect(new CudaBlock(256).equals(new CudaBlock(255))).to.be.false
    })

    it("should not be equal 1D (2)", () => {
      expect(new CudaBlock(1).equals(new CudaBlock(2))).to.be.false
    })

    it("should not be equal 1D (2)", () => {
      expect(new CudaBlock(12345).equals(new CudaBlock(123))).to.be.false
    })

    it("should not be equal 2D (1)", () => {
      expect(new CudaBlock(256,256).equals(new CudaBlock(1,256))).to.be.false
    })

    it("should not be equal 2D (2)", () => {
      expect(new CudaBlock(1,256).equals(new CudaBlock(256,1))).to.be.false
    })

    it("should not be equal 2D (2)", () => {
      expect(new CudaBlock(12345,100).equals(new CudaBlock(12345,200))).to.be.false
    })

    it("should not be equal 3D (1)", () => {
      expect(new CudaBlock(256,256,256).equals(new CudaBlock(256,255,256))).to.be.false
    })

    it("should not be equal 3D (2)", () => {
      expect(new CudaBlock(1,256,16).equals(new CudaBlock(256,256,16))).to.be.false
    })

    it("should not be equal 3D (2)", () => {
      expect(new CudaBlock(12345,100, 200).equals(new CudaBlock(12345,300,100))).to.be.false
    })

    it("should not be equal Mixed (1)", () => {
      expect(new CudaBlock(1).equals(new CudaBlock(1,2))).to.be.false
      expect(new CudaBlock(2).equals(new CudaBlock(1,2,1))).to.be.false
      expect(new CudaBlock(2).equals(new CudaBlock(1,2))).to.be.false
    })

    it("should not be equal Mixed (2)", () => {
      expect(new CudaBlock(256,256).equals(new CudaBlock(256,1,256))).to.be.false
      expect(new CudaBlock(1,1024).equals(new CudaBlock(1024,1024,1))).to.be.false
      expect(new CudaBlock(1024).equals(new CudaBlock(1,1024))).to.be.false
    })
  })
})