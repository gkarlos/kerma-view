require('module-alias/register')

const expect = require('chai').expect

const FunctionSrc = require('@renderer/models/source/FunctionSrc')
const SrcRange    = require('@renderer/models/source/SrcRange')

describe("models/source/FunctionSrc", () => {
  describe("equals", () => {
    it("should be true (no args)", () => {
      expect(new FunctionSrc().equals(new FunctionSrc())).to.be.true
    })

    it("should be true (same super only)", () => {
      let fi1 = new FunctionSrc({filename:"test.cu",range: new SrcRange({fromLine:0,toLine:15})})
      let fi2 = new FunctionSrc({filename:"test.cu",range: new SrcRange({fromLine:0,toLine:15})})
      expect(fi1.equals(fi2)).to.be.true
    })

    it("should be true (1)", () => {
      let fi1 = new FunctionSrc({
        filename : "test.cu",
        range : new SrcRange({fromLine:0,toLine:15}),
        arguments : "somearguments",
        isKernel : true
      })

      expect(fi1.equals(fi1)).to.be.true
    })

    it("should be true (2)", () => {
      let fi1 = new FunctionSrc({
        filename : "",
        range : new SrcRange({fromLine:0,toLine:15}),
        arguments : "",
        isKernel : true
      })

      expect(fi1.equals(fi1)).to.be.true
    })

    it("should be false (kernel vs non-kernel)", () => {
      let fi1 = new FunctionSrc({
        filename : "",
        range : new SrcRange({fromLine:0,toLine:15}),
        arguments : "",
        isKernel : true
      })

      let fi2 = new FunctionSrc({
        filename : "",
        range : new SrcRange({fromLine:0,toLine:15}),
        arguments : ""
      })

      expect(fi1.equals(fi2)).to.be.false
    })

    it("should be false (different super)", () => {
      let fi1 = new FunctionSrc({
        filename : "testa.cu",
        range : new SrcRange({fromLine:0,toLine:15}),
        arguments : "somearguments",
      })

      let fi2 = new FunctionSrc({
        filename : "testb.cu",
        range : new SrcRange({fromLine:0,toLine:16}),
        arguments : "somearguments"
      })

      expect(fi1.equals(fi2)).to.be.false
    })
  })
})