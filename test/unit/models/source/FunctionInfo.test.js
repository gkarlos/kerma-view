require('module-alias/register')

const expect = require('chai').expect

const FunctionInfo = require('@renderer/models/source/FunctionInfo')
const { SourceRange } = require('@renderer/models/source')

describe("models/source/FunctionInfo", () => {
  describe("equals", () => {
    it("should be true (no args)", () => {
      expect(new FunctionInfo().equals(new FunctionInfo())).to.be.true
    })

    it("should be true (same super only)", () => {
      let fi1 = new FunctionInfo({filename:"test.cu",range: new SourceRange({fromLine:0,toLine:15})})
      let fi2 = new FunctionInfo({filename:"test.cu",range: new SourceRange({fromLine:0,toLine:15})})
      expect(fi1.equals(fi2)).to.be.true
    })

    it("should be true (1)", () => {
      let fi1 = new FunctionInfo({
        filename : "test.cu",
        range : new SourceRange({fromLine:0,toLine:15}),
        arguments : "somearguments",
        isKernel : true
      })

      expect(fi1.equals(fi1)).to.be.true
    })

    it("should be true (2)", () => {
      let fi1 = new FunctionInfo({
        filename : "",
        range : new SourceRange({fromLine:0,toLine:15}),
        arguments : "",
        isKernel : true
      })

      expect(fi1.equals(fi1)).to.be.true
    })

    it("should be false (kernel vs non-kernel)", () => {
      let fi1 = new FunctionInfo({
        filename : "",
        range : new SourceRange({fromLine:0,toLine:15}),
        arguments : "",
        isKernel : true
      })

      let fi2 = new FunctionInfo({
        filename : "",
        range : new SourceRange({fromLine:0,toLine:15}),
        arguments : ""
      })

      expect(fi1.equals(fi2)).to.be.false
    })

    it("should be false (different super)", () => {
      let fi1 = new FunctionInfo({
        filename : "testa.cu",
        range : new SourceRange({fromLine:0,toLine:15}),
        arguments : "somearguments",
      })

      let fi2 = new FunctionInfo({
        filename : "testb.cu",
        range : new SourceRange({fromLine:0,toLine:16}),
        arguments : "somearguments"
      })

      expect(fi1.equals(fi2)).to.be.false
    })
  })
})