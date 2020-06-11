require('module-alias/register')
const CudaBlock  = require('@renderer/cuda').Block
const CudaWarp   = require('@renderer/cuda').Warp
const CudaLimits = require('@renderer/cuda').Limits

const expect = require('chai').expect

describe('renderer/cuda/CudaWarp', () => {
  describe("getNumUsableThreads", () => {
    it("should return the right value [warpSize multiple] (1) ", () => {
      let block = new CudaBlock(1024)
      for ( let i = 0; i < block.numWarps; ++i)
        expect(new CudaWarp(block, i).getNumUsableThreads()).to.equal(CudaLimits.warpSize)
    })

    it("should return the right value [warpSize multiple] (2) ", () => {
      let block = new CudaBlock(1024, 1024)
      for ( let i = 0; i < block.numWarps; ++i)
        expect(new CudaWarp(block, i).getNumUsableThreads()).to.equal(CudaLimits.warpSize)
    })

    it("should return the right value [not warpSize multiple] (1)", () => {
      let block = new CudaBlock(1000)
      expect(new CudaWarp(block, 0).getNumUsableThreads()).to.equal(CudaLimits.warpSize)
      expect(new CudaWarp(block, 5).getNumUsableThreads()).to.equal(CudaLimits.warpSize)
      expect(new CudaWarp(block, block.numWarps - 1).getNumUsableThreads()).to.not.equal(CudaLimits.warpSize)
      expect(new CudaWarp(block, block.numWarps - 1).getNumUsableThreads()).to.equal(1000 % CudaLimits.warpSize)
    })

    it("should return the right value [not warpSize multiple] (2)", () => {
      let block = new CudaBlock(1000, 999)
      expect(new CudaWarp(block, 0).getNumUsableThreads()).to.equal(CudaLimits.warpSize)
      expect(new CudaWarp(block, 5).getNumUsableThreads()).to.equal(CudaLimits.warpSize)
      expect(new CudaWarp(block, block.numWarps - 1).getNumUsableThreads()).to.not.equal(CudaLimits.warpSize)
      expect(new CudaWarp(block, block.numWarps - 1).getNumUsableThreads()).to.equal((1000 * 999) % CudaLimits.warpSize)
    })
  })

  describe("getUsableThreads", () => {
    it("should return the right value [warpSize multiple] (1) ", () => {
      let block = new CudaBlock(1024)
      let usable = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]
      for ( let i = 0; i < block.numWarps; ++i)
        expect(new CudaWarp(block, i).getUsableThreads()).to.eql(usable)
    })

    it("should return the right value [warpSize multiple] (2) ", () => {
      let block = new CudaBlock(1024, 1024)
      let usable = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]
      for ( let i = 0; i < block.numWarps; ++i)
        expect(new CudaWarp(block, i).getUsableThreads()).to.eql(usable)
    })

    it("should return the right value [not warpSize multiple] (1)", () => {
      let block = new CudaBlock(1000)
      expect(new CudaWarp(block, 0).getUsableThreads()).to.eql([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31])
      expect(new CudaWarp(block, 5).getUsableThreads()).to.eql([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31])
      expect(new CudaWarp(block, block.numWarps - 1).getUsableThreads()).to.not.eql([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31])
      expect(new CudaWarp(block, block.numWarps - 1).getUsableThreads()).to.eql([0,1,2,3,4,5,6,7])
    })

    it("should return the right value [not warpSize multiple] (2)", () => {
      let block = new CudaBlock(1000, 999)
      let usable = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]
      expect(new CudaWarp(block, 0).getUsableThreads()).to.eql(usable)
      expect(new CudaWarp(block, 5).getUsableThreads()).to.eql(usable)
      expect(new CudaWarp(block, block.numWarps - 1).getUsableThreads()).to.not.eql(usable)
      expect(new CudaWarp(block, block.numWarps - 1).getUsableThreads()).to.eql([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23])
    })
  })

  describe("getNumUnusableThreads", () => {
    it("should return the right value [warpSize multiple] (1) ", () => {
      let block = new CudaBlock(1024)
      for ( let i = 0; i < block.numWarps; ++i)
        expect(new CudaWarp(block, i).getNumUnusableThreads()).to.equal(0)
    })

    it("should return the right value [warpSize multiple] (2) ", () => {
      let block = new CudaBlock(1024, 1024)
      for ( let i = 0; i < block.numWarps; ++i)
        expect(new CudaWarp(block, i).getNumUnusableThreads()).to.equal(0)
    })

    it("should return the right value [not warpSize multiple] (1)", () => {
      let block = new CudaBlock(1000)
      expect(new CudaWarp(block, 0).getNumUnusableThreads()).to.equal(0)
      expect(new CudaWarp(block, 5).getNumUnusableThreads()).to.equal(0)
      expect(new CudaWarp(block, block.numWarps - 1).getNumUnusableThreads()).to.not.equal(0)
      expect(new CudaWarp(block, block.numWarps - 1).getNumUnusableThreads()).to.equal(CudaLimits.warpSize - 1000 % CudaLimits.warpSize)
    })

    it("should return the right value [not warpSize multiple] (2)", () => {
      let block = new CudaBlock(1000, 999)
      expect(new CudaWarp(block, 0).getNumUnusableThreads()).to.equal(0)
      expect(new CudaWarp(block, 5).getNumUnusableThreads()).to.equal(0)
      expect(new CudaWarp(block, block.numWarps - 1).getNumUnusableThreads()).to.not.equal(0)
      expect(new CudaWarp(block, block.numWarps - 1).getNumUnusableThreads()).to.equal(CudaLimits.warpSize - (1000 * 999) % CudaLimits.warpSize)
    })
  })


  describe("getUnusableThreads", () => {
    it("should return the right value [warpSize multiple] (1) ", () => {
      let block = new CudaBlock(1024)
      let unusable = []
      for ( let i = 0; i < block.numWarps; ++i)
        expect(new CudaWarp(block, i).getUnusableThreads()).to.eql(unusable)
    })

    it("should return the right value [warpSize multiple] (2) ", () => {
      let block = new CudaBlock(1024, 1024)
      let unusable = []
      for ( let i = 0; i < block.numWarps; ++i)
        expect(new CudaWarp(block, i).getUnusableThreads()).to.eql(unusable)
    })

    it("should return the right value [not warpSize multiple] (1)", () => {
      let block = new CudaBlock(1000)
      expect(new CudaWarp(block, 0).getUnusableThreads()).to.eql([])
      expect(new CudaWarp(block, 5).getUnusableThreads()).to.eql([])
      expect(new CudaWarp(block, block.numWarps - 1).getUnusableThreads()).to.not.eql([])
      expect(new CudaWarp(block, block.numWarps - 1).getUnusableThreads()).to.eql([8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31])
    })

    it("should return the right value [not warpSize multiple] (2)", () => {
      let block = new CudaBlock(1000, 999)
      let unusable = []
      expect(new CudaWarp(block, 0).getUnusableThreads()).to.eql(unusable)
      expect(new CudaWarp(block, 5).getUnusableThreads()).to.eql(unusable)
      expect(new CudaWarp(block, block.numWarps - 1).getUnusableThreads()).to.not.eql(unusable)
      expect(new CudaWarp(block, block.numWarps - 1).getUnusableThreads()).to.eql([24,25,26,27,28,29,30,31])
    })
  })

})