require('module-alias/register')

const MemorySrc = require('@renderer/models/source/MemorySrc')
const SrcRange  = require('@renderer/models/source/SrcRange')
const { expect } = require('chai')

describe("models/source/MemorySrc", () => {
  describe('constructor', () => {
    it("should not throw without arg", () => {
      expect(() => new MemorySrc()).to.not.throw()
    })

    it("should throw with null", () => {
      expect(() => new MemorySrc(null)).to.throw()
    })
  })

  describe('hasQualifier', () => {
    let mem = new MemorySrc({
      type:        "int*",
      name:        "A",
      qualifiers:  ['const', '__restrict__'],
      decl:        "const int __restrict__ *A",
      declcontext: "__global__ void vecAdd(const int __restrict__ *A, const int __restrict__ *B, const int __restrict__ *C)",
      filename:    "myFile.cu",
      range:       new SrcRange(10,2,10,30)
    })

    it( "should return true",  () => expect(mem.hasQualifier('const')).to.be.true)
    it( "should return false", () => expect(mem.hasQualifier('restrict')).to.false)
    it( "should return true",  () => expect(mem.hasQualifier('__restrict__')).to.be.true)
    it( "should return false", () => expect(mem.hasQualifier('')).to.be.false)
    it( "should return fasle", () => expect(expect(mem.hasQualifier()).to.be.false))
  })

  describe("addQualifier", () => {
    let mem = new MemorySrc({
      type:        "int*",
      name:        "A",
      decl:        "const int *A",
      declcontext: "__global__ void vecAdd(const int __restrict__ *A, const int __restrict__ *B, const int __restrict__ *C)",
      filename:    "myFile.cu",
      range:       new SrcRange(10,2,10,30)
    })

    it( "qualifiers.length@post should be qualifiers.length@pre + 1", () => {
      let pre = mem.qualifiers.length
      expect(pre).to.equal(0)
      let post = mem.addQualifier("const").qualifiers.length
      expect(pre + 1).to.equal(post)
    })
  })

  describe("removeQualifier", () => {
    it("should remove correctly", () => {
      let mem = new MemorySrc({
        type:        "int*",
        name:        "A",
        qualifiers:  ['const', '__restrict__'],
        decl:        "const int __restrict__ *A",
        declcontext: "__global__ void vecAdd(const int __restrict__ *A, const int __restrict__ *B, const int __restrict__ *C)",
        filename:    "myFile.cu",
        range:       new SrcRange(10,2,10,30)
      })
      let res = mem.removeQualifier('const')
      expect(res).to.be.true
      expect(mem.qualifiers.length).to.equal(1)
    })

    it("should remove correctly (duplicates)", () => {
      let mem = new MemorySrc({
        type:        "int*",
        name:        "A",
        qualifiers:  ['const', '__restrict__'],
        decl:        "const int __restrict__ *A",
        declcontext: "__global__ void vecAdd(const int __restrict__ *A, const int __restrict__ *B, const int __restrict__ *C)",
        filename:    "myFile.cu",
        range:       new SrcRange(10,2,10,30)
      })
      mem.addQualifier("const")
  
      expect(mem.qualifiers.length).to.equal(3)
      mem.removeQualifier("const")
      expect(mem.qualifiers.length).to.equal(1)
    })
  })
})