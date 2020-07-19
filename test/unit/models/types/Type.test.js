require('module-alias/register')

const expect = require('chai').expect

const Type = require('@renderer/models/types/Type')

describe("models/types/Type", () => {
  describe("toString", () => {
    it("int32 => i32", () => {
      expect(new Type("int", 32).toString()).to.equal("i32")
    })

    it("int64 => i64", () => {
      expect(new Type("int", 64).toString()).to.equal("i64")
    })

    it("float32 => f32", () => {
      expect(Type.Float32.toString()).to.equal("f32")
    })

    it("double => f64", () => {
      expect(Type.Double.toString()).to.equal("f64")
    })
  })

  describe("aliases", () => {
    it("i8/bool/boolean", () => {
      expect(Type.Boolean.hasAlias("bool")).to.be.true
      expect(Type.Boolean.hasAlias("boolean")).to.be.true
    })
  })

  describe("isValidArrayElementType", () => {
    it("always true", () => {
      expect(Type.Int16.isValidArrayElementType()).to.be.true
      expect(Type.Float32.isValidArrayElementType()).to.be.true
      expect(Type.Boolean.isValidArrayElementType()).to.be.true
    })
  })

  describe("isValidStructElementType", () => {
    it("always true", () => {
      expect(Type.Int16.isValidStructElementType()).to.be.true
      expect(Type.Float32.isValidStructElementType()).to.be.true
      expect(Type.Boolean.isValidStructElementType()).to.be.true
    })
  })

  describe("equals", () => {
    it("ref should equal itself", () => {
      expect(Type.Int16.equals(Type.Int16)).to.be.true
      expect(Type.Float64.equals(Type.Float64)).to.be.true
      expect(Type.Boolean.equals(Type.Boolean)).to.be.true
      expect(Type.Float.equals(Type.Float)).to.be.true
    })

    it("bool should be equal to i8", () => {
      expect(Type.Boolean.equals(Type.Int8)).to.be.true
    })

    it("should be false (1)", () => {
      expect(Type.Int16.equals(Type.Int32)).to.be.false
    })

    it("should be false (2)", () => {
      expect(Type.Int32.equals(Type.Double)).to.be.false
    })

    it("should be false (3)", () => {
      expect(Type.Int32.equals(new Type("ab", 32))).to.be.false
    })
  })
})