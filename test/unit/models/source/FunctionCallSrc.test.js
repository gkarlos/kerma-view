require('module-alias/register')

const FunctionCallSrc = require('@renderer/models/source/FunctionCallSrc')
const FunctionSrc     = require('@renderer/models/source/FunctionSrc')
const SrcRange        = require('@renderer/models/source/SrcRange')
const expect = require('chai').expect


describe("models/source/FunctionCallSrc", () => {
  describe("equals", () => {
    it("should be true (same super only)", () => {
      let fci= new FunctionCallSrc( {filename:"test.cu", range: new SrcRange({fromLine:0,toLine:15})})
      expect(fci.equals(fci)).to.be.true
    })

    it("should be false (different types)", () => {
      let fci= new FunctionCallSrc( {filename:"test.cu", range: new SrcRange({fromLine:0,toLine:15})})
      expect(fci.equals(1)).to.be.false
    })

    it("should be true (1)", () => {
      let fci = new FunctionCallSrc({
        filename: "test.cu", 
        range:    new SrcRange({fromLine:15,toLine:15}),
        caller:   new FunctionSrc({
          filename: "test.cu", 
          range:    new SrcRange({
            fromLine: 10,
            toLine:   20
          }), 
          arguments: "somearguments"
        })
      })
      expect(fci.equals(fci)).to.be.true
    })

    it("should be false (different caller)", () => {
      let fci1 = new FunctionCallSrc( {filename:"test.cu", range: new SrcRange({fromLine:0,toLine:15})})
      let fci2 = new FunctionCallSrc({
        filename : "test.cu", 
        range : new SrcRange({fromLine:0,toLine:15}),
        caller:   new FunctionSrc({
          filename: "test.cu", 
          range:    new SrcRange({
            fromLine: 10,
            toLine:   20
          }), 
          arguments: "somearguments"
        })
      })
      expect(fci1.equals(fci2)).to.be.false
    })
  })
})
