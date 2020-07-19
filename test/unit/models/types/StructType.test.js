require('module-alias/register')

const expect = require('chai').expect

const StructType = require('@renderer/models/types/StructType')

describe("models/type/StructType", () => {
  describe("getName", () => {
    it("anonymous structs should have the name 'struct'", () => {
      expect(new StructType().getName()).to.equal("struct")
      expect(new StructType().isAnonymous()).to.be.true
    })

    it("should return the right value", () => {
      expect(new StructType([], "myStruct").getName()).to.equal("myStruct")
    })
  })

  describe("getNumElements", () => {
    it("should return 0", () => {
      expect(new StructType().getNumElements()).to.equal(0)
    })

    it("should return 2", () => {
      expect(new StructType([StructType.Boolean, StructType.Double]).getNumElements()).to.equal(2)
    })
  })

  describe("hasElementType", () => {
    it("{ i8, f64 } should have boolean", () => {
      expect(new StructType([StructType.Boolean, StructType.Double]).hasElementType(StructType.Boolean)).to.be.true
    })

    it("{ } should not have i32", () => {
      expect(new StructType().hasElementType(StructType.Int32)).to.be.false
    })
  })

  describe("toString", () => {
    it("{ }", () => {
      expect(new StructType().toString()).to.equal("{ }")
    })

    it("{ f64 }", () => {
      expect(new StructType([StructType.Double]).toString()).to.equal("{ f64 }")
    })

    it("{ i8, f64 }", () => {
      expect(new StructType([StructType.Boolean, StructType.Double]).toString()).to.equal("{ i8, f64 }")
    })

    it("{ i8, i16, i32, i64 }", () => {
      expect(new StructType([StructType.Int8, StructType.Int16, StructType.Int32, StructType.Int64]).toString()).to.equal("{ i8, i16, i32, i64 }")
    })
  })

  describe("getBitWidth", () => {
    it("should be 0", () => {
      expect(new StructType().getBitWidth()).to.equal(0)
    })

    it("should be 32", () => {
      expect(new StructType([StructType.Int32]).getBitWidth()).to.equal(32)
    })

    it("should be 32", () => {
      expect(new StructType([StructType.Int16, StructType.Int16]).getBitWidth()).to.equal(32)
    })

    it("should be 64", () => {
      expect(new StructType([StructType.Int16, StructType.Int16, StructType.Int32]).getBitWidth()).to.equal(64)
    })
  })

  describe("getByteWidth", () => {
    it("should be 0", () => {
      expect(new StructType().getByteWidth()).to.equal(0)
    })

    it("should be 4", () => {
      expect(new StructType([StructType.Int32]).getByteWidth()).to.equal(4)
    })

    it("should be 4", () => {
      expect(new StructType([StructType.Int16, StructType.Int16]).getByteWidth()).to.equal(4)
    })

    it("should be 8", () => {
      expect(new StructType([StructType.Int16, StructType.Int16, StructType.Int32]).getByteWidth()).to.equal(8)
    })
  })

  describe("equals", () => {
    it("should be true (1)", () => {
      expect(new StructType().equals(new StructType())).to.be.true
    })

    it("should be true (2)", () => {
      let s1 = new StructType([StructType.Int16, StructType.Int16])
      expect(s1.equals(s1)).to.be.true
    })

    it("should be true (3)", () => {
      let s1 = new StructType([StructType.Int16, StructType.Int16])
      let s2 = new StructType([StructType.Int16, StructType.Int16])
      expect(s1.equals(s2)).to.be.true
    })

    it("should be true (4)", () => {
      let s1 = new StructType([StructType.Int8, StructType.Int16])
      let s2 = new StructType([StructType.Boolean, StructType.Int16])
      expect(s1.equals(s2)).to.be.true
    })

    it("should be false (1)", () => {
      let s1 = new StructType([StructType.Int16, StructType.Int16])
      let s2 = new StructType([StructType.Boolean, StructType.Int16])
      expect(s1.equals(s2)).to.be.false
    })

    it("should be false (1)", () => {
      let s1 = new StructType([StructType.Boolean, StructType.Int16], "hello")
      let s2 = new StructType([StructType.Boolean, StructType.Int16], "world")
      expect(s1.equals(s2)).to.be.false
    })
  })




 
})