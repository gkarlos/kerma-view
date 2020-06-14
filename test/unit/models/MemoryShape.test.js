const path = require('path')
require('app-module-path').addPath(path.join(__dirname, "..", "..", "..", "src"))

const MemoryShape = require('@renderer/models/memory').MemoryShape
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

  describe("setX", () => {
    it("should throw with arg (0)", () => {
      expect(() => new MemoryShape(1,2,3).setX(0)).to.throw()
    })
    it("should throw with no arg", () => {
      expect(() => new MemoryShape(1,2,3).setX()).to.throw()
      expect(() => new MemoryShape(1,2,3).setX(null)).to.throw()
      expect(() => new MemoryShape(1,2,3).setX(undefined)).to.throw()
    })
    it("should not throw with argument > 0", () => {
      for( let i = 1; i <= 10; ++i)
        expect(() => new MemoryShape(1,2,3).setX(i)).to.not.throw()
    })
    it("should correctly set the value", () => {
      let shape = new MemoryShape(1,2,3)
      for ( let i = 1; i <= 10; ++i) {
        shape.setX(i)
        expect(shape.getX()).to.equal(i)
        expect(shape.x).to.equal(i)
      }
    })
  })

  describe("setY", () => {
    it("should throw with arg (0)", () => {
      expect(() => new MemoryShape(1,2,3).setY(0)).to.throw()
    })
    it("should throw with no arg", () => {
      expect(() => new MemoryShape(1,2,3).setY()).to.throw()
      expect(() => new MemoryShape(1,2,3).setY(null)).to.throw()
      expect(() => new MemoryShape(1,2,3).setY(undefined)).to.throw()
    })
    it("should not throw with argument > 0", () => {
      for( let i = 1; i <= 10; ++i)
        expect(() => new MemoryShape(1,2,3).setY(i)).to.not.throw()
    })
    it("should correctly set the value", () => {
      let shape = new MemoryShape(1,2,3)
      for ( let i = 1; i <= 10; ++i) {
        shape.setY(i)
        expect(shape.getY()).to.equal(i)
        expect(shape.y).to.equal(i)
      }
    })
  })

  describe("setZ", () => {
    it("should throw with arg (0)", () => {
      expect(() => new MemoryShape(1,2,3).setZ(0)).to.throw()
    })
    it("should throw with no arg", () => {
      expect(() => new MemoryShape(1,2,3).setZ()).to.throw()
      expect(() => new MemoryShape(1,2,3).setZ(null)).to.throw()
      expect(() => new MemoryShape(1,2,3).setZ(undefined)).to.throw()
    })
    it("should not throw with argument > 0", () => {
      for( let i = 1; i <= 10; ++i)
        expect(() => new MemoryShape(1,2,3).setZ(i)).to.not.throw()
    })
    it("should correctly set the value", () => {
      let shape = new MemoryShape(1,2,3)
      for ( let i = 1; i <= 10; ++i) {
        shape.setZ(i)
        expect(shape.getZ()).to.equal(i)
        expect(shape.z).to.equal(i)
      }
    })
  })


})