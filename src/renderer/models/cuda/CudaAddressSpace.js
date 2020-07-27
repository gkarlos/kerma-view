const AddrSpace = require('@renderer/models/memory/AddressSpace')

/**
 * @memberof module:cuda
 * https://docs.nvidia.com/cuda/nvvm-ir-spec/index.html#address-space
 */
class CudaAddressSpace {}

/** @type {AddrSpace} */
CudaAddressSpace.Local  = new AddrSpace("local", 5)

/** @type {AddrSpace} */
CudaAddressSpace.Constant = new AddrSpace("constant", 4)

/** @type {AddrSpace} */
CudaAddressSpace.Shared = new AddrSpace("shared", 3)

/** @type {AddrSpace} */
CudaAddressSpace.Global = new AddrSpace("global", 1)

/** @type {AddrSpace} */
CudaAddressSpace.Generic  = new AddrSpace("generic", 0)

/** @type {AddrSpace} */
CudaAddressSpace.Unknown  = new AddrSpace("unknown", -1)

module.exports = CudaAddressSpace
