const path = require('path')
require('app-module-path').addPath(path.join(__dirname, "..", "..", "..", "src"))

const Memory = require('renderer/model/memory').Memory
const expect = require('chai').expect

describe("Memory", function() {
  // it('constructor() should throw if opts is null', () => {
  //   expect(() => new Memory()).to.throw()
  //   expect(() => new Memory(null)).to.throw()
  // })

  // it('constructor() should throw if opts.name is missing', () => {
  //   expect(() => new Memory({})).to.throw()
  // })
})

