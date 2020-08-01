require('module-alias/register')

const expect = require('chai').expect

const Memory = require('@renderer/models/memory/Memory')
const Pointer = require('@renderer/models/memory/Pointer')
const Dim    = require('@renderer/models/Dim')
const Types  = require('@renderer/models/types/Types')
const AddressSpace = require('@renderer/models/cuda/CuAddrSpace')

describe('renderer/models/memory/Pointer', () => {
  describe("constructor", () => {
    it("should throw with missing arg:type", () => {
      expect(() => new Pointer()).to.throw()
    })

    it("should throw with invalid arg:type", () => {
      expect(() => new Pointer(2)).to.throw()
    })

    it("should throw with wrong type", () => {
      expect(() => new Pointer(Types.UInt32)).to.throw()
    })

    it("should not throw with missing arg:addrSpace", () => {
      expect(() => new Pointer(Types.getPtrType(Types.Int32))).to.not.throw()
    })

    it("should throw with invalid type for arg:addrSpace", () => {
      expect(() => new Pointer(Types.getPtrType(Types.Int32), 15)).to.throw()
    })
  })
  
  describe("setPointee", () => {
    it("should throw on type missmatch", () => {
      let ptr = new Pointer(Types.getPtrType(Types.Int32))
      let mem = new Memory(Types.Int64)
      expect(() => ptr.setPointee(mem)).to.throw()
    })
  })

  describe("getPointee", () => {
    it("should return undefined if not explicitely set", () => {
      let ptr = new Pointer(Types.getPtrType(Types.Int32))
      expect(ptr.getPointee()).to.be.undefined
    })

    it("should be cleared after aliases(), if aliased does not point to memory", () => {
      let ptr = new Pointer(Types.getPtrType(Types.Int32))
      ptr.setPointee(new Memory(Types.Int32))
      expect(ptr.hasPointee()).to.be.true
      let aliased = new Pointer(Types.getPtrType(Types.Int32))
      ptr.aliases(aliased)
      expect(ptr.hasPointee()).to.be.false
    })

    it("should return aliased pointer's pointee after aliases()", () => {
      let ptr = new Pointer(Types.getPtrType(Types.Int32))
      let aliased = new Pointer(Types.getPtrType(Types.Int32))
      aliased.setPointee(new Memory(Types.Int32))
      
      expect(aliased.hasPointee()).to.be.true
      
      expect(ptr.hasPointee()).to.be.false
      ptr.aliases(aliased)
      expect(ptr.hasPointee()).to.be.true
      expect(ptr.getPointee().equals(aliased.getPointee())).to.be.true
    })
  })

  describe("createPointee", () => {
    it("should have Unknown namespace when called with no args", () => {
      let ptr = new Pointer( 
          /* type */Types.getPtrType( Types.getArrayType(Types.Int32, 1024)), 
          /* addr */AddressSpace.Local)
      expect(ptr.createPointee().getAddressSpace().equals(AddressSpace.Unknown))
    })

    it("should have the namespace passed as arg", () => {
      let ptr = new Pointer( 
          /* type */Types.getPtrType( Types.getArrayType(Types.Int32, 1024)), 
          /* addr */AddressSpace.Local)
      expect(ptr.createPointee(AddressSpace.Generic).getAddressSpace().equals(AddressSpace.Generic))
    })

    it("should equal Memory", () => {
      let ptr = new Pointer( 
        /* type */Types.getPtrType( Types.getArrayType(Types.Int32, 1024)), 
        /* addr */AddressSpace.Local)
      let mem = new Memory(Types.getArrayType(Types.Int32, 1024))
      expect(ptr.createPointee().equals(mem)).to.be.true
    })

    it("should give the right value after alias", () => {
      let ptr = new Pointer( 
        /* type */Types.getPtrType( Types.getArrayType(Types.Int32, 1024)), 
        /* addr */AddressSpace.Local)

      let mem = new Memory(Types.getArrayType(Types.Int32, 1024), AddressSpace.Local)

      ptr.setPointee(mem)

      let alias = new Pointer( 
        /* type */Types.getPtrType( Types.getArrayType(Types.Int32, 1024)), 
        /* addr */AddressSpace.Local)

      let aliasMem = new Memory(Types.getArrayType(Types.Int32, 1024), AddressSpace.Global)
      
      expect(alias.createPointee(AddressSpace.Global).equals(aliasMem)).to.be.true

      expect(alias.aliases(ptr).createPointee(AddressSpace.Local).equals(mem)).to.be.true
    })
  })

  describe("aliases", () => {
    it("should throw on type missmatch", () => {
      let ptr = new Pointer( 
        /* type */Types.getPtrType( Types.getArrayType(Types.Int32, 1024)), 
        /* addr */AddressSpace.Local)

      let alias = new Pointer( 
        /* type */Types.getPtrType( Types.getArrayType(Types.UInt32, 1024)), 
        /* addr */AddressSpace.Local)
      expect(() => alias.aliases(ptr)).to.throw()
    })

    it("should point to the same memory on success", () => {
      let ptr = new Pointer( 
        /* type */Types.getPtrType( Types.getArrayType(Types.Int32, 1024)), 
        /* addr */AddressSpace.Local)

      let mem = new Memory(Types.getArrayType(Types.Int32, 1024))

      ptr.setPointee(mem)

      let alias = new Pointer( 
        /* type */Types.getPtrType( Types.getArrayType(Types.Int32, 1024)), 
        /* addr */AddressSpace.Local)

      expect(() => alias.aliases(ptr)).to.not.throw()
      expect(alias.getPointee().equals(ptr.getPointee())).to.be.true
    })

    it("should remove pointed memory", () => {
      let ptr = new Pointer( 
        /* type */Types.getPtrType( Types.getArrayType(Types.Int32, 1024)), 
        /* addr */AddressSpace.Local)

      let mem = new Memory(Types.getArrayType(Types.Int32, 1024))

      ptr.setPointee(mem)

      let aliased = new Pointer( 
        /* type */Types.getPtrType( Types.getArrayType(Types.Int32, 1024)), 
        /* addr */AddressSpace.Local)
      
      ptr.aliases(aliased)

      expect(ptr.hasPointee()).to.be.false
      expect(ptr.getPointee()).to.be.undefined
    })

    it("pointer and alias should link to each other", () => {
      let ptr = new Pointer(Types.getPtrType( Types.Int16))
      let alias = new Pointer(Types.getPtrType( Types.Int16))

      expect(() => alias.aliases(ptr)).to.not.throw()
      expect(alias.getAliased().equals(ptr)).to.be.true
      expect(ptr.hasAlias(alias)).to.be.true
    })
  })


  describe("addAlias", () => {
    it("should not add duplicates", () => {
      let ptr   = new Pointer(Types.getPtrType( Types.Int16))
      let alias = new Pointer(Types.getPtrType( Types.Int16))
      expect(() => ptr.addAlias(alias)).to.not.throw()
      expect(ptr.getAliases().length).to.equal(1)
      ptr.addAlias(alias)
      expect(ptr.getAliases().length).to.equal(1)
    })

    it("alias @post should be aliases @pre + 1", () => {
      let ptr   = new Pointer(Types.getPtrType( Types.Int16))
      let alias = new Pointer(Types.getPtrType( Types.Int16))
      let pre = ptr.getAliases().length
      ptr.addAlias(alias)
      expect(ptr.getAliases().length).to.equal(pre + 1)
    })

    it("should have the same effect as calling aliases() on the alias", () => {

      let ptr   = new Pointer(Types.getPtrType( Types.Int16))
      let alias = new Pointer(Types.getPtrType( Types.Int16))

      expect(() => alias.aliases(ptr)).to.not.throw()
      expect(ptr.isAlias()).to.be.false
      expect(ptr.isAliased()).to.be.true
      expect(ptr.hasAlias(alias)).to.be.true
      expect(alias.isAlias()).to.be.true
      expect(alias.isAliased()).to.be.false
      expect(alias.getAliased().equals(ptr)).to.be.true

      ptr   = new Pointer(Types.getPtrType( Types.Int16))
      alias = new Pointer(Types.getPtrType( Types.Int16))

      expect(() => ptr.addAlias(alias)).to.not.throw()
      expect(ptr.isAlias()).to.be.false
      expect(ptr.isAliased()).to.be.true
      expect(ptr.hasAlias(alias)).to.be.true
      expect(alias.isAlias()).to.be.true
      expect(alias.isAliased()).to.be.false
      expect(alias.getAliased().equals(ptr)).to.be.true
    })
  })

  describe("removeAlias", () => {
    it("@post aliases should be @pre aliases - 1", () => {
      let ptr   = new Pointer(Types.getPtrType( Types.Int16))
      let alias = new Pointer(Types.getPtrType( Types.Int16))

      expect(() => alias.aliases(ptr)).to.not.throw()

      let pre = ptr.getAliases().length

      ptr.removeAlias(alias)

      expect(ptr.getAliases().length).to.equal(pre - 1)
    }) 

    it("@post ptr and alias should not link to each other", () => {
      let ptr   = new Pointer(Types.getPtrType( Types.Int16))
      let alias = new Pointer(Types.getPtrType( Types.Int16))

      expect(() => alias.aliases(ptr)).to.not.throw()
      expect(alias.getAliased()).to.not.be.undefined
      expect(alias.getAliased().equals(ptr)).to.be.true
      ptr.removeAlias(alias)
      expect(ptr.hasAlias(alias)).to.be.false
      expect(alias.getAliased()).to.be.undefined
    })

    it("should be idempotent", () => {
      let ptr   = new Pointer(Types.getPtrType( Types.Int16))
      let alias = new Pointer(Types.getPtrType( Types.Int16))

      expect(() => alias.aliases(ptr)).to.not.throw()

      let pre = ptr.getAliases().length

      ptr.removeAlias(alias)

      expect(ptr.getAliases().length).to.equal(pre - 1)
      expect(ptr.hasAlias(alias)).to.be.false
      expect(alias.getAliased()).to.be.undefined

      ptr.removeAlias(alias)

      expect(ptr.getAliases().length).to.equal(pre - 1)
      expect(ptr.hasAlias(alias)).to.be.false
      expect(alias.getAliased()).to.be.undefined

      ptr.removeAlias(alias)

      expect(ptr.getAliases().length).to.equal(pre - 1)
      expect(ptr.hasAlias(alias)).to.be.false
      expect(alias.getAliased()).to.be.undefined

      ptr.removeAlias(alias)

      expect(ptr.getAliases().length).to.equal(pre - 1)
      expect(ptr.hasAlias(alias)).to.be.false
      expect(alias.getAliased()).to.be.undefined

      ptr.removeAlias(alias)

      expect(ptr.getAliases().length).to.equal(pre - 1)
      expect(ptr.hasAlias(alias)).to.be.false
      expect(alias.getAliased()).to.be.undefined

      ptr.removeAlias(alias)

      expect(ptr.getAliases().length).to.equal(pre - 1)
      expect(ptr.hasAlias(alias)).to.be.false
      expect(alias.getAliased()).to.be.undefined
    })
  })

  describe("clearAlias", () => {
    it("should not have alias afterwards", () => {
      let ptr = new Pointer( 
        /* type */Types.getPtrType( Types.getArrayType(Types.Int32, 1024)), 
        /* addr */AddressSpace.Local)

      let alias = new Pointer( 
        /* type */Types.getPtrType( Types.getArrayType(Types.Int32, 1024)), 
        /* addr */AddressSpace.Local)

      alias.aliases(ptr)

      expect(alias.isAlias()).to.be.true
      expect(alias.getAliased().equals(ptr)).to.be.true
      expect(ptr.hasAlias(alias)).to.be.true

      alias.clearAlias()

      expect(alias.isAlias()).to.be.false
      expect(ptr.isAliased()).to.be.false
    })

    it("should have the same effect as calling removeAlias(..) on the aliased pointer", () => {
      let ptr   = new Pointer(Types.getPtrType( Types.Int16))
      let alias = new Pointer(Types.getPtrType( Types.Int16))
      expect(() => alias.aliases(ptr)).to.not.throw()

      alias.clearAlias()
      expect(alias.isAlias()).to.be.false
      expect(alias.getAliased()).to.be.undefined
      expect(ptr.isAliased()).to.be.false

      ptr   = new Pointer(Types.getPtrType( Types.Int16))
      alias = new Pointer(Types.getPtrType( Types.Int16))
      expect(() => ptr.addAlias(alias)).to.not.throw()

      ptr.removeAlias(alias)
      expect(alias.isAlias()).to.be.false
      expect(alias.getAliased()).to.be.undefined
      expect(ptr.isAliased()).to.be.false
    })
  })
})