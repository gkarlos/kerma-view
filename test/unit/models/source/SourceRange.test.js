require('module-alias/register')

const expect = require('chai').expect

const SourceRange = require('@renderer/models/source/SourceRange')

describe("models/source/SourceRange", () => {
  describe("equals", () => {

    it("should be true (no args)", () => {
      let left = new SourceRange()
      let right = new SourceRange()
      expect(left.equals(right)).to.be.true
    })

    it("should be true (equivalent to no args)", () => {
      let left = new SourceRange()
      let right1 = new SourceRange({fromLine:0})
      let right2 = new SourceRange({fromLine:0, toLine:Infinity})
      let right3 = new SourceRange({toLine:0, toLine:Infinity})
      let right4 = new SourceRange({fromLine:0, fromColumn:0, toLine:Infinity})
      let right5 = new SourceRange({fromLine:0, toColumn:Infinity})
      let right6 = new SourceRange({fromLine:0, fromColumn:0, toColumn:Infinity})
      let right7 = new SourceRange({fromLine:0, fromColumn:0, toLine:Infinity, toColumn:Infinity})
      expect(left.equals(right1)).to.be.true
      expect(left.equals(right2)).to.be.true
      expect(left.equals(right3)).to.be.true
      expect(left.equals(right4)).to.be.true
      expect(left.equals(right5)).to.be.true
      expect(left.equals(right6)).to.be.true
      expect(left.equals(right7)).to.be.true
    })

    it("should be true (same values) (1)", () => {
      let left = new SourceRange({fromLine:0})
      expect(left.equals(left)).to.be.true
    })

    it("should be true (same values) (2)", () => {
      let left = new SourceRange({fromColumn:0})
      expect(left.equals(left)).to.be.true
    })

    it("should be true (same values) (3)", () => {
      let left = new SourceRange({fromLine:0,fromColumn:0})
      expect(left.equals(left)).to.be.true
    })

    it("should be true (same values) (4)", () => {
      let left = new SourceRange({fromLine:0,fromColumn:0,toLine:15})
      expect(left.equals(left)).to.be.true
    })

    it("should be true (same values) (5)", () => {
      let left = new SourceRange({fromLine:0,fromColumn:0,toColumn:15})
      expect(left.equals(left)).to.be.true
    })


    it("should be false (different types)", () => {
      let left = new SourceRange()
      expect(left.equals(2)).to.be.false
    })

    it("should be false (different values) (1)", () => {
      let left = new SourceRange({fromLine:15})
      expect(left.equals(new SourceRange({fromLine:14}))).to.be.false
    })

    it("should be false (different values) (2)", () => {
      let left = new SourceRange({fromLine:15})
      expect(left.equals(new SourceRange({toLine:20}))).to.be.false
    })

    it("should be false (different values) (3)", () => {
      let left = new SourceRange({fromLine:15})
      expect(left.equals(new SourceRange({fromLine:20,toColumn:15}))).to.be.false
    })

    it("should be false (different values) (4)", () => {
      let left = new SourceRange({fromLine:15,toLine:20})
      expect(left.equals(new SourceRange({fromLine:20,toLine:20,toColumn:15}))).to.be.false
    })
  })
})