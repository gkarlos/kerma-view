require('module-alias/register')
const CudaBlock  = require('@renderer/models/cuda').Block
const CudaWarp   = require('@renderer/models/cuda').Warp
const CudaLimits = require('@renderer/models/cuda').Limits
const CudaDim    = require('@renderer/models/cuda').Dim
const { CudaIndex } = require('@renderer/models/cuda')

const expect = require('chai').expect

describe('renderer/models/cuda/CudaWarp', () => {

  describe("constructor", () => {

    it("should throw with missing args", () => {
      expect(() => new CudaWarp(null,null)).to.throw
      expect(() => new CudaWarp()).to.throw
      expect(() => new CudaWarp(undefined)).to.throw
      expect(() => new CudaWarp(undefined, undefined)).to.throw
    })

    it("should throw with invalid arg types", () => {
      expect(() => new CudaWarp("a","b")).to.throw
      expect(() => new CudaWarp(1)).to.throw
      expect(() => new CudaWarp(1,1)).to.throw
      expect(() => new CudaWarp(1.2)).to.throw
    })

    it("should not throw with valid arg type", () => {
      expect(() => new CudaWarp(new CudaBlock(1024), 0)).to.not.throw
      expect(() => new CudaWarp(new CudaBlock(new CudaDim(1024)), new CudaIndex(0))).to.not.throw
      expect(() => new CudaWarp(new CudaBlock(new CudaDim(10,10)), new CudaDim(0))).to.throw
    })  

    it("should throw with 2D CudaDim", () => {
      expect(() => new CudaWarp(new CudaBlock(1024), new CudaIndex(2,2))).to.throw
      expect(() => new CudaWarp(new CudaBlock(1024), new CudaIndex(2,1))).to.throw
    })

    it("should throw with invalid CudaDim", () => {
      expect(() => new CudaWarp(new CudaBlock(1024), new CudaIndex(1024,2))).to.throw
    })

    it("should throw with invalid int dim", () => {
      expect(() => new CudaWarp(new CudaBlock(1024), 1024)).to.throw
    })
  })

  describe("equals", () => {
    it("should be equal (1)", () => {
      expect(new CudaWarp(new CudaBlock(1), 0).equals(new CudaWarp(new CudaBlock(1), 0))).to.be.true
    })

    it("should be equal (2)", () => {
      let w1 = new CudaWarp(new CudaBlock(new CudaDim(256,2)), 2)
      let w2 = new CudaWarp(new CudaBlock(new CudaDim(256,2)), 2)
      expect(w1.equals(w2)).to.be.true
    })

    it("should not be equal (1)", () => {
      expect(new CudaWarp(new CudaBlock(1), 0).equals(new CudaWarp(new CudaBlock(2), 0))).to.be.false
    })

    it("should not be equal (2)", () => {
      expect(new CudaWarp(new CudaBlock(256, 256), 1).equals(new CudaWarp(new CudaBlock(256,256), 2))).to.be.false
    })
  })


  describe("getNumUsableLanes", () => {
    it("should return the right value [warpSize multiple] (1) ", () => {
      let block = new CudaBlock(1024)
      for ( let i = 0; i < block.numWarps; ++i)
        expect(new CudaWarp(block, i).getNumUsableLanes()).to.equal(CudaLimits.warpSize)
    })

    it("should return the right value [warpSize multiple] (2) ", () => {
      let block = new CudaBlock(1024)
      for ( let i = 0; i < block.numWarps; ++i)
        expect(new CudaWarp(block, i).getNumUsableLanes()).to.equal(CudaLimits.warpSize)
    })

    it("should return the right value [not warpSize multiple] (1)", () => {
      let block = new CudaBlock(1000)
      expect(new CudaWarp(block, 0).getNumUsableLanes()).to.equal(CudaLimits.warpSize)
      expect(new CudaWarp(block, 5).getNumUsableLanes()).to.equal(CudaLimits.warpSize)
      expect(new CudaWarp(block, block.numWarps - 1).getNumUsableLanes()).to.not.equal(CudaLimits.warpSize)
      expect(new CudaWarp(block, block.numWarps - 1).getNumUsableLanes()).to.equal(1000 % CudaLimits.warpSize)
    })

    it("should return the right value [not warpSize multiple] (2)", () => {
      let block = new CudaBlock(new CudaDim(10, 99))
      expect(new CudaWarp(block, 0).getNumUsableLanes()).to.equal(CudaLimits.warpSize)
      expect(new CudaWarp(block, 5).getNumUsableLanes()).to.equal(CudaLimits.warpSize)
      expect(new CudaWarp(block, block.numWarps - 1).getNumUsableLanes()).to.not.equal(CudaLimits.warpSize)
      expect(new CudaWarp(block, block.numWarps - 1).getNumUsableLanes()).to.equal((10* 99) % CudaLimits.warpSize)

      block = new CudaBlock(990)
      expect(new CudaWarp(block, 0).getNumUsableLanes()).to.equal(CudaLimits.warpSize)
      expect(new CudaWarp(block, 5).getNumUsableLanes()).to.equal(CudaLimits.warpSize)
      expect(new CudaWarp(block, block.numWarps - 1).getNumUsableLanes()).to.not.equal(CudaLimits.warpSize)
      expect(new CudaWarp(block, block.numWarps - 1).getNumUsableLanes()).to.equal((10* 99) % CudaLimits.warpSize)
    })
  })

  describe("getUsableLaneIndices", () => {
    it("should return the right value [warpSize multiple] (1) ", () => {
      let block = new CudaBlock(1024)
      let usable = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]
      for ( let i = 0; i < block.numWarps; ++i)
        expect(new CudaWarp(block, i).getUsableLaneIndices()).to.eql(usable)
    })

    it("should return the right value [warpSize multiple] (2) ", () => {
      let block = new CudaBlock(1024)
      let usable = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]
      for ( let i = 0; i < block.numWarps; ++i)
        expect(new CudaWarp(block, i).getUsableLaneIndices()).to.eql(usable)
      block = new CudaBlock(new CudaDim(1024))
      for ( let i = 0; i < block.numWarps; ++i)
        expect(new CudaWarp(block, i).getUsableLaneIndices()).to.eql(usable)
    })

    it("should return the right value [not warpSize multiple] (1)", () => {
      let block = new CudaBlock(1000)
      expect(new CudaWarp(block, 0).getUsableLaneIndices()).to.eql([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31])
      expect(new CudaWarp(block, 5).getUsableLaneIndices()).to.eql([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31])
      expect(new CudaWarp(block, block.numWarps - 1).getUsableLaneIndices()).to.not.eql([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31])
      expect(new CudaWarp(block, block.numWarps - 1).getUsableLaneIndices()).to.eql([0,1,2,3,4,5,6,7])
    })

    it("should return the right value [not warpSize multiple] (2)", () => {
      let block = new CudaBlock(new CudaDim(10,99))
      let usable = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]
      expect(new CudaWarp(block, 0).getUsableLaneIndices()).to.eql(usable)
      expect(new CudaWarp(block, 5).getUsableLaneIndices()).to.eql(usable)
      expect(new CudaWarp(block, block.numWarps - 1).getUsableLaneIndices()).to.not.eql(usable)
      expect(new CudaWarp(block, block.numWarps - 1).getUsableLaneIndices()).to.eql([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29])
    })
  })

  describe("getNumUnusableLanes", () => {
    it("should return the right value [warpSize multiple] (1) ", () => {
      let block = new CudaBlock(1024)
      for ( let i = 0; i < block.numWarps; ++i)
        expect(new CudaWarp(block, i).getNumUnusableLanes()).to.equal(0)
    })

    it("should return the right value [warpSize multiple] (2) ", () => {
      let block = new CudaBlock(1024)
      for ( let i = 0; i < block.numWarps; ++i)
        expect(new CudaWarp(block, i).getNumUnusableLanes()).to.equal(0)
    })

    it("should return the right value [not warpSize multiple] (1)", () => {
      let block = new CudaBlock(1000)
      expect(new CudaWarp(block, 0).getNumUnusableLanes()).to.equal(0)
      expect(new CudaWarp(block, 5).getNumUnusableLanes()).to.equal(0)
      expect(new CudaWarp(block, block.numWarps - 1).getNumUnusableLanes()).to.not.equal(0)
      expect(new CudaWarp(block, block.numWarps - 1).getNumUnusableLanes()).to.equal(CudaLimits.warpSize - 1000 % CudaLimits.warpSize)
    })

    it("should return the right value [not warpSize multiple] (2)", () => {
      let block = new CudaBlock(new CudaDim(10, 99))
      expect(new CudaWarp(block, 0).getNumUnusableLanes()).to.equal(0)
      expect(new CudaWarp(block, 5).getNumUnusableLanes()).to.equal(0)
      expect(new CudaWarp(block, block.numWarps - 1).getNumUnusableLanes()).to.not.equal(0)
      expect(new CudaWarp(block, block.numWarps - 1).getNumUnusableLanes()).to.equal(2)
    })
  })


  describe("getUnusableLaneIndices", () => {
    it("should return the right value [warpSize multiple] (1) ", () => {
      let block = new CudaBlock(1024)
      let unusable = []
      for ( let i = 0; i < block.numWarps; ++i)
        expect(new CudaWarp(block, i).getUnusableLaneIndices()).to.eql(unusable)
    })

    it("should return the right value [warpSize multiple] (2) ", () => {
      let block = new CudaBlock(1024)
      let unusable = []
      for ( let i = 0; i < block.numWarps; ++i)
        expect(new CudaWarp(block, i).getUnusableLaneIndices()).to.eql(unusable)
    })

    it("should return the right value [not warpSize multiple] (1)", () => {
      let block = new CudaBlock(1000)
      expect(new CudaWarp(block, 0).getUnusableLaneIndices()).to.eql([])
      expect(new CudaWarp(block, 5).getUnusableLaneIndices()).to.eql([])
      expect(new CudaWarp(block, block.numWarps - 1).getUnusableLaneIndices()).to.not.eql([])
      expect(new CudaWarp(block, block.numWarps - 1).getUnusableLaneIndices()).to.eql([8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31])
    })

    it("should return the right value [not warpSize multiple] (2)", () => {
      let block = new CudaBlock(new CudaDim(10, 99))
      let unusable = []
      expect(new CudaWarp(block, 0).getUnusableLaneIndices()).to.eql(unusable)
      expect(new CudaWarp(block, 5).getUnusableLaneIndices()).to.eql(unusable)
      expect(new CudaWarp(block, block.numWarps - 1).getUnusableLaneIndices()).to.not.eql(unusable)
      expect(new CudaWarp(block, block.numWarps - 1).getUnusableLaneIndices()).to.eql([30,31])
    })
  })

})