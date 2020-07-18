const AddrSpace = require('@renderer/models/memory/AddressSpace')

/**
 * @memberof module:cuda
 * https://docs.nvidia.com/cuda/nvvm-ir-spec/index.html#address-space
 */
class CudaAddrSpace {}

/** @type {AddrSpace} */
CudaAddrSpace.Local  = new AddrSpace("local", 5)

/** @type {AddrSpace} */
CudaAddrSpace.Global = new AddrSpace("constant", 4)

/** @type {AddrSpace} */
CudaAddrSpace.Shared = new AddrSpace("shared", 3)

/** @type {AddrSpace} */
CudaAddrSpace.Global = new AddrSpace("global", 1)

/** @type {AddrSpace} */
CudaAddrSpace.Local  = new AddrSpace("generic", 0)

/** @type {AddrSpace} */
CudaAddrSpace.Local  = new AddrSpace("unknown", -1)
