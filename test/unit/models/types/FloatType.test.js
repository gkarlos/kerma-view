require('module-alias/register')

const expect = require('chai').expect

const Types = require('@renderer/models/types/Types')

describe("models/types/IntType", () => {
  describe("equals", () => {
    it("ref should equal self", () => {
      let ty = Types.Float32
      expect(ty.equals(ty)).to.be.true
    })
  })

  describe("isIntType", () => {
    it("should be false", () => {
      expect(Types.Float32.isIntType()).to.be.false
      expect(Types.Float64.isIntType()).to.be.false
    })  
  })

  describe("isFloatType", () => {
    it("should be true", () => {
      expect(Types.Float32.isFloatType()).to.be.true
      expect(Types.Float64.isFloatType()).to.be.true
    })  
  })

  describe("isBasicType", () => {
    it("should be true", () => {
      expect(Types.Float32.isBasicType()).to.be.true
      expect(Types.Float64.isBasicType()).to.be.true
    })  
  })

  describe("isAggregateType", () => {
    it("should be false", () => {
      expect(Types.Float32.isAggregateType()).to.be.false
      expect(Types.Float64.isAggregateType()).to.be.false
    })
  })

  describe("isNested", () => {
    it("should be false", () => {
      expect(Types.Float32.isNested()).to.be.false
      expect(Types.Float64.isNested()).to.be.false
    })
  })

  describe("toString", () => {
    it("should not be prefixed with .", () => {
      expect(Types.Float32.toString()).to.equal("f32")
      expect(Types.Float64.toString()).to.equal("f64")
    })
  })
})