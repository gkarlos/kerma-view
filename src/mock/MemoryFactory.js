const { SrcLoc } = require('@renderer/models/source')

/**
 * @module MemoryFactory
 * @category Mock
 */
module.exports = function() {
  const Dim            = require('@renderer/models/Dim')
  const { 
    uuid,
    getRandomInt, 
    getRandomMultiple 
  } = require('@renderer/util/random')
  const Memory         = require('@renderer/models/memory/Memory')
  const Types          = require('@renderer/models/types/Types')
  const CuAddrSpace   = require('@renderer/models/cuda/CuAddrSpace')
  const App            = require('@renderer/app')

  var unitType    = [ 
                      Types.Int32, 
                      Types.Int64, 
                      Types.UInt64, 
                      Types.Boolean,
                      Types.getStuctType(Types.Int16, Types.Int32),
                      Types.getStuctType(Types.UInt32, Types.Float, Types.Double), 
                      Types.getStuctType(Types.Int16, Types.Int32, Types.Boolean),
                      Types.getStuctType(Types.Double, Types.getStuctType(Types.Int16, Types.UInt64)),
                      Types.getStuctType(Types.Float, Types.getNamedStructType("mystruct_t", Types.Int16, Types.UInt64))
                    ]
  var types       = ["int", "myType", "value_t", "VALUE", "DATA_TYPE"]
  var kernelNames = ["mykernel", "kernel", "kernelA", "addKernel", "sumKernel"]
  var addrSpaces   = [CuAddrSpace.Constant, CuAddrSpace.Local, CuAddrSpace.Shared, CuAddrSpace.Global]

  return {
    /**
     * @param {Dim} dim 
     */
    createRandom1D(dim) {
      if ( !dim)
        dim = new Dim(getRandomMultiple(100, 1000))

      if ( dim.is2D())
        dim = new Dim(dim.x)

      let name = `mock_mem_${uuid(4)}`
      let mem = new Memory(name,
          Types.getArrayType(unitType[getRandomInt(0, unitType.length - 1)], dim), 
          addrSpaces[getRandomInt(0, addrSpaces.length - 1)], new SrcLoc(10,15))
      return mem
    },

    /**
     * @param {Dim} dim
     */
    createRandom2D(dim) {
      if ( !dim)
        dim = new Dim(getRandomMultiple(100, 1000), getRandomInt(2, 10))

      if ( dim.is2D())
        dim = new Dim(dim.x, getRandomInt(2, 100))

      let name = `mock_mem_${uuid(4)}`
      let mem = new Memory(name,
          Types.getArrayType(unitType[getRandomInt(0, unitType.length - 1)], dim), 
          addrSpaces[getRandomInt(0, addrSpaces.length - 1)], new SrcLoc(10,15))
      // console.log(Types.pp(mem.getType()))
      return mem
    },

    /**
     * @param {Dim} [dim] Optional dimensions
     * @returns {Memory}
     */
    createRandom(dim) {
      if ( !dim) {
        return getRandomInt(0, 1)? this.createRandom2D() : this.createRandom1D()
      }
      return dim.is1D()? this.createRandom1D(dim) : this.createRandom2D(dim)
    }

  }
}()