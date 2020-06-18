require('module-alias/register')
const CudaDim = require('@renderer/models/cuda').Dim
const CudaIndex = require('@renderer/models/cuda').Index

const expect = require('chai').expect

describe('renderer/models/cuda/CudaDim', () => {
  describe('constructor', () => {
    it('should throw with missing args', () => {
      expect(() => new CudaDim()).to.throw
    })

    it('should throw with invalid arg types', () => {
      expect(() => new CudaDim("hello")).to.throw
    })

    it('should throw with 0', () => {
      expect(() => new CudaDim(0)).to.throw
      expect(() => new CudaDim(0,0)).to.throw
      expect(() => new CudaDim(15,0)).to.throw
      expect(() => new CudaDim(15,0,0)).to.throw
      expect(() => new CudaDim(15,15,0)).to.throw
      expect(() => new CudaDim(15,0,15)).to.throw
    })


    it('should not throw with correct arg type', () => {
      expect(() => new CudaDim(10)).to.not.throw
      expect(() => new CudaDim(10,10)).to.not.throw
      expect(() => new CudaDim(10,10,10)).to.not.throw
    })

    it('should not throw with only one arg', () => {
      expect(() => new CudaDim(5)).to.not.throw
      expect(() => new CudaDim(1)).to.not.throw
    })
  })

  describe('getters', () => {
    describe('x/cols', () => {
      it('should return the right value', () => {
        expect(new CudaDim(5).x).to.equal(5)
        expect(new CudaDim(5).cols).to.equal(5)
        expect(new CudaDim(10,5).x).to.equal(10)
        expect(new CudaDim(10,5).cols).to.equal(10)
        expect(new CudaDim(15,5,5).x).to.equal(15)
        expect(new CudaDim(15,5,5).cols).to.equal(15)
      })
    })

    describe('y/rows', () => {
      it('should return the right value', () => {
        expect(new CudaDim(5).rows).to.equal(1)
        expect(new CudaDim(5).y).to.equal(1)
        expect(new CudaDim(5,10).rows).to.equal(10)
        expect(new CudaDim(5,10).y).to.equal(10)
        expect(new CudaDim(5,15,20).rows).to.equal(15)
        expect(new CudaDim(5,15,20).y).to.equal(15)
      })
    })

    describe('z/layers', () => {
      it('should return the right value', () => {
        expect(new CudaDim(5).layers).to.equal(1)
        expect(new CudaDim(5).z).to.equal(1)
        expect(new CudaDim(5,10).layers).to.equal(1)
        expect(new CudaDim(5,10).z).to.equal(1)
        expect(new CudaDim(5,10,20).layers).to.equal(20)
        expect(new CudaDim(5,10,20).z).to.equal(20)
      })
    })

    describe('size', () => {
      it('should return the right value', () => {
        expect(new CudaDim(5).size).to.equal(5)
        expect(new CudaDim(5,5).size).to.equal(25)
        expect(new CudaDim(1,10).size).to.equal(10)
        expect(new CudaDim(10,1).size).to.equal(10)
        expect(new CudaDim(10,10,10).size).to.equal(1000)
        expect(new CudaDim(10,1,10).size).to.equal(100)
      })
    })
  })

  describe("hasIndex", () => {
    it("should throw on invalid index (1)", () => {
      let dim = new CudaDim(1024)
      expect(() => dim.hasIndex(-10)).to.throw()
    })

    it("should throw on invalid index (2)", () => {
      let dim = new CudaDim(1024)
      expect(() => dim.hasIndex(new CudaIndex(-15))).to.throw()
    })

    it("should throw on invalid index (3)", () => {
      let dim = new CudaDim(1024)
      expect(() => dim.hasIndex(undefined)).to.throw()
    })

    it("should throw on invalid index (4)", () => {
      let dim = new CudaDim(1024)
      expect(() => dim.hasIndex(null)).to.throw()
    })

    it("should not throw on valid index (1)", () => {
      let dim = new CudaDim(1024)
      expect(() => dim.hasIndex(10)).to.not.throw()
    })

    it("should not throw on valid index (2)", () => {
      let dim = new CudaDim(1024)
      expect(() => dim.hasIndex(new CudaIndex(1024))).to.not.throw()
    })

    it("should return false (1)", () => {
      expect(new CudaDim(1024).hasIndex(1024)).to.be.false
    })

    it("should return false (2)", () => {
      expect(new CudaDim(1024).hasIndex(new CudaIndex(1023,0))).to.be.false
    })

    it("should return true (1)", () => {
      expect(new CudaDim(1024).hasIndex(1023)).to.be.true
    })

    it("should return true (2)", () => {
      expect(new CudaDim(1024).hasIndex(new CudaIndex(0,1023))).to.be.true
    })

    it("should return true (3)", () => {
      expect(new CudaDim(1024).hasIndex(new CudaIndex(0))).to.be.true
    })

    it("should return true (4)", () => {
      expect(new CudaDim(1024).hasIndex(0)).to.be.true
    })

    it("should return true (5)", () => {
      expect(new CudaDim(1024).hasIndex(new CudaIndex(0,0))).to.be.true
    })
  })

  describe('equals', () => {
    it('should be equal', () => {
      expect(new CudaDim(5).equals(new CudaDim(5))).to.be.true
      expect(new CudaDim(10).equals(new CudaDim(10,1))).to.be.true
      expect(new CudaDim(40,1).equals(new CudaDim(40))).to.be.true
      expect(new CudaDim(40,40,40).equals(new CudaDim(40,40,40))).to.be.true
      expect(new CudaDim(40,1,40).equals(new CudaDim(40,1,40))).to.be.true
    })
    
    it('should not be equal', () => {
      expect(new CudaDim(5).equals(new CudaDim(15))).to.be.false
      expect(new CudaDim(10).equals(new CudaDim(1,10))).to.be.false
      expect(new CudaDim(40,1).equals(new CudaDim(1,40))).to.be.false
      expect(new CudaDim(40,1,40).equals(new CudaDim(1,40,40))).to.be.false
      expect(new CudaDim(40,1,40).equals(new CudaDim(40,40,1))).to.be.false
    })

  })

  describe('toArray', () => {
    it('should return a correct array', () => {
      expect(new CudaDim(5).toArray()).to.eql([5,1,1])
      expect(new CudaDim(5,5).toArray()).to.eql([5,5,1])
      expect(new CudaDim(1,5).toArray()).to.eql([1,5,1])
      expect(new CudaDim(1,1).toArray()).to.eql([1,1,1])
      expect(new CudaDim(5,2).toArray()).to.eql([5,2,1])
      expect(new CudaDim(5,2,1).toArray()).to.eql([5,2,1])
      expect(new CudaDim(5,2,5).toArray()).to.eql([5,2,5])
    })
  })

  describe('clone', () => {
    it("should return a correct value", () => {
      let d1 = new CudaDim(1)
      let d2 = d1.clone()
      expect(d1.equals(d2)).to.be.true
      expect(d1 === d2).to.be.false

      d1 = new CudaDim(10,10)
      d2 = d1.clone()
      expect(d1.equals(d2)).to.be.true
      expect(d1 === d2).to.be.false

      d1 = new CudaDim(100,100)
      d2 = d1.clone()
      expect(d1.equals(d2)).to.be.true
      expect(d1 === d2).to.be.false
    })
  })

  describe('toString', () => {
    it("should return a correct string", () => {
      expect(new CudaDim(5,5).toString()).to.equal('5x5')
      expect(new CudaDim(5).toString()).to.equal('5x1')
      expect(new CudaDim(1).toString()).to.equal('1x1')
      expect(new CudaDim(10,10,10).toString()).to.equal('10x10x10')
      expect(new CudaDim(200,1,100).toString()).to.equal('200x1x100')
    })
  })
})