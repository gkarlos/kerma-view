require('module-alias/register')

const Thread = require('@renderer/models/cuda/CudaThread')
const Block  = require('@renderer/models/cuda/CudaBlock')
const Dim    = require('@renderer/models/cuda/CudaDim')

const expect = require('chai').expect

describe("renderer/models/cuda/CudaThread", () => {

  const BlockDescription512   = new Block(512)
  const BlockDescription100x6 = new Block(new Dim(100,6))
  const Block512_0            = new Block(512,0)
  const Block1024_1           = new Block(1024,1)
  const Block100x6_0          = new Block(new Dim(100,6), 0)

  describe("constructor", () => {
    it("should throw with missing arguments",     () => expect(() => new Thread()).to.throw())
    it("should throw if block arg missing index", () => expect(() => new Thread(BlockDescription512)).to.throw())
    it("should not throw if block has index",     () => expect(() => new Thread(Block1024_1, 0)).to.not.throw())
    it("should throw with missing arg 'index'",   () => expect(() => new Thread(Block1024_1)).to.throw())
    it("should throw with invalid index",         () => expect(() => new Thread(Block512_0, 512)).to.throw())
  })


})