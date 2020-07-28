require('module-alias/register')

const CuGrid = require('@renderer/models/cuda/CuGrid')
const CuBlock  = require('@renderer/models/cuda/CuBlock')
const CuWarp  = require('@renderer/models/cuda/CuWarp')
const CuLimits = require('@renderer/models/cuda/CuLimits')
const CuDim = require('@renderer/models/cuda/CuDim')
const CuIndex = require('@renderer/models/cuda/CuIndex')

const expect = require('chai').expect

describe('renderer/models/cuda/CuBlock', () => {

  describe("constructor", () => {
    
    it("should throw on index missmatch (1)", () => {
      let grid = new CuGrid(1024, 1024)
      expect( () => new CuBlock(grid,1024)).to.throw(Error)
    })

    it("should throw on index missmatch (2)", () => {
      let grid = new CuGrid(new CuDim(4,4), new CuDim(2,2))
      expect( () => new CuBlock(grid, 16)).to.throw(Error)
    })

    it("should throw with invalid index (1)", () => {
      let grid = new CuGrid(new CuDim(4,4), new CuDim(2,2))
      expect( () => new CuBlock(grid, -1)).to.throw(Error)
    })

    it("should throw with invalid index (2)", () => {
      //should throw because the index is negative
      expect(() => new CuBlock(new CuGrid(512,512), -100)).to.throw()
    })

    it("should throw with invalid index (3)", () => {
      //should throw because the index is negative
      expect(() => new CuBlock(new CuGrid(512,512), new CuIndex(-100))).to.throw()
    })

    it("should throw with 1D block and 2D index", () => {
      expect(() => new CuBlock(new CuGrid(1024,1024), new CuIndex(2,2))).to.throw()
    })

    it("should throw with index out of range", () => {
      expect(() => new CuBlock(new CuGrid(1024,1024), 1024)).to.throw()
    })

    it("should throw with invalid grid", () => {
      //should throw because the grid argument is an integer instead of a CuGrid
      expect(() => new CuBlock(1024)).to.throw(Error)
    })

    it("should not throw with valid index (1)", () => {
      expect(() => new CuBlock(new CuGrid(160, 1024), new CuIndex(100))).to.not.throw()
    })

    it("should not throw with valid index (2)", () => {
      expect(() => new CuBlock(new CuGrid(1024, 1024), 1023)).to.not.throw()
    })

    it("should not throw with valid index (3)", () => {
      expect(() => new CuBlock(new CuGrid(160, 1024), 0)).to.not.throw()
    })
  })

  describe('getFirstGlobalThreadIdx', () => {
    it("should return the right value (1)", () => {
      let grid = new CuGrid( new CuDim(4,4), new CuDim(2,2))
      let block = new CuBlock( grid, 0)
      expect(block.getFirstGlobalThreadIdx().equals(new CuIndex(0,0))).to.be.true
    })

    it("should return the right value (2)", () => {
      let grid = new CuGrid( new CuDim(4,4), new CuDim(2,2))
      let block = new CuBlock( grid, new CuIndex(0,1))
      expect(block.getFirstGlobalThreadIdx().equals(new CuIndex(0,2))).to.be.true
    })

    it("should return the right value (3)", () => {
      let grid = new CuGrid( new CuDim(4,4), new CuDim(2,2))
      let block = new CuBlock( grid, grid.size - 1)
      expect(block.getFirstGlobalThreadIdx().equals(new CuIndex(6,6))).to.be.true
    })
  })

  describe('getLastGlobalThreadIdx', () => {
    it("should return the right value (1)", () => {
      let grid = new CuGrid( new CuDim(4,4), new CuDim(2,2))
      let block = new CuBlock( grid, 0)
      expect(block.getLastGlobalThreadIdx().equals(new CuIndex(1,1))).to.be.true
    })

    it("should return the right value (2)", () => {
      let grid = new CuGrid( new CuDim(4,4), new CuDim(2,2))
      let block = new CuBlock( grid, new CuIndex(0,1))
      expect(block.getLastGlobalThreadIdx().equals(new CuIndex(1,3))).to.be.true
    })

    it("should return the right value (3)", () => {
      let grid = new CuGrid( new CuDim(4,4), new CuDim(2,2))
      let block = new CuBlock( grid, grid.size - 1)
      expect(block.getLastGlobalThreadIdx().equals(new CuIndex(7,7))).to.be.true
    })
  })

  describe('getFirstGlobalLinearThreadIdx', () => {
    it("should return the right value (1)", () => {
      let grid = new CuGrid( new CuDim(4,4), new CuDim(2,2))
      let block = new CuBlock( grid, 0)
      expect(block.getFirstGlobalLinearThreadIdx()).to.equal(0)
    })

    it("should return the right value (2)", () => {
      let grid = new CuGrid( new CuDim(4,4), new CuDim(2,2))
      let block = new CuBlock( grid, new CuIndex(0,1))
      expect(block.getFirstGlobalLinearThreadIdx()).to.equal(4)
    })

    it("should return the right value (3)", () => {
      let grid = new CuGrid( new CuDim(4,4), new CuDim(2,2))
      let block = new CuBlock( grid, new CuIndex(1,1))
      expect(block.getFirstGlobalLinearThreadIdx()).to.equal(20)
    })

    it("should return the right value (4)", () => {
      let grid = new CuGrid( new CuDim(4,4), new CuDim(10,10))
      let block = new CuBlock( grid, 2)
      expect(block.getFirstGlobalLinearThreadIdx()).to.equal(200)
    })
  })

  describe('getLastGlobalLinearThreadIdx', () => {
    it("should return the right value (1)", () => {
      let grid = new CuGrid( new CuDim(4,4), new CuDim(2,2))
      let block = new CuBlock( grid, 0)
      expect(block.getLastGlobalLinearThreadIdx()).to.equal(3)
    })

    it("should return the right value (2)", () => {
      let grid = new CuGrid( new CuDim(4,4), new CuDim(2,2))
      let block = new CuBlock( grid, 1)
      expect(block.getLastGlobalLinearThreadIdx()).to.equal(7)
    })

    it("should return the right value (3)", () => {
      let grid = new CuGrid( new CuDim(4,4), 512)
      let block = new CuBlock( grid, 1)
      expect(block.getLastGlobalLinearThreadIdx()).to.equal(1023)
    })

    it("should return the right value (4)", () => {
      let grid = new CuGrid( new CuDim(4,4), new CuDim(10,10))
      let block = new CuBlock( grid, 2)
      expect(block.getLastGlobalLinearThreadIdx()).to.equal(299)
    })
  })

  describe("hasGlobalThreadIdx", () => {
    it("should throw on invalid argument", () => {
      expect(() => new CuBlock(new CuGrid(16,16), 0).hasGlobalThreadIdx("abc")).to.throw()
    })

    it("should return true (1)", () => {
      let block = new CuBlock( new CuGrid( new CuDim(2,2), new CuDim(4,4)), new CuIndex(1,0))
      expect(block.hasGlobalThreadIdx(new CuIndex(4,0))).to.be.true
    })

    it("should return true (2)", () => {
      let block = new CuBlock( new CuGrid( new CuDim(2,2), new CuDim(4,4)), 1)
      expect(block.hasGlobalThreadIdx(new CuIndex(2,5))).to.be.true
    })

    it("should return true (2)", () => {
      let block = new CuBlock( new CuGrid( new CuDim(2,2), new CuDim(4,4)), new CuIndex(1))
      expect(block.hasGlobalThreadIdx(new CuIndex(2,5))).to.be.true
    })

    it("should return true (2)", () => {
      let block = new CuBlock( new CuGrid( new CuDim(2,2), new CuDim(4,4)), new CuIndex(0,1))
      expect(block.hasGlobalThreadIdx(new CuIndex(2,5))).to.be.true
    })

    it("should return true (3)", () => {
      let block = new CuBlock( new CuGrid(2, 8), 0)
      expect(block.hasGlobalThreadIdx(new CuIndex(0,0))).to.be.true
    })

    it("should return true (3)", () => {
      let block = new CuBlock( new CuGrid(2, 8), 0)
      expect(block.hasGlobalThreadIdx(new CuIndex(0))).to.be.true
    })

    it("should return true (3)", () => {
      let block = new CuBlock( new CuGrid(2, 8), 0)
      expect(block.hasGlobalThreadIdx(0)).to.be.true
    })

    it("should return false (1)", () => {
      let block = new CuBlock( new CuGrid(2, 8), 1)
      expect(block.hasGlobalThreadIdx(new CuIndex(2,5))).to.be.false
    })
    
    it("should return false (2)", () => {
      let block = new CuBlock( new CuGrid(2, 8), 1)
      expect(block.hasGlobalThreadIdx(new CuIndex(1,1))).to.be.false
    })

    it("should return false (3)", () => {
      let block = new CuBlock( new CuGrid(2, 8), 1)
      expect(block.hasGlobalThreadIdx(new CuIndex(0,0))).to.be.false
    })

    it("should return false (3)", () => {
      let block = new CuBlock( new CuGrid(2, 8), 1)
      expect(block.hasGlobalThreadIdx(new CuIndex(0))).to.be.false
    })

    it("should return false (3)", () => {
      let block = new CuBlock( new CuGrid(2, 8), 1)
      expect(block.hasGlobalThreadIdx(0)).to.be.false
    })
  })

  describe("hasGlobalLinearThreadIdx", () => {

    it("should throw with invalid index", () => {
      let block = new CuBlock( new CuGrid(2, 8), 1)
      expect(() => block.hasGlobalLinearThreadIdx( new CuIndex(0,0))).to.throw(Error)
    })

    it("should return false with negative index", () => {
      let block = new CuBlock( new CuGrid(2, 8), 1)
      expect(block.hasGlobalLinearThreadIdx( -1)).to.be.false
    })

    it("should return true (1)", () => {
      let block = new CuBlock( new CuGrid(2, 8), 0)
      expect(block.hasGlobalLinearThreadIdx(0)).to.be.true
    })

    it("should return true (1)", () => {
      let block = new CuBlock( new CuGrid(2, 8), 0)
      expect(block.hasGlobalLinearThreadIdx(7)).to.be.true
    })

    it("should return true (2)", () => {
      let block = new CuBlock( new CuGrid(2, new CuDim(4,4)), 1)
      expect(block.hasGlobalLinearThreadIdx(16)).to.be.true
    })

    it("should return true (2)", () => {
      let block = new CuBlock( new CuGrid(2, new CuDim(4,4)), 1)
      expect(block.hasGlobalLinearThreadIdx(31)).to.be.true
    })

    it("should return false (1)", () => {
      let block = new CuBlock( new CuGrid(2, 8), 1)
      expect(block.hasGlobalLinearThreadIdx(0)).to.be.false
    })

    it("should return false (1)", () => {
      let block = new CuBlock( new CuGrid(2, 8), 1)
      expect(block.hasGlobalLinearThreadIdx(7)).to.be.false
    })
  })

  describe('hasWarpIdx', () => {
    it("should throw with wrong type arg (1)", () => {
      let block = new CuBlock(new CuGrid(10,10), 0)
      expect(() => block.hasWarpIdx("abc")).to.throw()
    })

    it("should throw with wrong type arg (2)", () => {
      let block = new CuBlock(new CuGrid(10,10), 0)
      expect(() => block.hasWarpIdx(new CuIndex(1,1))).to.throw()
    })
  })

  describe('getWarp', () => {
    it('should return the right warp (1)', () => {
      let grid = new CuGrid(1024, 256)
      let block = new CuBlock(grid, 0)
      expect(block.getWarp(0).equals(new CuWarp(block,0))).to.be.true
    })
  })

  describe("setIndex", () => {
    it("should throw if 2D index passed for 1D grid", () => {
      let grid = new CuGrid(16,16)
      let block = new CuBlock(grid, 0)
      expect(() => block.setIndex(new CuIndex(15,15))).to.throw()
    })

    it("should throw if index out of bounds", () => {
      let grid = new CuGrid(16,16)
      let block = new CuBlock(grid, 0)
      expect(() => block.setIndex(16)).to.throw()
    })
  })

  describe("getIndex", () => {
    it("should return the index assigned on constructor (1)", () => {
      let grid = new CuGrid(256, 1024)
      let block = new CuBlock(grid, new CuIndex(128))
      expect(block.getIndex().equals(new CuIndex(128))).to.be.true
    })

    it("should return the index assigned on constructor (2)", () => {
      let grid = new CuGrid(1024, 1024)
      let block = new CuBlock(grid, 128)
      expect(block.getIndex().equals(CuIndex.delinearize(128, grid.dim))).to.be.true
    })

    it("should return the index assigned on constructor (3)", () => {
      let grid = new CuGrid(1024, 1024)
      let block = new CuBlock(grid, 0)
      expect(block.getIndex().equals(new CuIndex(0,0))).to.be.true
    })

    it("should return the index assigned on constructor (4)", () => {
      let grid = new CuGrid(1024, 1024)
      let block = new CuBlock(grid, new CuIndex(0))
      expect(block.getIndex().equals(new CuIndex(0))).to.be.true
    })

    it("should return the 1D index assigned with setIndex (1)", () => {
      let grid = new CuGrid(1024,1024)
      let block = new CuBlock(grid,16)
      block.setIndex(new CuIndex(1000))
      expect(block.getIndex().equals(new CuIndex(1000))).to.be.true
    })

    it("should return the 1D index assigned with setIndex (2)", () => {
      let grid = new CuGrid(1024,1024)
      let block = new CuBlock(grid,16)
      block.setIndex(1000)
      expect(block.getIndex().equals(new CuIndex(1000))).to.be.true
    })

    it("should return the 1D index assigned with setIndex (2)", () => {
      let grid = new CuGrid(1024,1024)
      let block = new CuBlock(grid, 1023)
      block.setIndex(CuIndex.Unknown)
      expect(block.getIndex().equals(CuIndex.Unknown)).to.be.true
    })
  })

  describe('equals', () => {
    it("should be equal 1D (1)", () => {
      expect(new CuBlock(new CuGrid(1024,256), 0).equals(new CuBlock(new CuGrid(1024,256), 0))).to.be.true
    })

    it("should be equal 1D (2)", () => {
      expect(new CuBlock(new CuGrid(1024,1), 0).equals(new CuBlock(new CuGrid(1024,1), 0))).to.be.true
    })

    it("should be equal 1D (3)", () => {
      expect(new CuBlock(new CuGrid(16, new CuDim(256,1)), 0).equals(new CuBlock( new CuGrid(16, new CuDim(256,1)), 0))).to.be.true
    })

    it("should be equal 1D (4)", () => {
      expect(new CuBlock(new CuGrid(16, new CuDim(256,1,1)), 0).equals(new CuBlock(new CuGrid(16, new CuDim(256,1,1)), 0))).to.be.true
    })

    it("should be equal 2D (1)", () => {
      expect(new CuBlock( new CuGrid(1, new CuDim(2,256)), 0).equals(new CuBlock( new CuGrid(1, new CuDim(2,256)), 0))).to.be.true
    })

    it("should be equal 2D (2)", () => {
      expect(new CuBlock(new CuGrid(1, new CuDim(1,256)), 0).equals(new CuBlock(new CuGrid(1, new CuDim(1,256)), 0))).to.be.true
    })

    it("should be equal 2D (3)", () => {
      expect(new CuBlock(new CuGrid(1, new CuDim(10,10)), 0).equals(new CuBlock(new CuGrid(1, new CuDim(10,10)), 0))).to.be.true
    })

    it("should be equal 2D (4)", () => {
      expect(new CuBlock(new CuGrid(1, new CuDim(10)), 0).equals(new CuBlock(new CuGrid(1, new CuDim(10,1)), 0))).to.be.true
    })

    it("should not be equal 1D (1)", () => {
      expect(new CuBlock(new CuGrid(1,256), 0).equals(new CuBlock(new CuGrid(1,255), 0))).to.be.false
    })

    it("should not be equal 1D (2)", () => {
      expect(new CuBlock(new CuGrid(1,256), 0).equals(new CuBlock(new CuGrid(2,256), 0))).to.be.false
    })

    it("should not be equal 1D (3)", () => {
      expect(new CuBlock(new CuGrid(1,256), 0).equals(new CuBlock(new CuGrid(2,256), 1))).to.be.false
    })

    it("should not be equal 2D (1)", () => {
      expect(new CuBlock(new CuGrid( 16, new CuDim(16,16)), 0).equals(new CuBlock(new CuGrid( 16, new CuDim(1,16)), 0))).to.be.false
    })

    it("should not be equal 2D (2)", () => {
      expect(new CuBlock(new CuGrid( 16, new CuDim(1,256)), 0).equals(new CuBlock(new CuGrid( 16, new CuDim(256,1)), 0))).to.be.false
    })

    it("should not be equal 2D (3)", () => {
      expect(new CuBlock(new CuGrid( 16, new CuDim(2,100)), 0).equals(new CuBlock(new CuGrid( 16, new CuDim(2,200)), 0))).to.be.false
    })

    it("should not be equal 2D (4)", () => {
      expect(
        new CuBlock(new CuGrid( 16, new CuDim(64)), 0)
        .equals(
        new CuBlock(new CuGrid( 16, new CuDim(1,64)), 0))
      ).to.be.false
    })

    it("should not be equal 2D (5)", () => {
      expect(
        new CuBlock(new CuGrid( 16, new CuDim(1,64)), 0)
        .equals(
        new CuBlock(new CuGrid( 16, new CuDim(64)), 0))
      ).to.be.false
    })
  })
})