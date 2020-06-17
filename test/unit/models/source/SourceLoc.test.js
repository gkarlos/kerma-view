require('module-alias/register')

const expect = require('chai').expect

const SourceLoc = require('@renderer/models/source/SourceLoc')

describe("models/source/SourceLoc", () => {
  describe("equals", () => {
    it("should be true (no args)", () => {
      expect(new SourceLoc().equals(new SourceLoc())).to.be.true
    })

    it("should be true (equivalent to no args)", () => {
      expect(new SourceLoc(0,0).equals(new SourceLoc())).to.be.true
    })
    
    it("should be true (same values) (1)", () => {
      expect(new SourceLoc(0,1).equals(new SourceLoc(0,1))).to.be.true
    })

    it("should be true (same values) (2)", () => {
      expect(new SourceLoc(1,1).equals(new SourceLoc(1,1))).to.be.true
    })

    it("should be true (same values) (3)", () => {
      expect(new SourceLoc(10,1).equals(new SourceLoc(10,1))).to.be.true
    })

    it("should be false (different values) (1)", () => {
      expect(new SourceLoc(10,1).equals(new SourceLoc(1,1))).to.be.false
    })

    it("should be false (different values) (2)", () => {
      expect(new SourceLoc(10,1).equals(new SourceLoc())).to.be.false
    })

    it("should be false (different values) (3)", () => {
      expect(new SourceLoc(10,1).equals(new SourceLoc(10))).to.be.false
    })

    it("should be false (different types)", () => {
      expect(new SourceLoc(10,1).equals(2)).to.be.false
    })
  })
})