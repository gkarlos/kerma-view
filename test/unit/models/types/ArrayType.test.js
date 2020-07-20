require('module-alias/register')

const expect = require('chai').expect


const Types = require('@renderer/models/types/Types')
const ArrayType  = Types.ArrayType
const StructType = Types.StructType
const Dim  = require('@renderer/models/Dim')

describe("models/types/ArrayType", () => { 

  describe("constructor", () => {
    it("should work with number", () => {
      expect(() => new ArrayType(Types.Int16, 1024)).to.not.throw()
    })

    it("should work with dim", () => {
      expect(() => new ArrayType(Types.Int16, new Dim(1024))).to.not.throw()
    })

    it("should throw with missing arg:elementType", () => {
      expect(() => new ArrayType()).to.throw()
    })
  })

  describe("getByteWidth", () => {
    it("[16 x i32] ==> 64", () => {
      let ty = new ArrayType(Types.Int32, 16)
      expect(ty.getByteWidth()).to.equal(64)
    })

    it("[1000 x [1000 x i32]] ==> 4000000", () => {
      let ty = new ArrayType(Types.Int32, new Dim(1000,1000))
      expect(ty.getByteWidth()).to.equal(1000 * 1000 * 4)
    })
  })

  describe("getBitWidth", () => {
    it("[16 x i32] ==> 512", () => {
      let ty = new ArrayType(Types.Int32, 16)
      expect(ty.getBitWidth()).to.equal(64 * 8)
    })

    it("[1000 x [1000 x i32]] ==> 32000000", () => {
      let ty = new ArrayType(Types.Int32, new Dim(1000,1000))
      expect(ty.getBitWidth()).to.equal(1000 * 1000 * 4 * 8)
    })
  })

  describe("isValidArrayElementType", () => {
    it("should be false", () => expect(new ArrayType(Types.Double, 1).isValidArrayElementType()).to.be.false)
  })

  describe("isValidStructElementType", () => {
    it("should be false", () => expect(new ArrayType(Types.Double, 1).isValidStructElementType()).to.be.true)
  })

  describe("getNesting", () => {
    it("[1024 x f64] ==> 1", () => {
      expect(new ArrayType( Types.Float64, 1024).getNesting()).to.equal(1)
    })

    it("[1024 x [1024 x f64]] ==> 1", () => {
      expect(new ArrayType( Types.Float64, new Dim(1024,1024)).getNesting()).to.equal(1)
    })
  })

  describe("toString", () => {
    it("[1024 x f64]", () => {
      expect(new ArrayType( Types.Float64, 1024).toString()).to.equal("[1024 x f64]")
    })

    it("[1024 x [1024 x f64]]", () => {
      expect(new ArrayType( Types.Float64, new Dim(1024,1024)).toString()).to.equal("[1024 x [1024 x f64]]")
    })

    it("[1024 x [1024 x { i64, i64 }]]", () => {
      let ty = new ArrayType( new StructType([Types.Int64, Types.Int64]), new Dim(1024, 1024))
      expect(ty.toString()).to.equal("[1024 x [1024 x { i64, i64 }]]")
    })
  })
})