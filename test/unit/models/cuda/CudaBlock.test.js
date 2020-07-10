require('module-alias/register')

const CudaGrid = require('@renderer/models/cuda/CudaGrid')
const CudaBlock  = require('@renderer/models/cuda/CudaBlock')
const { to } = require('cli-color/move')
const CudaWarp  = require('@renderer/models/cuda').Warp
const CudaLimits = require('@renderer/models/cuda').Limits
const CudaDim = require('@renderer/models/cuda').Dim
const CudaIndex = require('@renderer/models/cuda').Index

const expect = require('chai').expect

describe('renderer/models/cuda/CudaBlock', () => {

  describe("constructor", () => {
    
    it("should throw on dim missmatch", () => {
      let grid = new CudaGrid(1024,1024)
      expect(() => new CudaBlock(1025,grid)).to.throw(Error)
    })

    it("should throw on index missmatch (1)", () => {
      let grid = new CudaGrid(1024, 1024)
      expect( () => new CudaBlock(1024,grid,1024)).to.throw(Error)
    })

    it("should throw on index missmatch (2)", () => {
      let grid = new CudaGrid(new CudaDim(4,4), new CudaDim(2,2))
      expect( () => new CudaBlock(new CudaDim(2,2), grid, 16)).to.throw(Error)
    })

    it("should throw on invalid index", () => {
      let grid = new CudaGrid(new CudaDim(4,4), new CudaDim(2,2))
      expect( () => new CudaBlock(new CudaDim(2,2), grid, -1)).to.throw(Error)
    })

    it("should not throw on 1D w/o index", () => {
      expect(() => new CudaBlock(new CudaDim(1024), new CudaGrid(1024,1024))).to.not.throw()
      expect(() => new CudaBlock(1024, new CudaGrid(1024,1024))).to.not.throw()
    })

    it("should not throw on 2D w/o grid+index", () => {
      
      expect(() =>  new CudaBlock(new CudaDim(1024,1),   new CudaGrid(1024, new CudaDim(1024,1)))).to.not.throw()
      expect(() =>  new CudaBlock(new CudaDim(10,10),    new CudaGrid(1024, new CudaDim(10,10)))).to.not.throw()
      expect(() =>  new CudaBlock(new CudaDim(10,10,1),  new CudaGrid(1024, new CudaDim(10,10,1)))).to.not.throw()
      expect(() =>  new CudaBlock(new CudaDim(10,1,10),  new CudaGrid(1024, new CudaDim(10,1,10)))).to.not.throw()
      expect(() =>  new CudaBlock(new CudaDim(1,10,1),   new CudaGrid(1024, new CudaDim(1,10,1)))).to.not.throw()
      expect(() =>  new CudaBlock(new CudaDim(1,10),     new CudaGrid(1024, new CudaDim(1,10)))).to.not.throw()
    })
    
    it("should throw on 3D", () => {
      expect(() => new CudaBlock(new CudaDim(100,2,2))).to.throw()
    })

    it("should throw on invalid 1D dim (1)", () => {
      expect(() => new CudaBlock(new CudaDim(1025))).to.throw()
    })

    it("should throw on invalid 1D dim (2)", () => {
      expect(() => new CudaBlock(new CudaDim(1025,1))).to.throw()
    })

    it("should throw on invalid 1D dim (3)", () => {
      expect(() => new CudaBlock(new CudaDim(1025))).to.throw()
    })

    it("should throw on invalid 2D dim (1)", () => {
      expect(() => new CudaBlock(new CudaDim(1024,2))).to.throw()
    })

    it("should throw on invalid 2D dim (2)", () => {
      expect(() => new CudaBlock(new CudaDim(1,1025))).to.throw()
    })

    it("should throw on invalid 2D dim (3)", () => {
      expect(() =>  new CudaBlock(new CudaDim(1024,1,2))).to.throw()
    })

    it("should throw with invalid index (1)", () => {
      //should throw because the index is negative
      expect(() => new CudaBlock(new CudaDim(1024), null, -100)).to.throw()
    })

    it("should throw with invalid index (1)", () => {
      //should throw because the index is negative
      expect(() => new CudaBlock(new CudaDim(1024), null, new CudaIndex(-100))).to.throw()
    })

    it("should throw with invalid grid", () => {
      //should throw because the grid argument is an integer instead of a CudaGrid
      expect(() => new CudaBlock(1024, 1024)).to.throw(Error)
    })

    it("should not throw with valid grid", () => {
      expect(() => new CudaBlock(1024, new CudaGrid(1024, 1024))).to.not.throw()
    })

    it("should not throw with valid index (1)", () => {
      expect(() => new CudaBlock(new CudaDim(1024), new CudaGrid(160, 1024), new CudaIndex(100))).to.not.throw()
    })

    it("should not throw with valid index (2)", () => {
      expect(() => new CudaBlock(new CudaDim(1024), new CudaGrid(1024, 1024), 1023)).to.not.throw()
    })

    it("should not throw with valid index (3)", () => {
      expect(() => new CudaBlock(new CudaDim(1024), new CudaGrid(160, 1024), 0)).to.not.throw()
    })
  })

  describe('getFirstThreadIdx', () => {
    it("should return the right value (1)", () => {
      let grid = new CudaGrid( new CudaDim(4,4), new CudaDim(2,2))
      let block = new CudaBlock( new CudaDim(2,2), grid, 0)
      expect(block.getFirstThreadIdx().equals(new CudaIndex(0,0))).to.be.true
    })

    it("should return the right value (2)", () => {
      let grid = new CudaGrid( new CudaDim(4,4), new CudaDim(2,2))
      let block = new CudaBlock( new CudaDim(2,2), grid, new CudaIndex(0,1))
      expect(block.getFirstThreadIdx().equals(new CudaIndex(0,2))).to.be.true
    })

    it("should return the right value (3)", () => {
      let grid = new CudaGrid( new CudaDim(4,4), new CudaDim(2,2))
      let block = new CudaBlock( new CudaDim(2,2), grid, grid.size - 1)
      expect(block.getFirstThreadIdx().equals(new CudaIndex(6,6))).to.be.true
    })
  })

  describe('getLastThreadIdx', () => {
    it("should return the right value (1)", () => {
      let grid = new CudaGrid( new CudaDim(4,4), new CudaDim(2,2))
      let block = new CudaBlock( new CudaDim(2,2), grid, 0)
      expect(block.getLastThreadIdx().equals(new CudaIndex(1,1))).to.be.true
    })

    it("should return the right value (2)", () => {
      let grid = new CudaGrid( new CudaDim(4,4), new CudaDim(2,2))
      let block = new CudaBlock( new CudaDim(2,2), grid, new CudaIndex(0,1))
      expect(block.getLastThreadIdx().equals(new CudaIndex(1,3))).to.be.true
    })

    it("should return the right value (3)", () => {
      let grid = new CudaGrid( new CudaDim(4,4), new CudaDim(2,2))
      let block = new CudaBlock( new CudaDim(2,2), grid, grid.size - 1)
      expect(block.getLastThreadIdx().equals(new CudaIndex(7,7))).to.be.true
    })
  })

  describe('getFirstLinearThreadIdx', () => {
    it("should return the right value (1)", () => {
      let grid = new CudaGrid( new CudaDim(4,4), new CudaDim(2,2))
      let block = new CudaBlock( new CudaDim(2,2), grid, 0)
      expect(block.getFirstLinearThreadIdx()).to.equal(0)
    })

    it("should return the right value (2)", () => {
      let grid = new CudaGrid( new CudaDim(4,4), new CudaDim(2,2))
      let block = new CudaBlock( new CudaDim(2,2), grid, new CudaIndex(0,1))
      expect(block.getFirstLinearThreadIdx()).to.equal(4)
    })

    it("should return the right value (3)", () => {
      let grid = new CudaGrid( new CudaDim(4,4), new CudaDim(2,2))
      let block = new CudaBlock( new CudaDim(2,2), grid, new CudaIndex(1,1))
      expect(block.getFirstLinearThreadIdx()).to.equal(20)
    })
  })

  describe('getLastLinearThreadIdx', () => {
    it("should return the right value (1)", () => {
      let grid = new CudaGrid( new CudaDim(4,4), new CudaDim(2,2))
      let block = new CudaBlock( new CudaDim(2,2), grid, 0)
      expect(block.getLastLinearThreadIdx()).to.equal(3)
    })

    it("should return the right value (2)", () => {
      let grid = new CudaGrid( new CudaDim(4,4), new CudaDim(2,2))
      let block = new CudaBlock( new CudaDim(2,2), grid, 1)
      expect(block.getLastLinearThreadIdx()).to.equal(7)
    })
  })

  describe('getWarp', () => {
    it('should return the right warp (1)', () => {
      let grid = new CudaGrid(1024, 256)
      let block = new CudaBlock(256, grid)
      expect(block.getWarp(0).equals(new CudaWarp(block,0))).to.be.true
    })
  })

  describe("getIndex", () => {
    it("should return the index assigned on constructor (1)", () => {
      let grid = new CudaGrid(256, 1024)
      let block = new CudaBlock(new CudaDim(1024), grid, new CudaIndex(128))
      expect(block.getIndex().equals(new CudaIndex(128))).to.be.true
    })

    it("should return the index assigned on constructor (2)", () => {
      let grid = new CudaGrid(1024, 1024)
      let block = new CudaBlock(new CudaDim(1024), grid, 128)
      expect(block.getIndex().equals(CudaIndex.delinearize(128, grid.dim))).to.be.true
    })

    it("should return the index assigned on constructor (3)", () => {
      let grid = new CudaGrid(1024, 1024)
      let block = new CudaBlock(new CudaDim(1024), grid, 0)
      expect(block.getIndex().equals(new CudaIndex(0,0))).to.be.true
    })

    it("should return the index assigned on constructor (4)", () => {
      let grid = new CudaGrid(1024, 1024)
      let block = new CudaBlock(new CudaDim(1024),grid)
      expect(block.getIndex().equals(CudaIndex.Unknown)).to.be.true
    })

    it("should return the index assigned with setIndex (1)", () => {
      let block = new CudaBlock(new CudaDim(1024))
      block.setIndex(new CudaIndex(1024))
      expect(block.getIndex().equals(new CudaIndex(1024))).to.be.true
    })

    it("should return the index assigned with setIndex (2)", () => {
      let block = new CudaBlock(new CudaDim(1024))
      block.setIndex(1024)
      expect(block.getIndex().equals(new CudaIndex(1024))).to.be.true
    })
  })

  describe("hasThreadIndex", () => {
    it("should throw on invalid index (1)", () => {
      let dim = new CudaDim(1024)
      expect(() => new CudaBlock(dim).hasThreadIndex(-10)).to.throw()
    })

    it("should throw on invalid index (2)", () => {
      let dim = new CudaDim(1024)
      expect(() => new CudaBlock(dim).hasThreadIndex(new CudaIndex(-15))).to.throw()
    })

    it("should throw on invalid index (3)", () => {
      let dim = new CudaDim(1024)
      expect(() => new CudaBlock(dim).hasThreadIndex(undefined)).to.throw()
    })

    it("should throw on invalid index (4)", () => {
      let dim = new CudaDim(1024)
      expect(() => new CudaBlock(dim).hasThreadIndex(null)).to.throw()
    })

    it("should not throw on valid index (1)", () => {
      let dim = new CudaDim(1024)
      expect(() => new CudaBlock(dim).hasThreadIndex(10)).to.not.throw()
    })

    it("should not throw on valid index (2)", () => {
      let dim = new CudaDim(1024)
      expect(() => new CudaBlock(dim).hasThreadIndex(new CudaIndex(1024))).to.not.throw()
    })

    it("should return false (1)", () => {
      expect(new CudaBlock(1024).hasThreadIndex(1024)).to.be.false
    })

    it("should return false (2)", () => {
      expect(new CudaBlock(1024).hasThreadIndex(new CudaIndex(1023,0))).to.be.false
    })

    it("should return false (3)", () => {
      expect(new CudaBlock(new CudaDim(10,10)).hasThreadIndex(new CudaIndex(10,10))).to.be.false
    })

    it("should return true (1)", () => {
      expect(new CudaBlock(1024).hasThreadIndex(1023)).to.be.true
    })

    it("should return true (2)", () => {
      expect(new CudaBlock(1024).hasThreadIndex(new CudaIndex(0,1023))).to.be.true
    })

    it("should return true (3)", () => {
      expect(new CudaBlock(1024).hasThreadIndex(new CudaIndex(0))).to.be.true
    })

    it("should return true (4)", () => {
      expect(new CudaBlock(1024).hasThreadIndex(0)).to.be.true
    })

    it("should return true (5)", () => {
      expect(new CudaBlock(1024).hasThreadIndex(new CudaIndex(0,0))).to.be.true
    })
  })

  describe("setIndex", () => {

  })

  describe('equals', () => {
    it("should be equal 1D (1)", () => {
      expect(new CudaBlock(256).equals(new CudaBlock(256))).to.be.true
    })

    it("should be equal 1D (2)", () => {
      expect(new CudaBlock(1).equals(new CudaBlock(1))).to.be.true
    })

    it("should be equal 1D (3)", () => {
      expect(new CudaBlock(256).equals(new CudaBlock(new CudaDim(256)))).to.be.true
    })

    it("should be equal 1D (4)", () => {
      expect(new CudaBlock(256).equals(new CudaBlock(new CudaDim(256,1)))).to.be.true
    })

    it("should be equal 1D (5)", () => {
      expect(new CudaBlock(256).equals(new CudaBlock(new CudaDim(256,1,1)))).to.be.true
    })

    it("should be equal 1D (2)", () => {
      expect(new CudaBlock(123).equals(new CudaBlock(123))).to.be.true
    })

    it("should be equal 2D (1)", () => {
      expect(new CudaBlock(new CudaDim(2,256)).equals(new CudaBlock(new CudaDim(2,256)))).to.be.true
    })

    it("should be equal 2D (2)", () => {
      expect(new CudaBlock(new CudaDim(1,256)).equals(new CudaBlock(new CudaDim(1,256)))).to.be.true
    })

    it("should be equal 2D (3)", () => {
      expect(new CudaBlock(new CudaDim(10,10)).equals(new CudaBlock(new CudaDim(10,10)))).to.be.true
    })

    it("should be equal 2D (4)", () => {
      expect(new CudaBlock(new CudaDim(10)).equals(new CudaBlock(new CudaDim(10,1)))).to.be.true
    })

    it("should be equal 2D (5)", () => {
      expect(new CudaBlock(new CudaDim(10)).equals(new CudaBlock(10))).to.be.true
    })
  
    it("should not be equal 1D (1)", () => {
      expect(new CudaBlock(256).equals(new CudaBlock(255))).to.be.false
    })

    it("should not be equal 1D (2)", () => {
      expect(new CudaBlock(1).equals(new CudaBlock(2))).to.be.false
    })

    it("should not be equal 1D (3)", () => {
      expect(new CudaBlock(123).equals(new CudaBlock(12))).to.be.false
    })

    it("should not be equal 1D (4)", () => {
      expect(new CudaBlock(256).equals(new CudaBlock(new CudaDim(255)))).to.be.false
    })

    it("should not be equal 1D (5)", () => {
      expect(new CudaBlock(256).equals(new CudaBlock(new CudaDim(1,256)))).to.be.false
    })

    it("should not be equal 1D (5)", () => {
      expect(new CudaBlock(1,256).equals(new CudaBlock(new CudaDim(256)))).to.be.false
    })

    it("should not be equal 2D (1)", () => {
      expect(new CudaBlock(new CudaDim(16,16)).equals(new CudaDim(1,16))).to.be.false
    })

    it("should not be equal 2D (2)", () => {
      expect(new CudaBlock(new CudaDim(1,256)).equals(new CudaBlock(new CudaDim(256,1)))).to.be.false
    })

    it("should not be equal 2D (3)", () => {
      expect(new CudaBlock(new CudaDim(2,100)).equals(new CudaBlock(new CudaDim(2,200)))).to.be.false
    })

    it("should not be equal 2D (4)", () => {
      expect(new CudaBlock(new CudaDim(2,64)).equals(new CudaBlock(new CudaDim(2,1,64)))).to.be.false
    })

    it("should not be equal 2D (5)", () => {
      expect(new CudaBlock(new CudaDim(2,1,64)).equals(new CudaBlock(new CudaDim(2,64)))).to.be.false
    })
  })
})