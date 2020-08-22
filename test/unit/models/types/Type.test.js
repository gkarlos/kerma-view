require('module-alias/register')

const expect = require('chai').expect

const Type = require('@renderer/models/types/Type')
const Dim = require('@renderer/models/Dim')

describe("models/types/Type", () => {
  describe("constructor", () => {
    it("should have 1x1x1 dim", () => {
      expect(new Type("int", 32).getDim().equals(new Dim(1,1,1))).to.be.true
    })
  })

  describe("toString", () => {
    it("int32", () => {
      expect(new Type("int", 32).toString()).to.equal("int32")
    })

    it("int64", () => {
      expect(new Type("int", 64).toString()).to.equal("int64")
    })

    it("float32", () => {
      expect(new Type("float",32).toString()).to.equal("float32")
    })

    it("double", () => {
      expect(new Type("double", 64).toString()).to.equal("double64")
    })
  })

  describe("aliases", () => {
    it("i1/bool/boolean", () => {
      let ty = new Type('int', 1).addAlias('bool').addAlias('boolean')
      expect(ty.hasAlias("bool")).to.be.true
      expect(ty.hasAlias("boolean")).to.be.true
    })
  })

  describe("isValidArrayElementType", () => {
    it("always true", () => {
      let ty = new Type('int', 1)
      expect(ty.isValidArrayElementType()).to.be.true
      ty = new Type('int', 32)
      expect(ty.isValidArrayElementType()).to.be.true
      ty = new Type('int', 64)
      expect(ty.isValidArrayElementType()).to.be.true
      ty = new Type('float', 32)
      expect(ty.isValidArrayElementType()).to.be.true
      ty = new Type('myType', 32)
      expect(ty.isValidArrayElementType()).to.be.true
    })
  })

  describe("isValidStructElementType", () => {
    it("always true", () => {
      let ty = new Type('int', 1)
      expect(ty.isValidStructElementType()).to.be.true
      ty = new Type('int', 32)
      expect(ty.isValidStructElementType()).to.be.true
      ty = new Type('int', 64)
      expect(ty.isValidStructElementType()).to.be.true
      ty = new Type('float', 32)
      expect(ty.isValidStructElementType()).to.be.true
      ty = new Type('myType', 32)
      expect(ty.isValidStructElementType()).to.be.true
    })
  })

  describe("equals", () => {
    it("ref should equal itself", () => {
      let ty = new Type('int', 1)
      expect(ty.equals(ty)).to.be.true
      ty = new Type('int', 32)
      expect(ty.equals(ty)).to.be.true
      ty = new Type('int', 64)
      expect(ty.equals(ty)).to.be.true
      ty = new Type('float', 32)
      expect(ty.equals(ty)).to.be.true
    })

    it("should be false (1)", () => {
      let t1 = new Type('int', 1)
      let t2 = new Type('int', 32)
      expect(t1.equals(t2)).to.be.false
    })

    it("should be false (2)", () => {
      let t1 = new Type('intA', 32)
      let t2 = new Type('intB', 32)
      expect(t1.equals(t2)).to.be.false
    })
  })
})