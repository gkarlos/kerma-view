
/**
 * @module MemoryFactory
 * @category Mock
 */
module.exports = function() {
  const Dim            = require('@renderer/models/Dim')
  const { getRandomInt, getRandomMultiple, uuid} = require('@renderer/util/random')
  const Memory         = require('@renderer/models/memory/Memory')
  const MemorySrc      = require('@renderer/models/source/MemorySrc')
  const Types          = require('@renderer/models/types/Types')
  const AddressSpace   = require('@renderer/models/cuda/CudaAddressSpace')
  const App            = require('@renderer/app')

  var unitType    = [Types.Int32, Types.Int64]
  var types       = ["int", "myType", "value_t", "VALUE", "DATA_TYPE"]
  var kernelNames = ["mykernel", "kernel", "kernelA", "addKernel", "sumKernel"]

  return {
    /**
     * @param {Dim} dim 
     */
    createRandom1D(dim) {
      if ( !dim)
        dim = new Dim(getRandomMultiple(100, 1000))

      if ( dim.is2D())
        dim = new Dim(dim.x)

      let mem = new Memory(
          Types.getArrayType(unitType[getRandomInt(0, unitType.length - 1)], dim), 
          getRandomInt(0,1)? AddressSpace.Shared: AddressSpace.Global)

      let name = `mem-${uuid(4)}`
      let type = types[getRandomInt(0, types.length - 1)]

      let src = new MemorySrc({
        name: name,
        type: type,
        declContext: `__global__ void ${kernelNames[getRandomInt(0, kernelNames.length - 1)]}(${type} *${name})`
      })

      mem.getType().addAlias("value_t")
      mem.setSrc(src)

      App.Logger.debug("[mock]", "Created memory:", mem.toString())
      return mem
    },

    createRandom2D(dim) {
      if ( !dim)
        dim = new Dim(getRandomMultiple(100, 1000), getRandomInt(2, 10))
      

      if ( dim.is2D())
        dim = new Dim(dim.x, getRandomInt(2, 100))

      let mem = new Memory(
          Types.getArrayType(unitType[getRandomInt(0, unitType.length - 1)], dim), 
          getRandomInt(0,1)? AddressSpace.Shared: AddressSpace.Global)

      let name = `mem-${uuid(4)}`
      let type = types[getRandomInt(0, types.length - 1)]
    
      let src = new MemorySrc({
        name: name,
        type: type,
        declContext: `__global__ void ${kernelNames[getRandomInt(0, kernelNames.length)]}(${type} *${name})`
      })

      mem.getType().addAlias(type)
      mem.setSrc(src)

      App.Logger.debug("[mock]", "Created memory:", mem.toString())
    },

    /**
     * @public
     * @param {Dim} [dim] Optional dimensions
     */
    createRandom(dim) {
      if ( !dim) {
        return getRandomInt(1, 2) === 1? this.createRandom1D() : this.createRandom2D()
      }
      return dim.is1D()? this.createRandom1D(dim) : this.createRandom2D(dim)
    }

  }
}()