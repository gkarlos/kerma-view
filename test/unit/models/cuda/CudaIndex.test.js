require('module-alias/register')
const Index = require('@renderer/models/cuda').Index
const Dim = require('@renderer/models/cuda').Dim

const expect = require('chai').expect

describe('renderer/cuda/CudaIndex', () => {
  describe('(static) delinearize', () => {
    it('should throw with missing args', () => {
      expect(() => Index.delinearize()).to.throw
      expect(() => Index.delinearize(null)).to.throw
      expect(() => Index.delinearize(undefined)).to.throw
      expect(() => Index.delinearize(null, null)).to.throw
      expect(() => Index.delinearize(undefined, undefined)).to.throw
    })

    it('should throw with invalid args', () => {
      expect(() => Index.delinearize(new Index(10), -2)).to.throw
      expect(() => Index.delinearize(new Index(10), new Dim(-2))).to.throw
      expect(() => Index.delinearize(new Index(10), new Dim(20, -2))).to.throw
    })

    it('should throw on 3D Dim', () => {
      expect(() => Index.delinearize(new Index(10), new Dim(2,1,3))).to.throw
      expect(() => Index.delinearize(new Index(10), new Dim(20,20,20))).to.throw
    })

    it('should not throw on 1D,2D Dim', () => {
      expect(() => Index.delinearize(new Index(10), new Dim(2,1))).to.not.throw
      expect(() => Index.delinearize(new Index(10), new Dim(2,1,1))).to.not.throw
      expect(() => Index.delinearize(new Index(10), new Dim(20,20,20))).to.throw
      expect(() => Index.delinearize(new Index(10), new Dim(2,1,20))).to.throw
    })

    it('should throw on missmatch', () => {
      let index = new Index(100);
      expect(() => Index.delinearize(index, new Dim(100))).to.throw
      expect(() => Index.delinearize(100, new Dim(100))).to.throw
      expect(() => Index.delinearize(index, new Dim(5, 20))).to.throw
    })

    it('should not throw on valid args', () => {
      expect(() => Index.delinearize(new Index(1), new Dim(2))).to.not.throw
      expect(() => Index.delinearize(1, new Dim(2))).to.not.throw
      expect(() => Index.delinearize(new Index(1), new Dim(2, 2))).to.not.throw
      expect(() => Index.delinearize(1, new Dim(2, 2))).to.not.throw
      expect(() => Index.linearize(new Index(0), new Dim(1))).to.not.throw
      expect(() => Index.linearize(0, new Dim(1))).to.not.throw
    })

    it('should compute the right values (1)', () => {
      expect(Index.delinearize(new Index(1), new Dim(200, 200)).equals(new Index(1))).to.be.true
      expect(Index.delinearize(1, new Dim(200, 200)).equals(new Index(1))).to.be.true
      expect(Index.delinearize(new Index(1), new Dim(200, 200)).equals(new Index(0,1))).to.be.true
      expect(Index.delinearize(1, new Dim(200, 200)).equals(new Index(0,1))).to.be.true
    })

    it('should compute the right values (2)', () => {
      let index = new Index(0)
      expect(Index.delinearize(new Index(0), new Dim(1)).equals(new Index(0))).to.be.true
      expect(Index.delinearize(new Index(0), new Dim(10)).equals(new Index(0,0))).to.be.true
      expect(Index.delinearize(new Index(0,0), new Dim(100)).equals(new Index(0))).to.be.true
      expect(Index.delinearize(new Index(0,0), new Dim(1000)).equals(new Index(0,0))).to.be.true
      expect(Index.delinearize(0, new Dim(10000)).equals(new Index(0,0))).to.be.true

      expect(Index.delinearize(new Index(0), new Dim(1,1)).equals(new Index(0))).to.be.true
      expect(Index.delinearize(new Index(0), new Dim(10,10)).equals(new Index(0,0))).to.be.true
      expect(Index.delinearize(new Index(0,0), new Dim(100,100)).equals(new Index(0))).to.be.true
      expect(Index.delinearize(new Index(0,0), new Dim(1000,1000)).equals(new Index(0,0))).to.be.true
      expect(Index.delinearize(0, new Dim(10000, 200)).equals(new Index(0,0))).to.be.true
    })

    it('should compute the right values (3)', () => {
      expect(Index.delinearize(new Index(999,0), new Dim(1,1000)).equals(new Index(999))).to.be.false
      expect(Index.delinearize(new Index(999,0), new Dim(1,1000)).equals(new Index(999,0))).to.be.true

      expect(Index.delinearize(new Index(999), new Dim(1000,1)).equals(new Index(999))).to.be.true
      expect(Index.delinearize(new Index(999), new Dim(1000,1)).equals(new Index(0,999))).to.be.true
      expect(Index.delinearize(999, new Dim(1000,1)).equals(new Index(999))).to.be.true
    })

    it('should compute the right values (4)', () => {
      expect(Index.delinearize(new Index(1002), new Dim(500,5)).equals(new Index(2,2))).to.be.true
      expect(Index.delinearize(1002, new Dim(500,5)).equals(new Index(2,2))).to.be.true
      expect(Index.delinearize(1002, new Dim(500,5)).equals(new Index(2,2,1))).to.be.true
    })

    it('should compute the right values (5)', () => {
      expect(Index.delinearize(new Index(2010), new Dim(500,5)).equals(new Index(4,10))).to.be.true
      expect(Index.delinearize(new Index(2010), new Dim(5,500)).equals(new Index(402))).to.be.false
      expect(Index.delinearize(new Index(2010), new Dim(5,500)).equals(new Index(402,0))).to.be.true
      expect(Index.delinearize(new Index(2010), new Dim(5,500)).equals(new Index(402,0,1))).to.be.true
      expect(Index.delinearize(2010, new Dim(5,500)).equals(new Index(402))).to.be.false
      expect(Index.delinearize(2010, new Dim(5,500)).equals(new Index(402,0))).to.be.true
      expect(Index.delinearize(2010, new Dim(5,500)).equals(new Index(402,0,1))).to.be.true
    })
  })

  describe('(static) linearize', () => {
    it('should throw with missing args', () => {
      expect(() => Index.linearize()).to.throw
      expect(() => Index.linearize(null)).to.throw
      expect(() => Index.linearize(undefined)).to.throw
      expect(() => Index.linearize(null, null)).to.throw
      expect(() => Index.linearize(undefined, undefined)).to.throw
    })

    it('should throw with invalid args', () => {
      expect(() => Index.linearize(new Index(10), -2)).to.throw
      expect(() => Index.linearize(new Index(10), new Dim(-2))).to.throw
      expect(() => Index.linearize(new Index(10), new Dim(20, -2))).to.throw
      expect(() => Index.linearize(new Index(10), new Dim(0,0,0))).to.throw
    })

    it('should throw on 3D Dim', () => {
      expect(() => Index.linearize(new Index(10), new Dim(2,1,3))).to.throw
      expect(() => Index.linearize(new Index(10), new Dim(20,20,20))).to.throw
    })

    it('should not throw on 1D,2D Dim', () => {
      expect(() => Index.linearize(new Index(10), new Dim(2,1))).to.not.throw
      expect(() => Index.linearize(new Index(10), new Dim(2,1,1))).to.not.throw
      expect(() => Index.linearize(new Index(10), new Dim(20,20,20))).to.throw
      expect(() => Index.linearize(new Index(10), new Dim(2,1,20))).to.throw
    })

    it('should throw on missmatch', () => {
      let index = new Index(1,10,10);
      expect(() => Index.linearize(index, new Dim(200))).to.throw
      expect(() => Index.linearize(index, new Dim(200, 1, 5))).to.throw
      expect(() => Index.linearize(index, new Dim(200, 5, 2))).to.throw
      expect(() => Index.linearize(index, new Dim(1, 11, 11))).to.throw
      expect(() => Index.linearize(index, new Dim(1))).to.throw
    })

    it('should not throw on valid args', () => {
      let index = new Index(1)
      expect(() => Index.linearize(index, new Dim(2))).to.not.throw
      expect(() => Index.linearize(index, new Dim(2, 2, 2))).to.not.throw

      index = new Index(0)
      expect(() => Index.linearize(index, new Dim(1))).to.not.throw
    })

    it('should compute the right values (1)', () => {
      let index = new Index(1)
      expect(Index.linearize(index, new Dim(200, 200))).to.equal(1)
      expect(Index.linearize(index, new Dim(2,2))).to.equal(1)
      expect(Index.linearize(index, new Dim(2))).to.equal(1)
      expect(Index.linearize(index, new Dim(2,1))).to.equal(1)
      expect(Index.linearize(index, new Dim(2,1,1))).to.equal(1)
    })

    it('should compute the right values (2)', () => {
      let index = new Index(2,5)
      expect(Index.linearize(index, new Dim(10, 5))).to.equal(25)
    })

    it('should compute the right values (3)', () => {
      let index = new Index(0)
      expect(Index.linearize(index, new Dim(1))).to.equal(0)
    })

    it('should compute the right values (4)', () => {
      let index = new Index(10,2)
      expect(Index.linearize(index, new Dim(100, 100))).to.equal(1002)
    })

    it('should compute the right values (5)', () => {
      let index = new Index(2000)
      expect(Index.linearize(index, new Dim(10000))).to.equal(2000)
    })

    it('should compute the right values (6)', () => {
      let index = new Index(20, 5)
      expect(Index.linearize(index, new Dim(100, 10000))).to.equal(2005)
    })
  })

  describe("is1D", () => {
    it('should be 1D', () => {
      expect(new Index(0).is1D()).to.be.true
      expect(new Index(1234).is1D()).to.be.true
    })

    it('should not be 1D', () => {
      expect(new Index(0,1).is1D()).to.be.false
      expect(new Index(1234,0).is1D()).to.be.false
      expect(new Index(12,34).is1D()).to.be.false
    })
  })

  describe("is2D", () => {
    it('should be 2D', () => {
      expect(new Index(0,0).is2D()).to.be.true
      expect(new Index(1234,1234).is2D()).to.be.true
    })

    it('should not be 2D', () => {
      expect(new Index(0).is2D()).to.be.false
      expect(new Index(1234).is2D()).to.be.false
      expect(new Index(1).is2D()).to.be.false
    })
  })
})