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
  const MemorySrc      = require('@renderer/models/source/MemorySrc')
  const SrcRange       = require('@renderer/models/source/SrcRange')
  const Types          = require('@renderer/models/types/Types')
  const AddressSpace   = require('@renderer/models/cuda/CudaAddressSpace')
  const App            = require('@renderer/app')

  var unitType    = [Types.Int32, Types.Int64]
  var types       = ["int", "myType", "value_t", "VALUE", "DATA_TYPE"]
  var kernelNames = ["mykernel", "kernel", "kernelA", "addKernel", "sumKernel"]
  var addrSpaces   = [AddressSpace.Constant, AddressSpace.Local, AddressSpace.Shared, AddressSpace.Global]

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
          addrSpaces[getRandomInt(0, addrSpaces.length - 1)])

      let name = `mock_mem_${uuid(4)}`
      let type = types[getRandomInt(0, types.length - 1)]

      let src = new MemorySrc({
        name: name,
        decl: `${type} *${name}`,
        declContext: `__global__ void ${kernelNames[getRandomInt(0, kernelNames.length - 1)]}(${type} *${name})`,
        range: new SrcRange({fromLine: getRandomInt(1, 100), fromColumn: 2})
      })

      mem.getType().addAlias(type)
      mem.setSrc(src)

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

      let mem = new Memory(
          Types.getArrayType(unitType[getRandomInt(0, unitType.length - 1)], dim), 
          addrSpaces[getRandomInt(0, addrSpaces.length - 1)])

      let name = `mock_mem_${uuid(4)}`
      let type = types[getRandomInt(0, types.length - 1)]
    
      let src = new MemorySrc({
        name: name,
        type: type,
        decl: `${type} *${name}`,
        declContext: `__global__ void ${kernelNames[getRandomInt(0, kernelNames.length)]}(${type} *${name})`,
        range: new SrcRange({fromLine: getRandomInt(1, 100), fromColumn: 2})
      })

      mem.getType().addAlias(type)
      mem.setSrc(src)

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