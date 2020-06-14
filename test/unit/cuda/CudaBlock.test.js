require('module-alias/register')
const CudaBlock  = require('@renderer/cuda').Block
const CudaWarp  = require('@renderer/cuda').Warp
const CudaLimits = require('@renderer/cuda').Limits

const expect = require('chai').expect

describe('renderer/cuda/CudaBlock', () => {
  describe('getWarp', () => {
    it('should return the right warp (1)', () => {
      let block = new CudaBlock(256)
      expect(block.getWarp(0).equals(new CudaWarp(block,0))).to.be.true
    })
  })

  describe('equals', () => {
    it("should be equal 1D (1)", () => {
      expect(new CudaBlock(256).equals(new CudaBlock(256))).to.be.true
    })

    it("should be equal 1D (2)", () => {
      expect(new CudaBlock(1).equals(new CudaBlock(1))).to.be.true
    })

    it("should be equal 1D (2)", () => {
      expect(new CudaBlock(123).equals(new CudaBlock(123))).to.be.true
    })

    it("should be equal 2D (1)", () => {
      expect(new CudaBlock(2,256).equals(new CudaBlock(2,256))).to.be.true
    })

    it("should be equal 2D (2)", () => {
      expect(new CudaBlock(1,256).equals(new CudaBlock(1,256))).to.be.true
    })

    it("should be equal 2D (2)", () => {
      expect(new CudaBlock(10,100).equals(new CudaBlock(10,100))).to.be.true
    })

    it("should be equal 3D (1)", () => {
      expect(new CudaBlock(10,10,10).equals(new CudaBlock(10,10,10))).to.be.true
    })

    it("should be equal 3D (2)", () => {
      expect(new CudaBlock(1,256,2).equals(new CudaBlock(1,256,2))).to.be.true
    })

    it("should be equal 3D (2)", () => {
      expect(new CudaBlock(12,2,4).equals(new CudaBlock(12,2,4))).to.be.true
    })

    it("should be equal Mixed (1)", () => {
      expect(new CudaBlock(1).equals(new CudaBlock(1,1))).to.be.true
      expect(new CudaBlock(1).equals(new CudaBlock(1,1,1))).to.be.true
    })

    it("should be equal Mixed (2)", () => {
      expect(new CudaBlock(24,2).equals(new CudaBlock(24,2,1))).to.be.true
      expect(new CudaBlock(1,1024).equals(new CudaBlock(1,1024,1))).to.be.true
    })
  
    it("should not be equal 1D (1)", () => {
      expect(new CudaBlock(256).equals(new CudaBlock(255))).to.be.false
    })

    it("should not be equal 1D (2)", () => {
      expect(new CudaBlock(1).equals(new CudaBlock(2))).to.be.false
    })

    it("should not be equal 1D (2)", () => {
      expect(new CudaBlock(123).equals(new CudaBlock(12))).to.be.false
    })

    it("should not be equal 2D (1)", () => {
      expect(new CudaBlock(16,16).equals(new CudaBlock(1,16))).to.be.false
    })

    it("should not be equal 2D (2)", () => {
      expect(new CudaBlock(1,256).equals(new CudaBlock(256,1))).to.be.false
    })

    it("should not be equal 2D (2)", () => {
      expect(new CudaBlock(2,100).equals(new CudaBlock(2,200))).to.be.false
    })

    it("should not be equal 3D (1)", () => {
      expect(new CudaBlock(3,3,3).equals(new CudaBlock(3,3,2))).to.be.false
    })

    it("should not be equal 3D (2)", () => {
      expect(new CudaBlock(1,128,2).equals(new CudaBlock(128,2,1))).to.be.false
    })

    it("should not be equal 3D (2)", () => {
      expect(new CudaBlock(2,100,3).equals(new CudaBlock(2,100,4))).to.be.false
    })

    it("should not be equal Mixed (1)", () => {
      expect(new CudaBlock(1).equals(new CudaBlock(1,2))).to.be.false
      expect(new CudaBlock(2).equals(new CudaBlock(1,2,1))).to.be.false
      expect(new CudaBlock(2).equals(new CudaBlock(1,2))).to.be.false
    })

    it("should not be equal Mixed (2)", () => {
      expect(new CudaBlock(10,10).equals(new CudaBlock(10,1,10))).to.be.false
      expect(new CudaBlock(1,1024).equals(new CudaBlock(1024,1,1))).to.be.false
      expect(new CudaBlock(1024).equals(new CudaBlock(1,1024))).to.be.false
    })
  })
})