require('module-alias/register')

const expect = require('chai').expect

const Types = require('@renderer/models/types/Types')
const ArrayType  = Types.ArrayType
const StructType = Types.StructType
const Dim = require('@renderer/models/Dim')

describe("models/type/StructType", () => {
  describe("getName", () => {
    it("anonymous structs should have the name 'struct'", () => {
      expect(new StructType().getName()).to.equal("struct")
      expect(new StructType().isAnonymous()).to.be.true
    })

    it("should return the right value", () => {
      expect(new StructType([], "myStruct").getName()).to.equal("struct myStruct")
    })
  })

  describe("getNumElements", () => {
    it("should return 0", () => {
      expect(new StructType().getNumElements()).to.equal(0)
    })

    it("should return 2", () => {
      expect(new StructType([Types.Boolean, Types.Double]).getNumElements()).to.equal(2)
    })

    it("{ [1024 x [512 x { i32, i32 }]], { i64, i8 } } ==> 2", () => {
      let structi32x2 = new StructType([Types.Int32, Types.Int32])
      let t1 = new ArrayType(structi32x2, new Dim(1024, 512))
      let t2 = new StructType([Types.Int64, Types.Int8])
      let struct = new StructType([t1, t2])
      expect(struct.getNumElements()).to.equal(2)
    })
  })

  describe("hasElementType", () => {
    it("{ i8, f64 } should have boolean", () => {
      expect(new StructType([Types.Boolean, Types.Double]).hasElementType(Types.Boolean)).to.be.true
    })

    it("{ } should not have i32", () => {
      expect(new StructType().hasElementType(Types.Int32)).to.be.false
    })
  })

  describe("toString", () => {
    it("{ }", () => {
      expect(new StructType().toString()).to.equal("{ }")
    })

    it("{ f64 }", () => {
      expect(new StructType([Types.Float64]).toString()).to.equal("{ f64 }")
    })

    it("{ .i1, f64 }", () => {
      expect(new StructType([Types.Boolean, Types.Double]).toString()).to.equal("{ .i1, f64 }")
    })

    it("{ i8, i16, i32, i64 }", () => {
      expect(new StructType([Types.Int8, Types.Int16, Types.Int32, Types.Int64]).toString()).to.equal("{ i8, i16, i32, i64 }")
    })

    it("{ [512 x i8], i64 }", () => {
      expect(new StructType([new ArrayType(Types.Int8, 512), Types.Int64], 
                            Types.Int64 )
                            .toString()
                            ).to.equal("{ [512 x i8], i64 }")
    })

    it("{ [1024 x [512 x { i32, i32 }]], { i64, i8 } }", () => {
      let structi32x2 = new StructType([Types.Int32, Types.Int32])
      let t1 = new ArrayType(structi32x2, new Dim(1024, 512))
      let t2 = new StructType([Types.Int64, Types.Int8])
      let struct = new StructType([t1, t2])
      expect(struct.toString()).to.equal("{ [1024 x [512 x { i32, i32 }]], { i64, i8 } }")
    })
  })

  describe("getBitWidth", () => {
    it("should be 0", () => {
      expect(new StructType().getBitWidth()).to.equal(0)
    })

    it("should be 32", () => {
      expect(new StructType([Types.Int32]).getBitWidth()).to.equal(32)
    })

    it("should be 32", () => {
      expect(new StructType([Types.Int16, Types.Int16]).getBitWidth()).to.equal(32)
    })

    it("should be 64", () => {
      expect(new StructType([Types.Int16, Types.Int16, Types.Int32]).getBitWidth()).to.equal(64)
    })
  })

  describe("getByteWidth", () => {
    it("should be 0", () => {
      expect(new StructType().getByteWidth()).to.equal(0)
    })

    it("should be 4", () => {
      expect(new StructType([Types.Int32]).getByteWidth()).to.equal(4)
    })

    it("should be 4", () => {
      expect(new StructType([Types.Int16, Types.Int16]).getByteWidth()).to.equal(4)
    })

    it("should be 8", () => {
      expect(new StructType([Types.Int16, Types.Int16, Types.Int32]).getByteWidth()).to.equal(8)
    })
  })

  describe("getNesting", () => {
    it("{ } ==> 1", () => {
      let struct = new StructType()
      expect(struct.getNesting()).to.equal(1)
    })

    it("{ i64, i8 } ==> 1", () => {
      let struct = new StructType([Types.Int64, Types.Int8])
      expect(struct.getNesting()).to.equal(1)
    })
    
    it("{ [1024 x [512 x { i32, i32 }]], { i64, i8 } } ==> 3", () => {
      let structi32x2 = new StructType([Types.Int32, Types.Int32])
      let t1 = new ArrayType(structi32x2, new Dim(1024, 512))
      let t2 = new StructType([Types.Int64, Types.Int8])
      let struct = new StructType([t1, t2])
      expect(struct.toString()).to.equal("{ [1024 x [512 x { i32, i32 }]], { i64, i8 } }")
    })
  })

  describe("equals", () => {
    it("should be true (1)", () => {
      expect(new StructType().equals(new StructType())).to.be.true
    })

    it("should be true (2)", () => {
      let s1 = new StructType([Types.Int16, Types.Int16])
      expect(s1.equals(s1)).to.be.true
    })

    it("should be true (3)", () => {
      let s1 = new StructType([Types.Int16, Types.Int16])
      let s2 = new StructType([Types.Int16, Types.Int16])
      expect(s1.equals(s2)).to.be.true
    })

    it("should be false (1)", () => {
      let s1 = new StructType([Types.Int16, Types.Int16])
      let s2 = new StructType([Types.Boolean, Types.Int16])
      expect(s1.equals(s2)).to.be.false
    })

    it("should be false (1)", () => {
      let s1 = new StructType([Types.Boolean, Types.Int16], "hello")
      let s2 = new StructType([Types.Boolean, Types.Int16], "world")
      expect(s1.equals(s2)).to.be.false
    })

    it("should be false (signed/unsigned elements)", () => {
      let s1 = new StructType([Types.Boolean, Types.Int16], "myStruct")
      let s2 = new StructType([Types.Boolean, Types.UInt16], "myStruct")
      expect(s1.equals(s2)).to.be.false
    })

    it("should be false (float/double elements)", () => {
      let s1 = new StructType([Types.Boolean, Types.Float], "myStruct")
      let s2 = new StructType([Types.Boolean, Types.Double], "myStruct")
      expect(s1.equals(s2)).to.be.false
    })
  })

  describe("getDim", () => {
    it("should always be 1,1,1", () => {
      expect(new StructType([Types.Boolean, Types.Float], "myStruct").getDim().equals(Dim.Unit));
      expect(new StructType([Types.Int16, Types.Int16]).getDim().equals(Dim.Unit));
      let structi32x2 = new StructType([Types.Int32, Types.Int32])
      let t1 = new ArrayType(structi32x2, new Dim(1024, 512))
      let t2 = new StructType([Types.Int64, Types.Int8])
      expect(new StructType([t1, t2]).getDim().equals(Dim.Unit))
    })
  })

 
})