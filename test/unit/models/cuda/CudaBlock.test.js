require('module-alias/register')

const CudaGrid = require('@renderer/models/cuda/CudaGrid')
const CudaBlock  = require('@renderer/models/cuda/CudaBlock')
const CudaWarp  = require('@renderer/models/cuda/CudaWarp')
const CudaLimits = require('@renderer/models/cuda/CudaLimits')
const CudaDim = require('@renderer/models/cuda/CudaDim')
const CudaIndex = require('@renderer/models/cuda/CudaIndex')

const expect = require('chai').expect

describe('renderer/models/cuda/CudaBlock', () => {

  describe("constructor", () => {
    
    it("should throw on index missmatch (1)", () => {
      let grid = new CudaGrid(1024, 1024)
      expect( () => new CudaBlock(grid,1024)).to.throw(Error)
    })

    it("should throw on index missmatch (2)", () => {
      let grid = new CudaGrid(new CudaDim(4,4), new CudaDim(2,2))
      expect( () => new CudaBlock(grid, 16)).to.throw(Error)
    })

    it("should throw with invalid index (1)", () => {
      let grid = new CudaGrid(new CudaDim(4,4), new CudaDim(2,2))
      expect( () => new CudaBlock(grid, -1)).to.throw(Error)
    })

    it("should throw with invalid index (2)", () => {
      //should throw because the index is negative
      expect(() => new CudaBlock(new CudaGrid(512,512), -100)).to.throw()
    })

    it("should throw with invalid index (3)", () => {
      //should throw because the index is negative
      expect(() => new CudaBlock(new CudaGrid(512,512), new CudaIndex(-100))).to.throw()
    })

    it("should throw with 1D block and 2D index", () => {
      expect(() => new CudaBlock(new CudaGrid(1024,1024), new CudaIndex(2,2))).to.throw()
    })

    it("should throw with index out of range", () => {
      expect(() => new CudaBlock(new CudaGrid(1024,1024), 1024)).to.throw()
    })

    it("should throw with invalid grid", () => {
      //should throw because the grid argument is an integer instead of a CudaGrid
      expect(() => new CudaBlock(1024)).to.throw(Error)
    })

    it("should not throw with valid index (1)", () => {
      expect(() => new CudaBlock(new CudaGrid(160, 1024), new CudaIndex(100))).to.not.throw()
    })

    it("should not throw with valid index (2)", () => {
      expect(() => new CudaBlock(new CudaGrid(1024, 1024), 1023)).to.not.throw()
    })

    it("should not throw with valid index (3)", () => {
      expect(() => new CudaBlock(new CudaGrid(160, 1024), 0)).to.not.throw()
    })
  })

  describe('getFirstGlobalThreadIdx', () => {
    it("should return the right value (1)", () => {
      let grid = new CudaGrid( new CudaDim(4,4), new CudaDim(2,2))
      let block = new CudaBlock( grid, 0)
      expect(block.getFirstGlobalThreadIdx().equals(new CudaIndex(0,0))).to.be.true
    })

    it("should return the right value (2)", () => {
      let grid = new CudaGrid( new CudaDim(4,4), new CudaDim(2,2))
      let block = new CudaBlock( grid, new CudaIndex(0,1))
      expect(block.getFirstGlobalThreadIdx().equals(new CudaIndex(0,2))).to.be.true
    })

    it("should return the right value (3)", () => {
      let grid = new CudaGrid( new CudaDim(4,4), new CudaDim(2,2))
      let block = new CudaBlock( grid, grid.size - 1)
      expect(block.getFirstGlobalThreadIdx().equals(new CudaIndex(6,6))).to.be.true
    })
  })

  describe('getLastGlobalThreadIdx', () => {
    it("should return the right value (1)", () => {
      let grid = new CudaGrid( new CudaDim(4,4), new CudaDim(2,2))
      let block = new CudaBlock( grid, 0)
      expect(block.getLastGlobalThreadIdx().equals(new CudaIndex(1,1))).to.be.true
    })

    it("should return the right value (2)", () => {
      let grid = new CudaGrid( new CudaDim(4,4), new CudaDim(2,2))
      let block = new CudaBlock( grid, new CudaIndex(0,1))
      expect(block.getLastGlobalThreadIdx().equals(new CudaIndex(1,3))).to.be.true
    })

    it("should return the right value (3)", () => {
      let grid = new CudaGrid( new CudaDim(4,4), new CudaDim(2,2))
      let block = new CudaBlock( grid, grid.size - 1)
      expect(block.getLastGlobalThreadIdx().equals(new CudaIndex(7,7))).to.be.true
    })
  })

  describe('getFirstGlobalLinearThreadIdx', () => {
    it("should return the right value (1)", () => {
      let grid = new CudaGrid( new CudaDim(4,4), new CudaDim(2,2))
      let block = new CudaBlock( grid, 0)
      expect(block.getFirstGlobalLinearThreadIdx()).to.equal(0)
    })

    it("should return the right value (2)", () => {
      let grid = new CudaGrid( new CudaDim(4,4), new CudaDim(2,2))
      let block = new CudaBlock( grid, new CudaIndex(0,1))
      expect(block.getFirstGlobalLinearThreadIdx()).to.equal(4)
    })

    it("should return the right value (3)", () => {
      let grid = new CudaGrid( new CudaDim(4,4), new CudaDim(2,2))
      let block = new CudaBlock( grid, new CudaIndex(1,1))
      expect(block.getFirstGlobalLinearThreadIdx()).to.equal(20)
    })

    it("should return the right value (4)", () => {
      let grid = new CudaGrid( new CudaDim(4,4), new CudaDim(10,10))
      let block = new CudaBlock( grid, 2)
      expect(block.getFirstGlobalLinearThreadIdx()).to.equal(200)
    })
  })

  describe('getLastGlobalLinearThreadIdx', () => {
    it("should return the right value (1)", () => {
      let grid = new CudaGrid( new CudaDim(4,4), new CudaDim(2,2))
      let block = new CudaBlock( grid, 0)
      expect(block.getLastGlobalLinearThreadIdx()).to.equal(3)
    })

    it("should return the right value (2)", () => {
      let grid = new CudaGrid( new CudaDim(4,4), new CudaDim(2,2))
      let block = new CudaBlock( grid, 1)
      expect(block.getLastGlobalLinearThreadIdx()).to.equal(7)
    })

    it("should return the right value (3)", () => {
      let grid = new CudaGrid( new CudaDim(4,4), 512)
      let block = new CudaBlock( grid, 1)
      expect(block.getLastGlobalLinearThreadIdx()).to.equal(1023)
    })

    it("should return the right value (4)", () => {
      let grid = new CudaGrid( new CudaDim(4,4), new CudaDim(10,10))
      let block = new CudaBlock( grid, 2)
      expect(block.getLastGlobalLinearThreadIdx()).to.equal(299)
    })
  })

  describe("hasGlobalThreadIdx", () => {
    it("should throw on invalid argument", () => {
      expect(() => new CudaBlock(new CudaGrid(16,16), 0).hasGlobalThreadIdx("abc")).to.throw()
    })

    it("should return true (1)", () => {
      let block = new CudaBlock( new CudaGrid( new CudaDim(2,2), new CudaDim(4,4)), new CudaIndex(1,0))
      expect(block.hasGlobalThreadIdx(new CudaIndex(4,0))).to.be.true
    })

    it("should return true (2)", () => {
      let block = new CudaBlock( new CudaGrid( new CudaDim(2,2), new CudaDim(4,4)), 1)
      expect(block.hasGlobalThreadIdx(new CudaIndex(2,5))).to.be.true
    })

    it("should return true (2)", () => {
      let block = new CudaBlock( new CudaGrid( new CudaDim(2,2), new CudaDim(4,4)), new CudaIndex(1))
      expect(block.hasGlobalThreadIdx(new CudaIndex(2,5))).to.be.true
    })

    it("should return true (2)", () => {
      let block = new CudaBlock( new CudaGrid( new CudaDim(2,2), new CudaDim(4,4)), new CudaIndex(0,1))
      expect(block.hasGlobalThreadIdx(new CudaIndex(2,5))).to.be.true
    })

    it("should return true (3)", () => {
      let block = new CudaBlock( new CudaGrid(2, 8), 0)
      expect(block.hasGlobalThreadIdx(new CudaIndex(0,0))).to.be.true
    })

    it("should return true (3)", () => {
      let block = new CudaBlock( new CudaGrid(2, 8), 0)
      expect(block.hasGlobalThreadIdx(new CudaIndex(0))).to.be.true
    })

    it("should return true (3)", () => {
      let block = new CudaBlock( new CudaGrid(2, 8), 0)
      expect(block.hasGlobalThreadIdx(0)).to.be.true
    })

    it("should return false (1)", () => {
      let block = new CudaBlock( new CudaGrid(2, 8), 1)
      expect(block.hasGlobalThreadIdx(new CudaIndex(2,5))).to.be.false
    })
    
    it("should return false (2)", () => {
      let block = new CudaBlock( new CudaGrid(2, 8), 1)
      expect(block.hasGlobalThreadIdx(new CudaIndex(1,1))).to.be.false
    })

    it("should return false (3)", () => {
      let block = new CudaBlock( new CudaGrid(2, 8), 1)
      expect(block.hasGlobalThreadIdx(new CudaIndex(0,0))).to.be.false
    })

    it("should return false (3)", () => {
      let block = new CudaBlock( new CudaGrid(2, 8), 1)
      expect(block.hasGlobalThreadIdx(new CudaIndex(0))).to.be.false
    })

    it("should return false (3)", () => {
      let block = new CudaBlock( new CudaGrid(2, 8), 1)
      expect(block.hasGlobalThreadIdx(0)).to.be.false
    })
  })

  describe("hasGlobalLinearThreadIdx", () => {

    it("should throw with invalid index", () => {
      let block = new CudaBlock( new CudaGrid(2, 8), 1)
      expect(() => block.hasGlobalLinearThreadIdx( new CudaIndex(0,0))).to.throw(Error)
    })

    it("should return false with negative index", () => {
      let block = new CudaBlock( new CudaGrid(2, 8), 1)
      expect(block.hasGlobalLinearThreadIdx( -1)).to.be.false
    })

    it("should return true (1)", () => {
      let block = new CudaBlock( new CudaGrid(2, 8), 0)
      expect(block.hasGlobalLinearThreadIdx(0)).to.be.true
    })

    it("should return true (1)", () => {
      let block = new CudaBlock( new CudaGrid(2, 8), 0)
      expect(block.hasGlobalLinearThreadIdx(7)).to.be.true
    })

    it("should return true (2)", () => {
      let block = new CudaBlock( new CudaGrid(2, new CudaDim(4,4)), 1)
      expect(block.hasGlobalLinearThreadIdx(16)).to.be.true
    })

    it("should return true (2)", () => {
      let block = new CudaBlock( new CudaGrid(2, new CudaDim(4,4)), 1)
      expect(block.hasGlobalLinearThreadIdx(31)).to.be.true
    })

    it("should return false (1)", () => {
      let block = new CudaBlock( new CudaGrid(2, 8), 1)
      expect(block.hasGlobalLinearThreadIdx(0)).to.be.false
    })

    it("should return false (1)", () => {
      let block = new CudaBlock( new CudaGrid(2, 8), 1)
      expect(block.hasGlobalLinearThreadIdx(7)).to.be.false
    })
  })

  describe('hasWarpIdx', () => {
    it("should throw with wrong type arg (1)", () => {
      let block = new CudaBlock(new CudaGrid(10,10), 0)
      expect(() => block.hasWarpIdx("abc")).to.throw()
    })

    it("should throw with wrong type arg (2)", () => {
      let block = new CudaBlock(new CudaGrid(10,10), 0)
      expect(() => block.hasWarpIdx(new CudaIndex(1,1))).to.throw()
    })
  })

  describe('getWarp', () => {
    it('should return the right warp (1)', () => {
      let grid = new CudaGrid(1024, 256)
      let block = new CudaBlock(grid, 0)
      expect(block.getWarp(0).equals(new CudaWarp(block,0))).to.be.true
    })
  })

  describe("setIndex", () => {
    it("should throw if 2D index passed for 1D grid", () => {
      let grid = new CudaGrid(16,16)
      let block = new CudaBlock(grid, 0)
      expect(() => block.setIndex(new CudaIndex(15,15))).to.throw()
    })

    it("should throw if index out of bounds", () => {
      let grid = new CudaGrid(16,16)
      let block = new CudaBlock(grid, 0)
      expect(() => block.setIndex(16)).to.throw()
    })
  })

  describe("getIndex", () => {
    it("should return the index assigned on constructor (1)", () => {
      let grid = new CudaGrid(256, 1024)
      let block = new CudaBlock(grid, new CudaIndex(128))
      expect(block.getIndex().equals(new CudaIndex(128))).to.be.true
    })

    it("should return the index assigned on constructor (2)", () => {
      let grid = new CudaGrid(1024, 1024)
      let block = new CudaBlock(grid, 128)
      expect(block.getIndex().equals(CudaIndex.delinearize(128, grid.dim))).to.be.true
    })

    it("should return the index assigned on constructor (3)", () => {
      let grid = new CudaGrid(1024, 1024)
      let block = new CudaBlock(grid, 0)
      expect(block.getIndex().equals(new CudaIndex(0,0))).to.be.true
    })

    it("should return the index assigned on constructor (4)", () => {
      let grid = new CudaGrid(1024, 1024)
      let block = new CudaBlock(grid, new CudaIndex(0))
      expect(block.getIndex().equals(new CudaIndex(0))).to.be.true
    })

    it("should return the 1D index assigned with setIndex (1)", () => {
      let grid = new CudaGrid(1024,1024)
      let block = new CudaBlock(grid,16)
      block.setIndex(new CudaIndex(1000))
      expect(block.getIndex().equals(new CudaIndex(1000))).to.be.true
    })

    it("should return the 1D index assigned with setIndex (2)", () => {
      let grid = new CudaGrid(1024,1024)
      let block = new CudaBlock(grid,16)
      block.setIndex(1000)
      expect(block.getIndex().equals(new CudaIndex(1000))).to.be.true
    })

    it("should return the 1D index assigned with setIndex (2)", () => {
      let grid = new CudaGrid(1024,1024)
      let block = new CudaBlock(grid, 1023)
      block.setIndex(CudaIndex.Unknown)
      expect(block.getIndex().equals(CudaIndex.Unknown)).to.be.true
    })
  })

  describe('equals', () => {
    it("should be equal 1D (1)", () => {
      expect(new CudaBlock(new CudaGrid(1024,256), 0).equals(new CudaBlock(new CudaGrid(1024,256), 0))).to.be.true
    })

    it("should be equal 1D (2)", () => {
      expect(new CudaBlock(new CudaGrid(1024,1), 0).equals(new CudaBlock(new CudaGrid(1024,1), 0))).to.be.true
    })

    it("should be equal 1D (3)", () => {
      expect(new CudaBlock(new CudaGrid(16, new CudaDim(256,1)), 0).equals(new CudaBlock( new CudaGrid(16, new CudaDim(256,1)), 0))).to.be.true
    })

    it("should be equal 1D (4)", () => {
      expect(new CudaBlock(new CudaGrid(16, new CudaDim(256,1,1)), 0).equals(new CudaBlock(new CudaGrid(16, new CudaDim(256,1,1)), 0))).to.be.true
    })

    it("should be equal 2D (1)", () => {
      expect(new CudaBlock( new CudaGrid(1, new CudaDim(2,256)), 0).equals(new CudaBlock( new CudaGrid(1, new CudaDim(2,256)), 0))).to.be.true
    })

    it("should be equal 2D (2)", () => {
      expect(new CudaBlock(new CudaGrid(1, new CudaDim(1,256)), 0).equals(new CudaBlock(new CudaGrid(1, new CudaDim(1,256)), 0))).to.be.true
    })

    it("should be equal 2D (3)", () => {
      expect(new CudaBlock(new CudaGrid(1, new CudaDim(10,10)), 0).equals(new CudaBlock(new CudaGrid(1, new CudaDim(10,10)), 0))).to.be.true
    })

    it("should be equal 2D (4)", () => {
      expect(new CudaBlock(new CudaGrid(1, new CudaDim(10)), 0).equals(new CudaBlock(new CudaGrid(1, new CudaDim(10,1)), 0))).to.be.true
    })

    it("should not be equal 1D (1)", () => {
      expect(new CudaBlock(new CudaGrid(1,256), 0).equals(new CudaBlock(new CudaGrid(1,255), 0))).to.be.false
    })

    it("should not be equal 1D (2)", () => {
      expect(new CudaBlock(new CudaGrid(1,256), 0).equals(new CudaBlock(new CudaGrid(2,256), 0))).to.be.false
    })

    it("should not be equal 1D (3)", () => {
      expect(new CudaBlock(new CudaGrid(1,256), 0).equals(new CudaBlock(new CudaGrid(2,256), 1))).to.be.false
    })

    it("should not be equal 2D (1)", () => {
      expect(new CudaBlock(new CudaGrid( 16, new CudaDim(16,16)), 0).equals(new CudaBlock(new CudaGrid( 16, new CudaDim(1,16)), 0))).to.be.false
    })

    it("should not be equal 2D (2)", () => {
      expect(new CudaBlock(new CudaGrid( 16, new CudaDim(1,256)), 0).equals(new CudaBlock(new CudaGrid( 16, new CudaDim(256,1)), 0))).to.be.false
    })

    it("should not be equal 2D (3)", () => {
      expect(new CudaBlock(new CudaGrid( 16, new CudaDim(2,100)), 0).equals(new CudaBlock(new CudaGrid( 16, new CudaDim(2,200)), 0))).to.be.false
    })

    it("should not be equal 2D (4)", () => {
      expect(
        new CudaBlock(new CudaGrid( 16, new CudaDim(64)), 0)
        .equals(
        new CudaBlock(new CudaGrid( 16, new CudaDim(1,64)), 0))
      ).to.be.false
    })

    it("should not be equal 2D (5)", () => {
      expect(
        new CudaBlock(new CudaGrid( 16, new CudaDim(1,64)), 0)
        .equals(
        new CudaBlock(new CudaGrid( 16, new CudaDim(64)), 0))
      ).to.be.false
    })
  })
})