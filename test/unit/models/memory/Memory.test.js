require('module-alias/register')

const expect = require('chai').expect

const Memory = require('@renderer/models/memory/Memory')
const Dim    = require('@renderer/models/Dim')
const Types  = require('@renderer/models/types/Types')
const AddressSpace = require('@renderer/models/cuda/CuAddrSpace')

describe('renderer/models/memory/Memory', () => {
  describe("constructor", () => {
    it("should throw when missing arg:type", () => {
      expect(() => new Memory()).to.throw()
    })
    
    it("should throw when invalid type of arg:type", () => {
      expect(() => new Memory(2)).to.throw()
    })

    it("should throw when missing arg:addrSpace", () => {
      expect(() => new Memory( Types.Double)).to.throw()
    })

    it("should throw when invalid type of arg:addrSpace", () => {
      expect(() => new Memory( Types.Double, 2)).to.throw()
    })

    it("should not throw with valid args", () => {
      expect(() => new Memory( Types.Int16, AddressSpace.Global)).to.not.throw()
    })
  })

  describe("getNumElements", () => {
    it("i16 ==> 1", () => {
      expect(new Memory(Types.Int16, AddressSpace.Global).getNumElements()).to.equal(1)
    })

    it("i16* ==> 1", () => {
      expect(new Memory(new Types.PtrType(Types.Int16), AddressSpace.Global).getNumElements()).to.equal(1)
    })

    it("{ i32, i32 } ==> 1", () => {
      expect(new Memory(new Types.StructType([Types.Int32, Types.Int32]), AddressSpace.Global).getNumElements()).to.equal(1)
    })

    it("{ i32, i32 }* ==> 1", () => {
      expect(
        new Memory(
          new Types.PtrType( 
            new Types.StructType([Types.Int32, Types.Int32])),
          AddressSpace.Global
        ).getNumElements()
      ).to.equal(1)
    })

    it("[1024 x i32] ==> 1024", () => {
      expect(
        new Memory(
          Types.getArrayType( Types.Int32, 1024),
          AddressSpace.Global
        ).getNumElements()
      ).to.equal(1024)
    })

    it("[1024 x [1024 x i32]] ==> 1048576", () => {
      expect(
        new Memory(
          Types.getArrayType( Types.Int32, new Dim(1024,1024)),
          AddressSpace.Global
        ).getNumElements()
      ).to.equal(1048576)
    })

    it("[1024 x { i32, i32 }] ==> 1024", () => {
      expect(
        new Memory(
          Types.getArrayType(
            Types.getStuctType( Types.Int32, Types.Int32),
            1024),
          AddressSpace.Global
        ).getNumElements()
      ).to.equal(1024)
    })
  })

  describe("getSize", () => {
    it("i16 ==> 2", () => {
      expect(new Memory(Types.Int16, AddressSpace.Global).getSize()).to.equal(2)
    })

    it("i16* ==> 8", () => {
      expect(new Memory(new Types.PtrType(Types.Int16), AddressSpace.Global).getSize()).to.equal(Types.DefaultPointerWidthBytes)
    })

    it("{ i32, i32 } ==> 8", () => {
      expect(new Memory(new Types.StructType([Types.Int32, Types.Int32]), AddressSpace.Global).getSize()).to.equal(8)
    })

    it("{ i32, i32, i32 }* ==> 8", () => {
      expect(
        new Memory(
          new Types.PtrType( 
            new Types.StructType([Types.Int32, Types.Int32, Types.Int32])),
          AddressSpace.Global
        ).getSize()
      ).to.equal(8)
    })

    it("[1024 x i32] ==> 4096", () => {
      expect(
        new Memory(
          Types.getArrayType( Types.Int32, 1024),
          AddressSpace.Global
        ).getSize()
      ).to.equal(4096)
    })

    it("[1024 x [1024 x i32]] ==> 4194304", () => {
      expect(
        new Memory(
          Types.getArrayType( Types.Int32, new Dim(1024,1024)),
          AddressSpace.Global
        ).getSize()
      ).to.equal(4194304)
    })

    it("[1024 x { i32, i32 }] ==> 8192", () => {
      expect(
        new Memory(
          Types.getArrayType(
            Types.getStuctType( Types.Int32, Types.Int32),
            1024),
          AddressSpace.Global
        ).getSize()
      ).to.equal(8192)
    })
  })

  describe("isArrayOfStructs", () => {
    it("i32 => false", () => {
      expect(
        new Memory( Types.Int32, AddressSpace.Global).isArrayOfStructs()
      ).to.be.false
    })

    it("[1024 x i32] => false", () => {
      expect(
        new Memory( 
          Types.getArrayType(Types.Int32, 1024),
          AddressSpace.Global
        ).isArrayOfStructs()
      ).to.be.false
    })

    it("{ i32, i32 } => false", () => {
      expect(
        new Memory( 
          Types.getStuctType( Types.Int32, Types.Int32), 
          AddressSpace.Global
        ).isArrayOfStructs()
      ).to.be.false
    })

    it("[1024 x { i32, i32 }] ==> true", () => {
      expect(
        new Memory(
          Types.getArrayType(
            Types.getStuctType(Types.Int32, Types.Int32),
            1024
          ),
          AddressSpace.Global
        ).isArrayOfStructs()
      ).to.be.true
    })
  })

  describe("isStructWithArrays", () => {
    it("i32 => false", () => {
      expect(
        new Memory(
          Types.Int32,
          AddressSpace.Global
        ).isStructWithArrays()
      ).to.be.false
    })

    it("{ i32, i32 } => false", () => {
      expect(
        new Memory(
          Types.getStuctType(Types.Int32, Types.Int32),
          AddressSpace.Global
        ).isStructWithArrays()
      ).to.be.false
    })

    it("{ i32, [1024 x i32] } => true", () => {
      expect(
        new Memory(
          Types.getStuctType(
            Types.Int32, 
            Types.getArrayType(Types.Int32, 1024)
          ),
          AddressSpace.Global
        ).isStructWithArrays()
      ).to.be.true
    })

    it("{ [1024 x i32], [1024 x i32] } => true", () => {
      expect(
        new Memory(
          Types.getStuctType(
            Types.getArrayType(Types.Int32, 1024), 
            Types.getArrayType(Types.Int32, 1024)
          ),
          AddressSpace.Global
        ).isStructWithArrays()
      ).to.be.true
    })
  })

  describe("isStructOfArrays", () => {
    it("{ i32, [1024 x i32] } => false", () => {
      expect(
        new Memory(
          Types.getStuctType(
            Types.Int32, 
            Types.getArrayType(Types.Int32, 1024)
          ),
          AddressSpace.Global
        ).isStructOfArrays()
      ).to.be.false
    })

    it("{ [1024 x i32], [1024 x i32] } => true", () => {
      expect(
        new Memory(
          Types.getStuctType(
            Types.getArrayType(Types.Int32, 1024), 
            Types.getArrayType(Types.Int32, 1024)
          ),
          AddressSpace.Global
        ).isStructOfArrays()
      ).to.be.true
    })
  })

  describe("equals", () => {

    it("should equal self (1)", () => {
      let mem = 
        new Memory( Types.Int32, AddressSpace.Global)
      expect(mem.equals(mem)).to.be.true
    })

    it("[1024 x i32] == [1024 x i32]", () => {
      let mem1 = new Memory( Types.getArrayType(Types.Int32, 1024), AddressSpace.Global)
      let mem2 = new Memory( Types.getArrayType(Types.Int32, 1024), AddressSpace.Global)
      expect(mem1.equals(mem2)).to.be.true
    })

    it("[1024 x i32] != [1024 x .i32]", () => {
      let mem1 = new Memory( Types.getArrayType(Types.Int32, 1024), AddressSpace.Global)
      let mem2 = new Memory( Types.getArrayType(Types.UInt32, 1024), AddressSpace.Global)
      expect(mem1.equals(mem2)).to.be.false
    })

    it("<mem (4) [1024 x i32]> != <mem (5) [1024 x .i32]> | (different addr spaces)", () => {
      let mem1 = new Memory( Types.getArrayType(Types.Int32, 1024), AddressSpace.Global)
      let mem2 = new Memory( Types.getArrayType(Types.Int32, 1024), AddressSpace.Local)
      expect(mem1.equals(mem2)).to.be.false
    })
  })

})