require('module-alias/register')

const expect = require('chai').expect

const AddressSpace = require('@renderer/models/memory/AddressSpace')
const Types = require('@renderer/models/types/Types')
const ArrayType  = Types.ArrayType
const StructType = Types.StructType
const PtrType = Types.PtrType
const Type    = require('@renderer/models/types/Type')
const Dim     = require('@renderer/models/Dim')


describe("models/types/PtrType", () => { 
  describe("toString", () => {
    it("i32*", () => {
      expect(new PtrType(Types.Int32).toString()).to.equal("i32*")
    })

    it("i32**", () => {
      let ptrInner = new PtrType(Types.Int32)
      let ptrOuter = new PtrType(ptrInner)
      expect(ptrOuter.toString()).to.equal("i32**")
    })

    it("{ i64, [32 x i32*] }*", () => {
      let first = Types.Int64
      let i32ptr = PtrType.get(Types.Int32)
      let second = ArrayType.get(i32ptr, 32)
      let struct = StructType.get([first, second])
      let ptr = PtrType.get(struct)
      expect(ptr.toString()).to.equal("{ i64, [32 x i32*] }*")
    })

    it(".i32*", () => {
      let pointeeTy = Types.UInt32
      let ptrTy = new PtrType(pointeeTy)
      expect(ptrTy.toString()).to.equal("u32*")
    })
  })

  describe("getPointeeType", () => {
    it("i32", () => {
      expect( new PtrType(Types.Int32)
              .getPointeeType()
              .equals(Types.Int32)).to.be.true
    })

    it("i32*", () => {
      let ptrInner = new PtrType(Types.Int32)
      let ptrOuter = new PtrType(ptrInner)
      expect(ptrOuter.getPointeeType().isPtrType()).to.be.true
      expect(ptrOuter.getPointeeType().getPointeeType().getBitWidth()).to.equal(32)
    })
  })

  describe("getNesting", () => {
    it("i32* ==> 1", () => {
      expect(new PtrType(Types.Int32).getNesting()).to.equal(1)
    })

    it("i32** ==> 2", () => {
      let ptrInner = new PtrType(Types.Int32)
      let ptrOuter = new PtrType(ptrInner)
      expect(ptrOuter.getNesting()).to.equal(2)
    })
  })

  describe("equals", () => {
    it("should be true (1)", () => {
      let ptr = new PtrType(Types.Int32)
      expect(ptr.equals(ptr)).to.be.true
    })

    it("should be true (2)", () => {
      let ptr1 = new PtrType(Types.Int32)
      let ptr2 = new PtrType(Types.Int32)
      expect(ptr1.equals(ptr2)).to.be.true
    })

    it("should be false (different pointee type) (1)", () => {
      let ptr1 = new PtrType(Types.Int32)
      let ptr2 = new PtrType(Types.Int64)
      expect(ptr1.equals(ptr2)).to.be.false
    })

    it("should be false (different pointee type) (2)", () => {
      let ptr1 = new PtrType(Types.Float)
      let ptr2 = new PtrType(Types.Double)
      expect(ptr1.equals(ptr2)).to.be.false
    })

    it("should be false (different pointee (sign))", () => {
      let ptr1 = new PtrType(Types.Int32)
      let ptr2 = new PtrType(Types.UInt32)
      expect(ptr1.equals(ptr2)).to.be.false
    })

    it("should be false (different width)", () => {
      let ptr1 = new PtrType(Types.Double, 32)
      let ptr2 = new PtrType(Types.Double, 64)
      expect(ptr1.equals(ptr2)).to.be.false
    })

    describe("getDim", () => {
      it("should always be 1,1,1", () => {
        expect(new PtrType(Types.Float32).getDim().equals(Dim.Unit));
        expect(new PtrType(Types.Double).getDim().equals(Dim.Unit));
        expect(new PtrType(Types.Int64).getDim().equals(Dim.Unit));
      })
    })
  })
})