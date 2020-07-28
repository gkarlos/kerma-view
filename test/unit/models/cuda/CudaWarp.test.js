require('module-alias/register')
const CuBlock  = require('@renderer/models/cuda/CuBlock')
const CuWarp   = require('@renderer/models/cuda/CuWarp')
const CuLimits = require('@renderer/models/cuda/CuLimits')
const CuDim    = require('@renderer/models/cuda/CuDim')
const CuIndex  = require('@renderer/models/cuda/CuIndex')
const CuGrid   = require('@renderer/models/cuda/CuGrid')

const expect = require('chai').expect

describe('renderer/models/cuda/CuWarp', () => {

  describe("constructor", () => {

    it("should throw with missing args", () => {
      expect(() => new CuWarp(null,null)).to.throw()
      expect(() => new CuWarp()).to.throw()
      expect(() => new CuWarp(undefined)).to.throw()
      expect(() => new CuWarp(undefined, undefined)).to.throw()
    })

    it("should throw with invalid arg types", () => {
      expect(() => new CuWarp("a","b")).to.throw()
      expect(() => new CuWarp(1)).to.throw()
      expect(() => new CuWarp(1,1)).to.throw()
      expect(() => new CuWarp(1.2)).to.throw()
    })

    it("should not throw with valid arg type", () => {
      expect(() => new CuWarp(new CuBlock(new CuGrid(16,16), 0), 0)).to.not.throw()
      expect(() => new CuWarp(new CuBlock(new CuGrid(16,16), 0), new CuIndex(0))).to.not.throw()
    })  

    it("should throw with 2D CuIndex", () => {
      expect(() => new CuWarp(new CuBlock(new CuGrid(16,16), 0), new CuIndex(2,2))).to.throw()
      expect(() => new CuWarp(new CuBlock(new CuGrid(16,16), 0), new CuIndex(1,2))).to.throw()
    })

    it("should throw with invalid int index", () => {
      expect(() => new CuWarp( new CuBlock(new CuGrid(16,16), 0), 1024)).to.throw()
    })
  })

  describe("equals", () => {
    it("should be equal (1)", () => {
      let grid = new CuGrid(512,512)
      let block = new CuBlock(grid, 0)
      expect(new CuWarp(block, 0).equals(new CuWarp(block, 0))).to.be.true
    })

    it("should be equal (2)", () => {
      let w1 = new CuWarp(new CuBlock(new CuGrid(2, new CuDim(256,2)), 1), 2)
      let w2 = new CuWarp(new CuBlock(new CuGrid(2, new CuDim(256,2)), 1), 2)
      expect(w1.equals(w2)).to.be.true
    })

    it("should not be equal (1)", () => {
      expect(
        new CuWarp(new CuBlock(new CuGrid(2, new CuDim(256,2)), 1), 2)
        .equals(
        new CuWarp(new CuBlock(new CuGrid(2, new CuDim(256,4)), 1), 2) )
      ).to.be.false
    })

    it("should not be equal (2)", () => {
      expect(
          new CuWarp(new CuBlock(new CuGrid(2, new CuDim(256,2)), 1), 2)
          .equals(
          new CuWarp(new CuBlock(new CuGrid(2, new CuDim(256,2)), 1), 3)) 
      ).to.be.false
    })
  })


  describe("getNumUsableLanes", () => {
    it("should return the right value [warpSize multiple] (1) ", () => {
      let block = new CuBlock(new CuGrid(1024,1024), 0)
      for ( let i = 0; i < block.numWarps; ++i)
        expect(new CuWarp(block, i).getNumUsableLanes()).to.equal(CuLimits.warpSize)
    })

    it("should return the right value [warpSize multiple] (2) ", () => {
      let block = new CuBlock(new CuGrid(1024,512), 0)
      for ( let i = 0; i < block.numWarps; ++i)
        expect(new CuWarp(block, i).getNumUsableLanes()).to.equal(CuLimits.warpSize)
    })

    it("should return the right value [warpSize multiple] (3) ", () => {
      let block = new CuBlock(new CuGrid(1024,32), 0)
      for ( let i = 0; i < block.numWarps; ++i)
        expect(new CuWarp(block, i).getNumUsableLanes()).to.equal(CuLimits.warpSize)
    })

    it("should return the right value [not warpSize multiple] (1)", () => {
      let block = new CuBlock(new CuGrid(1024,1000), 0)
      expect(new CuWarp(block, 0).getNumUsableLanes()).to.equal(CuLimits.warpSize)
      expect(new CuWarp(block, 5).getNumUsableLanes()).to.equal(CuLimits.warpSize)
      expect(new CuWarp(block, block.numWarps - 1).getNumUsableLanes()).to.not.equal(CuLimits.warpSize)
      expect(new CuWarp(block, block.numWarps - 1).getNumUsableLanes()).to.equal(1000 % CuLimits.warpSize)
    })

    it("should return the right value [not warpSize multiple] (2)", () => {
      let block = new CuBlock(new CuGrid(1024, new CuDim(10,99)), 0)
      expect(new CuWarp(block, 0).getNumUsableLanes()).to.equal(CuLimits.warpSize)
      expect(new CuWarp(block, 5).getNumUsableLanes()).to.equal(CuLimits.warpSize)
      expect(new CuWarp(block, block.numWarps - 1).getNumUsableLanes()).to.not.equal(CuLimits.warpSize)
      expect(new CuWarp(block, block.numWarps - 1).getNumUsableLanes()).to.equal((10* 99) % CuLimits.warpSize)
    })

    it("should return the right value [not warpSize multiple] (3)", () => {
      let block = new CuBlock(new CuGrid(1024, 5), 0)
      expect(new CuWarp(block, 0).getNumUsableLanes()).to.equal(5)
    })
  })

  describe("getNumUnusableLanes", () => {
    it("should return the right value [warpSize multiple] (1) ", () => {
      let block = new CuBlock(new CuGrid(1024,1024), 0)
      for ( let i = 0; i < block.numWarps; ++i)
        expect(new CuWarp(block, i).getNumUnusableLanes()).to.equal(0)
    })

    it("should return the right value [warpSize multiple] (2) ", () => {
      let block = new CuBlock(new CuGrid(1024,512), 0)
      for ( let i = 0; i < block.numWarps; ++i)
        expect(new CuWarp(block, i).getNumUnusableLanes()).to.equal(0)
    })

    it("should return the right value [warpSize multiple] (3) ", () => {
      let block = new CuBlock(new CuGrid(1024,32), 0)
      for ( let i = 0; i < block.numWarps; ++i)
        expect(new CuWarp(block, i).getNumUnusableLanes()).to.equal(0)
    })

    it("should return the right value [not warpSize multiple] (1)", () => {
      let block = new CuBlock(new CuGrid(1024,1000), 0)
      expect(new CuWarp(block, 0).getNumUnusableLanes()).to.equal(0)
      expect(new CuWarp(block, 5).getNumUnusableLanes()).to.equal(0)
      expect(new CuWarp(block, block.numWarps - 1).getNumUnusableLanes()).to.not.equal(0)
      expect(new CuWarp(block, block.numWarps - 1).getNumUnusableLanes()).to.equal(CuLimits.warpSize - 1000 % CuLimits.warpSize)
    })

    it("should return the right value [not warpSize multiple] (2)", () => {
      let block = new CuBlock(new CuGrid(1024,new CuDim(10,99)), 0)
      expect(new CuWarp(block, 0).getNumUnusableLanes()).to.equal(0)
      expect(new CuWarp(block, 5).getNumUnusableLanes()).to.equal(0)
      expect(new CuWarp(block, block.numWarps - 1).getNumUnusableLanes()).to.not.equal(0)
      expect(new CuWarp(block, block.numWarps - 1).getNumUnusableLanes()).to.equal(2)
    })
  })

  describe("getUsableLaneIndices", () => {
    it("should return the right value [warpSize multiple] (1) ", () => {
      let block = new CuBlock( new CuGrid(1024,1024), 0)
      let usable = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]
      for ( let i = 0; i < block.numWarps; ++i)
        expect(new CuWarp(block, i).getUsableLaneIndices()).to.eql(usable)
    })

    it("should return the right value [warpSize multiple] (2) ", () => {
      let block = new CuBlock( new CuGrid(1024,512), 0)
      let usable = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]
      for ( let i = 0; i < block.numWarps; ++i)
        expect(new CuWarp(block, i).getUsableLaneIndices()).to.eql(usable)
    })

    it("should return the right value [warpSize multiple] (3) ", () => {
      let usable = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]
      block = new CuBlock(new CuGrid(1024,32), 0)
      for ( let i = 0; i < block.numWarps; ++i)
        expect(new CuWarp(block, i).getUsableLaneIndices()).to.eql(usable)
    })

    it("should return the right value [not warpSize multiple] (1)", () => {
      let block = new CuBlock(new CuGrid(1024,1000), 0)
      expect(new CuWarp(block, 0).getUsableLaneIndices()).to.eql([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31])
      expect(new CuWarp(block, 5).getUsableLaneIndices()).to.eql([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31])
      expect(new CuWarp(block, block.numWarps - 1).getUsableLaneIndices()).to.not.eql([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31])
      expect(new CuWarp(block, block.numWarps - 1).getUsableLaneIndices()).to.eql([0,1,2,3,4,5,6,7])
    })

    it("should return the right value [not warpSize multiple] (2)", () => {
      let block = new CuBlock(new CuGrid(1024,new CuDim(10,99)), 0)
      let usable = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]
      expect(new CuWarp(block, 0).getUsableLaneIndices()).to.eql(usable)
      expect(new CuWarp(block, 5).getUsableLaneIndices()).to.eql(usable)
      expect(new CuWarp(block, block.numWarps - 1).getUsableLaneIndices()).to.not.eql(usable)
      expect(new CuWarp(block, block.numWarps - 1).getUsableLaneIndices()).to.eql([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29])
    })
  })


  describe("getUnusableLaneIndices", () => {
    it("should return the right value [warpSize multiple] (1) ", () => {
      let block = new CuBlock( new CuGrid(1024,512), 0)
      let unusable = []
      for ( let i = 0; i < block.numWarps; ++i)
        expect(new CuWarp(block, i).getUnusableLaneIndices()).to.eql(unusable)
    })

    it("should return the right value [warpSize multiple] (2) ", () => {
      let block = new CuBlock( new CuGrid(1024,1024), 0)
      let unusable = []
      for ( let i = 0; i < block.numWarps; ++i)
        expect(new CuWarp(block, i).getUnusableLaneIndices()).to.eql(unusable)
    })

    it("should return the right value [warpSize multiple] (2) ", () => {
      let block = new CuBlock( new CuGrid(1024,32), 0)
      let unusable = []
      for ( let i = 0; i < block.numWarps; ++i)
        expect(new CuWarp(block, i).getUnusableLaneIndices()).to.eql(unusable)
    })

    it("should return the right value [not warpSize multiple] (1)", () => {
      let block = new CuBlock( new CuGrid(1024,1000), 0)
      expect(new CuWarp(block, 0).getUnusableLaneIndices()).to.eql([])
      expect(new CuWarp(block, 5).getUnusableLaneIndices()).to.eql([])
      expect(new CuWarp(block, block.numWarps - 1).getUnusableLaneIndices()).to.not.eql([])
      expect(new CuWarp(block, block.numWarps - 1).getUnusableLaneIndices()).to.eql([8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31])
    })

    it("should return the right value [not warpSize multiple] (2)", () => {
      let block = new CuBlock( new CuGrid(1024, new CuDim(10,99)), 0)
      let unusable = []
      expect(new CuWarp(block, 0).getUnusableLaneIndices()).to.eql(unusable)
      expect(new CuWarp(block, 5).getUnusableLaneIndices()).to.eql(unusable)
      expect(new CuWarp(block, block.numWarps - 1).getUnusableLaneIndices()).to.not.eql(unusable)
      expect(new CuWarp(block, block.numWarps - 1).getUnusableLaneIndices()).to.eql([30,31])
    })
  })

})