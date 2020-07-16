require('module-alias/register')

const expect = require('chai').expect

const SrcInfo = require('@renderer/models/source/SrcInfo')
const SrcRange = require('@renderer/models/source/SrcRange')

describe("models/source/SrcInfo", () => {
  describe("equals", () => {
    it("should be true (no args)", () => {
      expect(new SrcInfo().equals(new SrcInfo())).to.be.true
    })

    it("should be false (different filename)", () => {
      expect(new SrcInfo({filename: "hello"}).equals(new SrcInfo({filename: "world"}))).to.be.false
    })

    it("should be false (different range)", () => {
      let si1 = new SrcInfo({range: new SrcRange({fromLine:10})})
      let si2 = new SrcInfo({range: new SrcRange({fromLine:11})})
      expect(si1.equals(si2)).to.be.false
    })

    it("should be true (1)", () => {
      let si1 = new SrcInfo({range: new SrcRange({fromLine:11})})
      let si2 = new SrcInfo({range: new SrcRange({fromLine:11})})
      expect(si1.equals(si2)).to.be.true
    })

    it("should be true (2)", () => {
      let si1 = new SrcInfo({filename: "test.cu", range: new SrcRange({fromLine:11})})
      let si2 = new SrcInfo({filename: "test.cu", range: new SrcRange({fromLine:11})})
      expect(si1.equals(si2)).to.be.true
    })
  })
})