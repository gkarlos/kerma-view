require('module-alias/register')

const expect = require('chai').expect

const SourceInfo = require('@renderer/models/source/SourceInfo')
const SourceRange = require('@renderer/models/source/SourceRange')

describe("models/source/SourceInfo", () => {
  describe("equals", () => {
    it("should be true (no args)", () => {
      expect(new SourceInfo().equals(new SourceInfo())).to.be.true
    })

    it("should be false (different filename)", () => {
      expect(new SourceInfo({filename: "hello"}).equals(new SourceInfo({filename: "world"}))).to.be.false
    })

    it("should be false (different range)", () => {
      let si1 = new SourceInfo({range: new SourceRange({fromLine:10})})
      let si2 = new SourceInfo({range: new SourceRange({fromLine:11})})
      expect(si1.equals(si2)).to.be.false
    })

    it("should be true (1)", () => {
      let si1 = new SourceInfo({range: new SourceRange({fromLine:11})})
      let si2 = new SourceInfo({range: new SourceRange({fromLine:11})})
      expect(si1.equals(si2)).to.be.true
    })

    it("should be true (2)", () => {
      let si1 = new SourceInfo({filename: "test.cu", range: new SourceRange({fromLine:11})})
      let si2 = new SourceInfo({filename: "test.cu", range: new SourceRange({fromLine:11})})
      expect(si1.equals(si2)).to.be.true
    })
  })
})