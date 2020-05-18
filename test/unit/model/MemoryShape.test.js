const path = require('path')
require('app-module-path').addPath(path.join(__dirname, "..", "..", "..", "src"))

const MemoryShape = require('renderer/model/memory').MemoryShape
const expect = require('chai').expect

describe("MemoryShape", () => {
  describe("constructor", () => {
    it('should throw for (0,0,0)', () => {
      expect(() => new MemoryShape(0,0,0)).to.throw()
    })

    it('should throw for (0,0)', () => {
      expect(() => new MemoryShape(0,0)).to.throw()
    })

    it('should throw for (0)', () => {
      expect(() => new MemoryShape(0).to.throw())
    })

    it('should throw for (1,0,0)', () => {
      expect(() => new MemoryShape(1,0,0).to.throw())
    })


    it('should not throw for () (no args)', () => {
      expect(() => new MemoryShape().to.not.throw())
    })

    it('should not throw for (1,1,1)', () => {
      expect(() => new MemoryShape(1,1,1).to.not.throw())
    })

    it('should not throw for (1,1)', () => {
      expect(() => new MemoryShape(1,1).to.not.throw())
    })

    it('should not throw for (1)', () => {
      expect(() => new MemoryShape(1).to.not.throw())
    })

    it('should not throw for (1,2,3)', () => {
      expect(() => new MemoryShape(1,2,3).to.not.throw())
    })
  })

  describe("getX", () => {
    it("should return 1 for [1,2,3]", () => {
      expect(new MemoryShape(1,2,3).getX()).to.equal(1)
      expect(new MemoryShape(1,2,3).x).to.equal(1)
    })
  })

  describe("getY", () => {
    it("should return 2 for [1,2,3]", () => {
      expect(new MemoryShape(1,2,3).getY()).to.equal(2)
      expect(new MemoryShape(1,2,3).y).to.equal(2)
    })
  })

  describe("getZ", () => {
    it("should return 3 for [1,2,3]", () => {
      expect(new MemoryShape(1,2,3).getZ()).to.equal(3)
      expect(new MemoryShape(1,2,3).z).to.equal(3)
    })
  })

  describe("getDims", () => {
    it("should return 1 for [1,1,1]", () => {
      expect(new MemoryShape().getDims()).to.equal(1)
    })
    it("should return 2 for [1,2,1]", () => {
      expect(new MemoryShape(1,2,1).getDims()).to.equal(2)
    })
    it("should return 3 for [1,2,3]", () => {
      expect(new MemoryShape(1,2,3).getDims()).to.equal(3)
    })
    it("should return 1 for [256,1,1]", () => {
      expect(new MemoryShape(256).getDims()).to.equal(1)
    })
    it("should return 2 for [256,512,1]", () => {
      expect(new MemoryShape(256,512).getDims()).to.equal(2)
    })
  })

})