require('module-alias/register')

const expect = require('chai').expect

const SrcLoc = require('@renderer/models/source/SrcLoc')

describe("models/source/SrcLoc", () => {
  describe("equals", () => {
    it("should be true (no args)", () => {
      expect(new SrcLoc().equals(new SrcLoc())).to.be.true
    })

    it("should be true (equivalent to no args)", () => {
      expect(new SrcLoc(0,0).equals(new SrcLoc())).to.be.true
    })
    
    it("should be true (same values) (1)", () => {
      expect(new SrcLoc(0,1).equals(new SrcLoc(0,1))).to.be.true
    })

    it("should be true (same values) (2)", () => {
      expect(new SrcLoc(1,1).equals(new SrcLoc(1,1))).to.be.true
    })

    it("should be true (same values) (3)", () => {
      expect(new SrcLoc(10,1).equals(new SrcLoc(10,1))).to.be.true
    })

    it("should be false (different values) (1)", () => {
      expect(new SrcLoc(10,1).equals(new SrcLoc(1,1))).to.be.false
    })

    it("should be false (different values) (2)", () => {
      expect(new SrcLoc(10,1).equals(new SrcLoc())).to.be.false
    })

    it("should be false (different values) (3)", () => {
      expect(new SrcLoc(10,1).equals(new SrcLoc(10))).to.be.false
    })

    it("should be false (different types)", () => {
      expect(new SrcLoc(10,1).equals(2)).to.be.false
    })
  })
})