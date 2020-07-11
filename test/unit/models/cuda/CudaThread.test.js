require('module-alias/register')

const Thread   = require('@renderer/models/cuda/CudaThread')
const CudaGrid = require('@renderer/models/cuda/CudaGrid')
const Block    = require('@renderer/models/cuda/CudaBlock')
const CudaDim  = require('@renderer/models/cuda/CudaDim')

const expect = require('chai').expect

describe("renderer/models/cuda/CudaThread", () => {

  const Block512_0   = new Block(new CudaGrid(16,512), 0)
  const Block100x6_0 = new Block(new CudaGrid(16, new CudaDim(100,6)), 0)

  describe("constructor", () => {
    it("should throw with missing arguments",     () => expect(() => new Thread()).to.throw())
    it("should throw if block arg missing index", () => expect(() => new Thread(Block512_0)).to.throw())
    it("should not throw if block has index",     () => expect(() => new Thread(Block512_0, 0)).to.not.throw())
    it("should throw with invalid index",         () => expect(() => new Thread(Block512_0, 512)).to.throw())
  })


})