require('module-alias/register')

const expect = require('chai').expect

const SrcRange = require('@renderer/models/source/SrcRange')

describe("models/source/SrcRange", () => {
  describe("equals", () => {

    it("should be true (no args)", () => {
      let left = new SrcRange()
      let right = new SrcRange()
      expect(left.equals(right)).to.be.true
    })

    it("should be true (equivalent to no args)", () => {
      let left = new SrcRange()
      let right1 = new SrcRange({fromLine:0})
      let right2 = new SrcRange({fromLine:0, toLine:Infinity})
      let right3 = new SrcRange({toLine:0, toLine:Infinity})
      let right4 = new SrcRange({fromLine:0, fromColumn:0, toLine:Infinity})
      let right5 = new SrcRange({fromLine:0, toColumn:Infinity})
      let right6 = new SrcRange({fromLine:0, fromColumn:0, toColumn:Infinity})
      let right7 = new SrcRange({fromLine:0, fromColumn:0, toLine:Infinity, toColumn:Infinity})
      expect(left.equals(right1)).to.be.true
      expect(left.equals(right2)).to.be.true
      expect(left.equals(right3)).to.be.true
      expect(left.equals(right4)).to.be.true
      expect(left.equals(right5)).to.be.true
      expect(left.equals(right6)).to.be.true
      expect(left.equals(right7)).to.be.true
    })

    it("should be true (same values) (1)", () => {
      let left = new SrcRange({fromLine:0})
      expect(left.equals(left)).to.be.true
    })

    it("should be true (same values) (2)", () => {
      let left = new SrcRange({fromColumn:0})
      expect(left.equals(left)).to.be.true
    })

    it("should be true (same values) (3)", () => {
      let left = new SrcRange({fromLine:0,fromColumn:0})
      expect(left.equals(left)).to.be.true
    })

    it("should be true (same values) (4)", () => {
      let left = new SrcRange({fromLine:0,fromColumn:0,toLine:15})
      expect(left.equals(left)).to.be.true
    })

    it("should be true (same values) (5)", () => {
      let left = new SrcRange({fromLine:0,fromColumn:0,toColumn:15})
      expect(left.equals(left)).to.be.true
    })


    it("should be false (different types)", () => {
      let left = new SrcRange()
      expect(left.equals(2)).to.be.false
    })

    it("should be false (different values) (1)", () => {
      let left = new SrcRange({fromLine:15})
      expect(left.equals(new SrcRange({fromLine:14}))).to.be.false
    })

    it("should be false (different values) (2)", () => {
      let left = new SrcRange({fromLine:15})
      expect(left.equals(new SrcRange({toLine:20}))).to.be.false
    })

    it("should be false (different values) (3)", () => {
      let left = new SrcRange({fromLine:15})
      expect(left.equals(new SrcRange({fromLine:20,toColumn:15}))).to.be.false
    })

    it("should be false (different values) (4)", () => {
      let left = new SrcRange({fromLine:15,toLine:20})
      expect(left.equals(new SrcRange({fromLine:20,toLine:20,toColumn:15}))).to.be.false
    })
  })
})