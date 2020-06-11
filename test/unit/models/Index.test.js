require('module-alias/register')
const Index = require('@renderer/models/Index')

const expect = require('chai').expect

describe('renderer/models/Index', () => {
  describe('(static) linearize', () => {
    it('should throw with missing args', () => {
      expect(() => Index.linearize()).to.throw
      expect(() => Index.linearize(null)).to.throw
      expect(() => Index.linearize(undefined)).to.throw
      expect(() => Index.linearize(null, null)).to.throw
      expect(() => Index.linearize(null, null, 2)).to.throw
    })

    it('should throw with invalid args', () => {
      expect(() => Index.linearize(new Index(10), -2)).to.throw
      expect(() => Index.linearize(new Index(10), 20, -2)).to.throw
    })

    it('should throw on missmatch', () => {
      let index = new Index(1,10,10);
      expect(() => Index.linearize(index, 200)).to.throw
      expect(() => Index.linearize(index, 200, 1, 1)).to.throw
      expect(() => Index.linearize(index, 200, 5, 2)).to.throw
      expect(() => Index.linearize(index, 1, 11, 11)).to.throw
      expect(() => Index.linearize(index, 1)).to.throw
      expect(() => Index.linearize(index, 0, 0, 0)).to.throw
    })

    it('should not throw on valid args', () => {
      let index = new Index(1)
      expect(() => Index.linearize(index, 2)).to.not.throw
      expect(() => Index.linearize(index, 2, 2, 2)).to.not.throw

      index = new Index(0)
      expect(() => Index.linearize(index, 1)).to.not.throw
    })

    it('should compute the right values (1)', () => {
      let index = new Index(1)
      expect(Index.linearize(index, 200, 200)).to.equal(1)
      expect(Index.linearize(index, 2, 2, 2)).to.equal(1)
      expect(Index.linearize(index, 2, 2)).to.equal(1)
      expect(Index.linearize(index, 2)).to.equal(1)
    })

    it('should compute the right values (2)', () => {
      let index = new Index(2,5)
      expect(Index.linearize(index, 5, 10)).to.equal(25)
    })

    it('should compute the right values (3)', () => {
      let index = new Index(0)
      expect(Index.linearize(index, 1)).to.equal(0)
    })

    it('should compute the right values (4)', () => {
      let index = new Index(10,2)
      expect(Index.linearize(index, 100, 100)).to.equal(1002)
    })

    it('should compute the right values (5)', () => {
      let index = new Index(2000)
      expect(Index.linearize(index, 10000)).to.equal(2000)
    })
  })
})