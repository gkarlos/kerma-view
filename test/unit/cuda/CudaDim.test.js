require('module-alias/register')
const CudaDim = require('@renderer/cuda').Dim

const expect = require('chai').expect

describe('renderer/cuda/CudaIndex', () => {
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
    })


    it('should not throw with correct arg type', () => {
      expect(() => new CudaDim(10,10)).to.not.throw
    })

    it('should not throw with only one arg', () => {
      expect(() => new CudaDim(5)).to.not.throw
    })
  })

  describe('getters', () => {
    describe('rows', () => {
      it('should return the right value', () => {
        expect(new CudaDim(5).rows).to.equal(1)
        expect(new CudaDim(5).y).to.equal(1)
        expect(new CudaDim(10,5).rows).to.equal(5)
        expect(new CudaDim(10,5).y).to.equal(5)
      })
    })

    describe('cols', () => {
      it('should return the right value', () => {
        expect(new CudaDim(5).cols).to.equal(5)
        expect(new CudaDim(5).x).to.equal(5)
        expect(new CudaDim(5,10).cols).to.equal(5)
        expect(new CudaDim(5,10).x).to.equal(5)
      })
    })

    describe('size', () => {
      it('should return the right value', () => {
        expect(new CudaDim(5).size).to.equal(5)
        expect(new CudaDim(5,5).size).to.equal(25)
        expect(new CudaDim(1,10).size).to.equal(10)
        expect(new CudaDim(10,1).size).to.equal(10)
      })
    })
  })

  describe('equals', () => {
    it('should be equal', () => {
      expect(new CudaDim(5).equals(new CudaDim(5))).to.be.true
      expect(new CudaDim(10).equals(new CudaDim(10,1))).to.be.true
      expect(new CudaDim(40,1).equals(new CudaDim(40))).to.be.true
    })
    
    it('should not be equal', () => {
      expect(new CudaDim(5).equals(new CudaDim(15))).to.be.false
      expect(new CudaDim(10).equals(new CudaDim(1,10))).to.be.false
      expect(new CudaDim(40,1).equals(new CudaDim(1,40))).to.be.false
    })

  })

  describe('toArray', () => {
    it('should return a correct array', () => {
      expect(new CudaDim(5).toArray()).to.eql([5,1])
      expect(new CudaDim(5,5).toArray()).to.eql([5,5])
      expect(new CudaDim(1,5).toArray()).to.eql([1,5])
      expect(new CudaDim(1,1).toArray()).to.eql([1,1])
      expect(new CudaDim(5).toArray()).to.eql([5,1])
    })
  })

  describe('clone', () => {
    it("should return a correct value", () => {
      let d1 = new CudaDim(1)
      let d2 = d1.clone()
      expect(d1.equals(d2)).to.be.true
      expect(d1 === d2).to.be.false
    })
  })

  describe('toString', () => {
    it("should return a correct string", () => {
      expect(new CudaDim(5,5).toString()).to.equal('5x5')
      expect(new CudaDim(5).toString()).to.equal('5x1')
      expect(new CudaDim(1).toString()).to.equal('1x1')
    })
  })
})