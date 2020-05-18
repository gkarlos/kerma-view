const path = require('path')
require('app-module-path').addPath(path.join(__dirname, "..", "..", "..", "src"))

const Memory = require('renderer/model/memory').Memory
const Shape  = require('renderer/model/memory').MemoryShape

const expect = require('chai').expect

describe("Memory", () => {
  describe("constructor", () => {
    it('should throw with no args', () => {
      expect(() => new Memory()).to.throw()
    })

    it('should throw with null name', () => {
      expect(() => new Memory(null)).to.throw()
    })
    
    it('shoult throw with empty name', () => {
      expect(() => new Memory('')).to.throw()
    })

    it('should throw with no shape', () => {
      expect(() => new Memory("myArray")).to.throw()
    })

    it('should throw with null shape', () => {
      expect(() => new Memory("myArray", null)).to.throw()
    })

    it('should throw with invalid shape', () => {
      expect(() => new Memory("myArray", new Shape(0,0,0))).to.throw()
    })

    it('it should not throw with valid name and valid shape', () => {
      expect(() => new Memory("myArray", new Shape())).to.not.throw()
      expect(() => new Memory("myArray", new Shape(1,2,3))).to.not.throw()
    })
  })

  describe("getName", () => {
    it('should return the right value', () => {
      expect( (new Memory("myVector", new Shape())).getName()).to.deep.equal("myVector")
    })
  })

  describe("getShape", () => {
    it('should return the right value', () => {
      let shape = new Shape()
      expect( (new Memory("myVector", new Shape())).getShape()).to.deep.equal(shape)
    })
  })

  describe("getDims", () => {
    it('Memory of shape [1,2,3] should have 3 dimensions', () => {
      expect( (new Memory('myVector', new Shape(1,2,3))).getDims()).to.equal(3)
    })
    it('Memory of shape [1,1,1] should have 1 dimension', () => {
      let shape = new Shape()
      expect( (new Memory('myVector', shape)).getDims()).to.equal(1)
      expect( (new Memory('myVector', shape)).getDims()).to.equal(shape.getDims())
    })
  })

  describe("isArray", () => {
    it('Memory with shape [32,1,1] is an array', () => {
      expect( (new Memory("myArray", new Shape(32))).isArray() ).to.equal(true)
    })
    
    it('Memory with shape [32,32,1] is an array', () => {
      expect( (new Memory("myArray", new Shape(32,32))).isArray() ).to.equal(true)
    })
    
    it('Memory with shape [32,32,32] is an array', () => {
      expect( (new Memory("myArray", new Shape(32,32,32))).isArray() ).to.equal(true)
    })

    it('Memory with shape [1,1,1] is not an array', () => {
      expect( (new Memory("myArray", new Shape())).isArray() ).to.equal(false)
    })
  })

  describe("isVector", () => {
    it('Memory with shape [32,1,1] is a vector', () => {
      expect( (new Memory("myArray", new Shape(32))).isVector() ).to.equal(true)
    })
    
    it('Memory with shape [32,32,1] is a vector', () => {
      expect( (new Memory("myArray", new Shape(32,32))).isVector() ).to.equal(true)
    })
    
    it('Memory with shape [32,32,32] is a vector', () => {
      expect( (new Memory("myArray", new Shape(32,32,32))).isVector() ).to.equal(true)
    })

    it('Memory with shape [1,1,1] is not a vector', () => {
      expect( (new Memory("myArray", new Shape())).isVector() ).to.equal(false)
    })
  })

  describe("isScalar", () => {
    it('Memory with shape [32,1,1] is not a scalar', () => {
      expect( (new Memory("myArray", new Shape(32))).isScalar() ).to.equal(false)
    })
    
    it('Memory with shape [32,32,1] is not a scalar', () => {
      expect( (new Memory("myArray", new Shape(32,32))).isScalar() ).to.equal(false)
    })
    
    it('Memory with shape [32,32,32] is not a scalar', () => {
      expect( (new Memory("myArray", new Shape(32,32,32))).isScalar() ).to.equal(false)
    })

    it('Memory with shape [1,1,1] is not a vector', () => {
      expect( (new Memory("myArray", new Shape())).isScalar() ).to.equal(true)
    })
  })

  describe("isMultiDimensionalArray", () => {
    it('Memory with shape [32,1,1] is not a multidimensional array', () => {
      expect( (new Memory("myArray", new Shape(32))).isMultiDimensionalArray() ).to.equal(false)
    })
    
    it('Memory with shape [32,32,1] is not a scalar', () => {
      expect( (new Memory("myArray", new Shape(32,32))).isMultiDimensionalArray() ).to.equal(true)
    })
    
    it('Memory with shape [32,32,32] is not a scalar', () => {
      expect( (new Memory("myArray", new Shape(32,32,32))).isMultiDimensionalArray() ).to.equal(true)
    })

    it('Memory with shape [1,1,1] is not a vector', () => {
      expect( (new Memory("myArray", new Shape())).isMultiDimensionalArray() ).to.equal(false)
    })
  })





})

