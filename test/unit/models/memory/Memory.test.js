require('module-alias/register')

const expect = require('chai').expect

const Memory = require('@renderer/models/memory/Memory')
const Dim    = require('@renderer/models/Dim')

describe('renderer/models/memory/Memory', () => {
  describe("constructor", () => {
    it("should throw when missing arg:dim", () => {
      expect(() => new Memory()).to.throw()
    })
    
    it("should throw when invalid type of arg:dim", () => {
      expect(() => new Memory(2)).to.throw()
    })

    it("should throw if element.size not power of 2", () => {
      expect(() => new Memory( Dim.square16x16, {size: 30})).to.throw()
    })
  })

  describe("equals", () => {

    it("should equal self (1)", () => {
      let mem = new Memory(Dim.lin1024)
      expect(mem.equals(mem)).to.be.true
    })

    it("should equal self (2)", () => {
      let mem = new Memory(Dim.square128x128)
      expect(mem.equals(mem)).to.be.true
    })

    it("should equal self (3)", () => {
      let mem = new Memory(Dim.square256x256, {size: 64})
      expect(mem.equals(mem)).to.be.true
    })

    it("should equal identical instances (1)", () => {
      let mem1 = new Memory(Dim.lin1024)
      let mem2 = new Memory(Dim.lin1024)
      expect(mem1.equals(mem2)).to.be.true
    })

    it("should equal identical instances (2)", () => {
      let mem1 = new Memory(Dim.square128x128)
      let mem2 = new Memory(Dim.square128x128)
      expect(mem1.equals(mem2)).to.be.true
    })

    it("should equal identical instances (3)", () => {
      let mem1 = new Memory(Dim.square256x256, {size: 64})
      let mem2 = new Memory(Dim.square256x256, {size: 64})
      expect(mem1.equals(mem2)).to.be.true
    })

    it("should equal identical instances (4)", () => {
      let mem1 = new Memory(Dim.square256x256, {size: 64})
      let mem2 = new Memory(Dim.square256x256, {size: 64, sign:true})
      expect(mem1.equals(mem2)).to.be.true
    })
  })

})