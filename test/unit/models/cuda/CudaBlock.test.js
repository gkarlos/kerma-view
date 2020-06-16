require('module-alias/register')

const CudaBlock  = require('@renderer/models/cuda').Block
const CudaWarp  = require('@renderer/models/cuda').Warp
const CudaLimits = require('@renderer/models/cuda').Limits
const CudaDim = require('@renderer/models/cuda').Dim
const CudaIndex = require('@renderer/models/cuda').Index

const expect = require('chai').expect

describe('renderer/cuda/CudaBlock', () => {

  describe("constructor", () => {
    it("should not throw on 1D", () => {
      expect(() => new CudaBlock(new CudaDim(1024))).to.not.throw()
      expect(() => new CudaBlock(1024)).to.not.throw()
    })

    it("should not throw on 2D", () => {
      expect(() =>  new CudaBlock(new CudaDim(1024,1))).to.not.throw()
      expect(() =>  new CudaBlock(new CudaDim(10,10))).to.not.throw()
      expect(() =>  new CudaBlock(new CudaDim(10,10,1))).to.not.throw()
      expect(() =>  new CudaBlock(new CudaDim(10,1,10))).to.not.throw()
      expect(() =>  new CudaBlock(new CudaDim(1,10,1))).to.not.throw()
      expect(() =>  new CudaBlock(new CudaDim(1,10))).to.not.throw()
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
      expect(() => new CudaBlock(new CudaDim(1024), -100)).to.throw()
    })

    it("should throw with invalid index (1)", () => {
      //should throw because the index is negative
      expect(() => new CudaBlock(new CudaDim(1024), new CudaIndex(-100))).to.throw()
    })

    it("should not throw with valid index (1)", () => {
      expect(() => new CudaBlock(new CudaDim(1024), new CudaIndex(100))).to.not.throw()
    })

    it("should not throw with valid index (2)", () => {
      expect(() => new CudaBlock(new CudaDim(1024), 1024)).to.not.throw()
    })
  })

  describe('getWarp', () => {
    it('should return the right warp (1)', () => {
      let block = new CudaBlock(256)
      expect(block.getWarp(0).equals(new CudaWarp(block,0))).to.be.true
    })
  })

  describe("getIndex", () => {
    it("should return the index assigned on constructor (1)", () => {
      let block = new CudaBlock(new CudaDim(1024), new CudaIndex(128))
      expect(block.getIndex().equals(new CudaIndex(128))).to.be.true
    })

    it("should return the index assigned on constructor (2)", () => {
      let block = new CudaBlock(new CudaDim(1024), 128)
      expect(block.getIndex().equals(new CudaIndex(128))).to.be.true
    })

    it("should return the index assigned on constructor (3)", () => {
      let block = new CudaBlock(new CudaDim(1024), new CudaDim(100,100))
      expect(block.getIndex().equals(new CudaDim(100,100))).to.be.true
    })

    it("should return the index assigned on constructor (4)", () => {
      let block = new CudaBlock(new CudaDim(1024))
      expect(block.getIndex()).to.be.null
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

  describe("hasIndex", () => {
    it("should throw on invalid index (1)", () => {
      let dim = new CudaDim(1024)
      expect(() => new CudaBlock(dim).hasIndex(-10)).to.throw()
    })

    it("should throw on invalid index (2)", () => {
      let dim = new CudaDim(1024)
      expect(() => new CudaBlock(dim).hasIndex(new CudaIndex(-15))).to.throw()
    })

    it("should throw on invalid index (3)", () => {
      let dim = new CudaDim(1024)
      expect(() => new CudaBlock(dim).hasIndex(undefined)).to.throw()
    })

    it("should throw on invalid index (4)", () => {
      let dim = new CudaDim(1024)
      expect(() => new CudaBlock(dim).hasIndex(null)).to.throw()
    })

    it("should not throw on valid index (1)", () => {
      let dim = new CudaDim(1024)
      expect(() => new CudaBlock(dim).hasIndex(10)).to.not.throw()
    })

    it("should not throw on valid index (2)", () => {
      let dim = new CudaDim(1024)
      expect(() => new CudaBlock(dim).hasIndex(new CudaIndex(1024))).to.not.throw()
    })

    it("should return false (1)", () => {
      expect(new CudaBlock(1024).hasIndex(1024)).to.be.false
    })

    it("should return false (2)", () => {
      expect(new CudaBlock(1024).hasIndex(new CudaIndex(1023,0))).to.be.false
    })

    it("should return false (3)", () => {
      expect(new CudaBlock(new CudaDim(10,10)).hasIndex(new CudaIndex(10,10))).to.be.false
    })

    it("should return true (1)", () => {
      expect(new CudaBlock(1024).hasIndex(1023)).to.be.true
    })

    it("should return true (2)", () => {
      expect(new CudaBlock(1024).hasIndex(new CudaIndex(0,1023))).to.be.true
    })

    it("should return true (3)", () => {
      expect(new CudaBlock(1024).hasIndex(new CudaIndex(0))).to.be.true
    })

    it("should return true (4)", () => {
      expect(new CudaBlock(1024).hasIndex(0)).to.be.true
    })

    it("should return true (5)", () => {
      expect(new CudaBlock(1024).hasIndex(new CudaIndex(0,0))).to.be.true
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
      expect(new CudaBlock(new CudaDim(2,100)).equals(new CudaBlock(new CudaDim(2,1,100)))).to.be.false
    })

    it("should not be equal 2D (5)", () => {
      expect(new CudaBlock(new CudaDim(2,1,100)).equals(new CudaBlock(new CudaDim(2,100)))).to.be.false
    })
  })
})