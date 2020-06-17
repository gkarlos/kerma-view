require('module-alias/register')

const expect = require('chai').expect

const FunctionCallInfo = require('@renderer/models/source/FunctionCallInfo')
const { SourceRange, FunctionInfo } = require('@renderer/models/source')

describe("models/source/FunctionCallInfo", () => {
  describe("equals", () => {
    it("should be true (no args)", () => {
      expect(new FunctionCallInfo().equals(new FunctionCallInfo())).to.be.true
    })

    it("should be true (same super only)", () => {
      let fci= new FunctionCallInfo( {filename:"test.cu", range: new SourceRange({fromLine:0,toLine:15})})
      expect(fci.equals(fci)).to.be.true
    })

    it("should be false (different types)", () => {
      let fci= new FunctionCallInfo( {filename:"test.cu", range: new SourceRange({fromLine:0,toLine:15})})
      expect(fci.equals(1)).to.be.false
    })

    it("should be true (1)", () => {
      let fci= new FunctionCallInfo({
        filename : "test.cu", 
        range : new SourceRange({fromLine:0,toLine:15}),
        caller : new FunctionInfo({arguments: "somearguments"})
      })
      expect(fci.equals(fci)).to.be.true
    })

    it("should be false (1)", () => {
      let fci1 = new FunctionCallInfo( {filename:"test.cu", range: new SourceRange({fromLine:0,toLine:15})})
      let fci2 = new FunctionCallInfo({
        filename : "test.cu", 
        range : new SourceRange({fromLine:0,toLine:15}),
        caller : new FunctionInfo({arguments: "somearguments"})
      })
      expect(fci1.equals(fci2)).to.be.false
    })
  })
})
