require('module-alias/register')

const expect = require('chai').expect

const ArrayType = require('@renderer/models/types/ArrayType')
const StructType = require('@renderer/models/types/StructType')
const Type = require('@renderer/models/types/Type')
const Dim  = require('@renderer/models/Dim')

describe("models/types/ArrayType", () => { 

  describe("constructor", () => {
    it("should work with number", () => {
      expect(() => new ArrayType(Type.Int16, 1024)).to.not.throw()
    })

    it("should work with dim", () => {
      expect(() => new ArrayType(Type.Int16, new Dim(1024))).to.not.throw()
    })

    it("should throw with missing arg:elementType", () => {
      expect(() => new ArrayType()).to.throw()
    })
  })

  describe("isValidArrayElementType", () => {
    it("should be false", () => expect(new ArrayType(ArrayType.Double, 1).isValidArrayElementType()).to.be.false)
  })

  describe("isValidStructElementType", () => {
    it("should be false", () => expect(new ArrayType(ArrayType.Double, 1).isValidStructElementType()).to.be.true)
  })

  describe("getNesting", () => {
    it("[1024 x f64] ==> 1", () => {
      expect(new ArrayType(ArrayType.Float64, 1024).getNesting()).to.equal(1)
    })

    it("[1024 x [1024 x f64]] ==> 1", () => {
      expect(new ArrayType(ArrayType.Float64, new Dim(1024,1024)).getNesting()).to.equal(1)
    })
  })

  describe("toString", () => {
    it("[1024 x f64]", () => {
      expect(new ArrayType(ArrayType.Float64, 1024).toString()).to.equal("[1024 x f64]")
    })

    it("[1024 x [1024 x f64]]", () => {
      expect(new ArrayType(ArrayType.Float64, new Dim(1024,1024)).toString()).to.equal("[1024 x [1024 x f64]]")
    })

    it("[1024 x [1024 x { i64, i64 }]]", () => {
      let ty = new ArrayType( new StructType([Type.Int64, Type.Int64]), new Dim(1024, 1024))
      expect(ty.toString()).to.equal("[1024 x [1024 x { i64, i64 }]]")
    })
  })
})