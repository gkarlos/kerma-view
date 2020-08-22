require('module-alias/register')

const expect = require('chai').expect

const Types = require('@renderer/models/types/Types')
const Dim = require('@renderer/models/Dim')

describe("models/types/IntType", () => {
  describe("equals", () => {
    it("ref should equal self", () => {
      let ty = Types.Int16
      expect(ty.equals(ty)).to.be.true
    })

    it("signed should not equal unsigned", () => {
      expect(Types.Int16.equals(Types.UInt16)).to.be.false
    })

    it("different widths should be unequal", () => {
      expect(Types.Int16.equals(Types.Int32)).to.be.false
    })
  })

  describe("isIntType", () => {
    it("should be true", () => {
      expect(Types.Int16.isIntType()).to.be.true
      expect(Types.Int32.isIntType()).to.be.true
      expect(Types.Int64.isIntType()).to.be.true
    })  
  })

  describe("isFloatType", () => {
    expect(Types.Int16.isFloatType()).to.be.false
    expect(Types.Int32.isFloatType()).to.be.false
    expect(Types.Int64.isFloatType()).to.be.false
  })

  describe("isBasicType", () => {
    it("should be true", () => {
      expect(Types.Int16.isBasicType()).to.be.true
      expect(Types.Int32.isBasicType()).to.be.true
      expect(Types.Int64.isBasicType()).to.be.true
    })  
  })

  describe("isAggregateType", () => {
    it("should be false", () => {
      expect(Types.Int16.isAggregateType()).to.be.false
      expect(Types.Int32.isAggregateType()).to.be.false
      expect(Types.Int64.isAggregateType()).to.be.false
    })
  })

  describe("isNested", () => {
    it("should be false", () => {
      expect(Types.Int16.isNested()).to.be.false
      expect(Types.Int32.isNested()).to.be.false
      expect(Types.Int64.isNested()).to.be.false
    })
  })

  describe("toString", () => {
    it("unsigned should be prefixed with .", () => {
      expect(Types.UInt16.toString()).to.equal(".i16")
      expect(Types.UInt32.toString()).to.equal(".i32")
      expect(Types.UInt64.toString()).to.equal(".i64")
    })

    it("signed should not be prefixed with .", () => {
      expect(Types.Int16.toString()).to.equal("i16")
      expect(Types.Int32.toString()).to.equal("i32")
      expect(Types.Int64.toString()).to.equal("i64")
    })
  })

  describe("getDim", () => {
    it("should always be 1,1,1", () => {
      expect(Types.Int16.getDim().equals(Dim.Unit));
      expect(Types.UInt16.getDim().equals(Dim.Unit));
    })
  })
})