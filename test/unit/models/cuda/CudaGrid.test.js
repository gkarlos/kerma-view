require('module-alias/register')
const CuGrid  = require('@renderer/models/cuda/CuGrid')
const CudaDim = require('@renderer/models/cuda').Dim
const CudaIndex = require('@renderer/models/cuda').Index
const CudaLimits = require('@renderer/models/cuda').Limits

const expect = require('chai').expect

describe('renderer/models/cuda/CuGrid', () => {

  describe("constructor", () => {
    it("should throw with missing dim", () => {
      expect(() => new CuGrid()).to.throw()
    })

    it("should throw with missing blockDim", () => {
      expect(() => new CuGrid(1024)).to.throw()
    })

    it("should throw with invalid dim (1)", () => {
      expect(() => new CuGrid(new CudaDim())).to.throw()
    })

    it("should throw with invalid dim (2)", () => {
      expect(() => new CuGrid(new CudaDim(1024,10000000))).to.throw()
    })

    it("should throw with invalid dim (3)", () => {
      expect(() => new CuGrid(CudaLimits.maxGridSize + 1)).to.throw()
    })

    it("should throw with invalid dim (4)", () => {
      expect(() => new CuGrid(0)).to.throw()
    })

    it("should throw with invalid blockDim (1)", () => {
      expect(() => new CuGrid(1, 1025)).to.throw()
    })

    it("should throw with invalid blockDim (2)", () => {
      expect(() => new CuGrid(1, 0)).to.throw()
    })

    it("should throw with invalid blockDim (3)", () => {
      expect(() => new CuGrid(1, new CudaDim())).to.throw()
    })


    it("should not throw on 1D/1D (CudaDim, Integer) (1)", () => {
      expect(() => new CuGrid(new CudaDim(1024), 512)).to.not.throw()
    })

    it("should not throw on 1D/1D (CudaDim, Integer) (2)" , () => {
      expect(() => new CuGrid(new CudaDim(512), 2)).to.not.throw()
    })

    it("should not throw on 1D/1D (Integer, CudaDim)" , () => {
      expect(() => new CuGrid(256, new CudaDim(512))).to.not.throw()
    })

    it("should not throw on 1D/1D (Integer, Integer) (1)" , () => {
      expect(() => new CuGrid(256, 512)).to.not.throw()
    })

    it("should not throw on 1D/1D (Integer, Integer) (2)", () => {
      expect(() => new CuGrid(1024, 512)).to.not.throw()
    })

    it("should not throw on 1D/1D (CudaDim, CudaDim)" , () => {
      expect(() => new CuGrid(CudaDim.of(32), CudaDim.of(32))).to.not.throw()
    })

    it("should not throw on 1D/2D (CudaDim, CudaDim)", () => {
      expect(() =>  new CuGrid(CudaDim.of(1024,1),  CudaDim.of(256,2))).to.not.throw()
      expect(() =>  new CuGrid(CudaDim.of(10,10),   CudaDim.of(2,256))).to.not.throw()
      expect(() =>  new CuGrid(CudaDim.of(10,10,1), CudaDim.of(32,32))).to.not.throw()
      expect(() =>  new CuGrid(CudaDim.of(1,10,1),  CudaDim.of(128,4))).to.not.throw()
      expect(() =>  new CuGrid(CudaDim.of(1,10),    CudaDim.of(16,16))).to.not.throw()
    })
    
    it("should not throw on 1D/2D (Integer, CudaDim)", () => {
      expect(() =>  new CuGrid(1024,  CudaDim.of(256,2))).to.not.throw()
      expect(() =>  new CuGrid(1024,  CudaDim.of(256,2))).to.not.throw()
      expect(() =>  new CuGrid(100,   CudaDim.of(2,256))).to.not.throw()
      expect(() =>  new CuGrid(512,   CudaDim.of(32,32))).to.not.throw()
      expect(() =>  new CuGrid(10000, CudaDim.of(16,16))).to.not.throw()
      expect(() =>  new CuGrid(1,     CudaDim.of(128,4))).to.not.throw()
      expect(() =>  new CuGrid(10,    CudaDim.of(16,16))).to.not.throw()
    })

    it("should not throw on 2D/1D (CudaDim, Integer)", () => {
      expect(() =>  new CuGrid(new CudaDim(1024,1), 1024)).to.not.throw()
      expect(() =>  new CuGrid(new CudaDim(10,10),  1024)).to.not.throw()
      expect(() =>  new CuGrid(new CudaDim(10,10,1), 512)).to.not.throw()
      expect(() =>  new CuGrid(new CudaDim(1,10,1),  256)).to.not.throw()
      expect(() =>  new CuGrid(new CudaDim(1,10),    256)).to.not.throw()
    })

    it("should not throw on 2D/1D (CudaDim, CudaDim)", () => {
      expect(() =>  new CuGrid(new CudaDim(1024,1),  CudaDim.of(256))).to.not.throw()
      expect(() =>  new CuGrid(new CudaDim(10,10),   CudaDim.of(256))).to.not.throw()
      expect(() =>  new CuGrid(new CudaDim(10,10,1), CudaDim.of(256))).to.not.throw()
      expect(() =>  new CuGrid(new CudaDim(1,10,1),  CudaDim.of(256))).to.not.throw()
      expect(() =>  new CuGrid(new CudaDim(1,10),    CudaDim.of(256))).to.not.throw()
    })

    it("should throw on 3D", () => {
      expect(() => new CuGrid(new CudaDim(100,2,2))).to.throw()
    })

    it("should throw on 3D block", () => {
      expect(() => new CuGrid(1024, new CudaDim(10,10,10))).to.throw()
    })

    it("should throw on invalid 1D dim (1)", () => {
      expect(() => new CuGrid(new CudaDim(CudaLimits.maxGridX + 1))).to.throw()
    })

    it("should throw on invalid 2D dim (2)", () => {
      expect(() => new CuGrid(new CudaDim(1025,CudaLimits.maxGridY + 1))).to.throw()
    })

    it("should throw on invalid 2D dim (3)", () => {
      expect(() => new CuGrid(new CudaDim(CudaLimits.maxGridX + 1,1025))).to.throw()
    })
  })

  describe("hasIndex", () => {
    it("should throw on invalid index (1)", () => {
      expect(() => new CuGrid(dim, 1024).hasIndex("abc")).to.throw()
    })

    it("should throw on invalid index (2)", () => {
      let dim = new CudaDim(1024)
      expect(() => new CuGrid(dim, 1024).hasIndex(new CudaIndex(-15))).to.throw()
    })

    it("should throw on invalid index (3)", () => {
      let dim = new CudaDim(1024)
      expect(() => new CuGrid(dim, 1204).hasIndex(undefined)).to.throw()
    })

    it("should throw on invalid index (4)", () => {
      let dim = new CudaDim(1024)
      expect(() => new CuGrid(dim, 1024).hasIndex(null)).to.throw()
    })

    it("should not throw on valid index (1)", () => {
      let dim = new CudaDim(1024)
      expect(() => new CuGrid(dim, 1024).hasIndex(10)).to.not.throw()
    })

    it("should not throw on valid index (2)", () => {
      let dim = new CudaDim(1024)
      expect(() => new CuGrid(dim, 1024).hasIndex(new CudaIndex(1024))).to.not.throw()
    })

    it("should not throw on negative index", () => {
      let dim = new CudaDim(1024)
      expect(() => new CuGrid(dim, 1024).hasIndex(-10)).to.not.throw()
    })

    it("should return false (1)", () => {
      expect(new CuGrid(1024, 1024).hasIndex(1024)).to.be.false
    })

    it("should return false (2)", () => {
      expect(new CuGrid(1024, 1024).hasIndex(new CudaIndex(1023,0))).to.be.false
    })

    it("should return false (3)", () => {
      expect(new CuGrid(new CudaDim(10,10), 10).hasIndex(new CudaIndex(10,10))).to.be.false
    })

    it("should return true (1)", () => {
      expect(new CuGrid(1024, 1024).hasIndex(1023)).to.be.true
    })

    it("should return true (2)", () => {
      expect(new CuGrid(1024, 1024).hasIndex(new CudaIndex(0,1023))).to.be.true
    })

    it("should return true (3)", () => {
      expect(new CuGrid(1024, 1024).hasIndex(new CudaIndex(0))).to.be.true
    })

    it("should return true (4)", () => {
      expect(new CuGrid(1024, 1024).hasIndex(0)).to.be.true
    })

    it("should return true (5)", () => {
      expect(new CuGrid(1024, 1024).hasIndex(new CudaIndex(0,0))).to.be.true
    })
  })

  describe('equals', () => {
    it("should be equal 1D (1)", () => {
      expect(new CuGrid(256,256).equals(new CuGrid(256,256))).to.be.true
    })

    it("should be equal 1D (2)", () => {
      expect(new CuGrid(1,1).equals(new CuGrid(1,1))).to.be.true
    })

    it("should be equal 1D (3)", () => {
      expect(new CuGrid(256,256).equals(new CuGrid(new CudaDim(256), 256))).to.be.true
    })

    it("should be equal 1D (4)", () => {
      expect(new CuGrid(256,256).equals(new CuGrid(new CudaDim(256,1), 256))).to.be.true
    })

    it("should be equal 1D (5)", () => {
      expect(new CuGrid(256,256).equals(new CuGrid(new CudaDim(256,1,1), 256))).to.be.true
    })

    it("should be equal 1D (6)", () => {
      expect(new CuGrid(256,256).equals(new CuGrid(new CudaDim(256,1,1), new CudaDim(256,1,1)))).to.be.true
    })

    it("should be equal 1D (7)", () => {
      expect(new CuGrid(256,256).equals(new CuGrid(new CudaDim(256,1,1), new CudaDim(256,1)))).to.be.true
    })

    it("should be equal 2D (1)", () => {
      expect(new CuGrid(new CudaDim(2,256), 256).equals(new CuGrid(new CudaDim(2,256), 256))).to.be.true
    })

    it("should be equal 2D (2)", () => {
      expect(new CuGrid(new CudaDim(1,256), 256).equals(new CuGrid(new CudaDim(1,256), 256))).to.be.true
    })

    it("should be equal 2D (3)", () => {
      expect(new CuGrid(new CudaDim(10,10), 10).equals(new CuGrid(new CudaDim(10,10), 10))).to.be.true
    })

    it("should be equal 2D (4)", () => {
      expect(new CuGrid(new CudaDim(10), 10).equals(new CuGrid(new CudaDim(10,1), 10))).to.be.true
    })

    it("should be equal 2D (5)", () => {
      expect(new CuGrid(10, new CudaDim(10)).equals(new CuGrid(10, new CudaDim(10)))).to.be.true
    })
  
    it("should not be equal 1D (1)", () => {
      expect(new CuGrid(256,256).equals(new CuGrid(255,255))).to.be.false
    })

    it("should not be equal 1D (2)", () => {
      expect(new CuGrid(1, new CudaDim(2)).equals(new CuGrid(new CudaDim(2), 1))).to.be.false
    })

    it("should not be equal 1D (3)", () => {
      expect(new CuGrid(123,1).equals(new CuGrid(1,123))).to.be.false
    })

    it("should not be equal 1D (4)", () => {
      expect(new CuGrid(256,1).equals(new CuGrid(new CudaDim(255),1))).to.be.false
    })

    it("should not be equal 1D (5)", () => {
      expect(new CuGrid(256,256).equals(new CuGrid(new CudaDim(1,256), 256))).to.be.false
    })

    it("should not be equal 1D (6)", () => {
      expect(new CuGrid(1,256).equals(new CuGrid(new CudaDim(256), 1))).to.be.false
    })

    it("should not be equal 2D (1)", () => {
      expect(new CuGrid(new CudaDim(16,16), 16).equals(new CudaDim(1,16), 16)).to.be.false
    })

    it("should not be equal 2D (2)", () => {
      expect(new CuGrid(new CudaDim(1,256), 256).equals(new CuGrid(new CudaDim(256,1), 256))).to.be.false
    })

    it("should not be equal 2D (3)", () => {
      expect(new CuGrid(new CudaDim(2,100), new CudaDim(100,2)).equals(new CuGrid(new CudaDim(100,2), new CudaDim(2,100)))).to.be.false
    })
  })
})