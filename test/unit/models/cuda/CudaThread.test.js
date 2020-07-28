require('module-alias/register')

const Thread   = require('@renderer/models/cuda/CuThread')
const CuGrid = require('@renderer/models/cuda/CuGrid')
const Block    = require('@renderer/models/cuda/CuBlock')
const CuDim  = require('@renderer/models/cuda/CuDim')

const expect = require('chai').expect

describe("renderer/models/cuda/CuThread", () => {

  const Block512_0   = new Block(new CuGrid(16,512), 0)
  const Block100x6_0 = new Block(new CuGrid(16, new CuDim(100,6)), 0)

  describe("constructor", () => {
    it("should throw with missing arguments",     () => expect(() => new Thread()).to.throw())
    it("should throw if block arg missing index", () => expect(() => new Thread(Block512_0)).to.throw())
    it("should not throw if block has index",     () => expect(() => new Thread(Block512_0, 0)).to.not.throw())
    it("should throw with invalid index",         () => expect(() => new Thread(Block512_0, 512)).to.throw())
  })


})