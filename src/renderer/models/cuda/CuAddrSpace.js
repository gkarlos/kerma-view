const AddrSpace = require('@renderer/models/memory/AddressSpace')

/**
 * @memberof module:cuda
 * https://docs.nvidia.com/cuda/nvvm-ir-spec/index.html#address-space
 */
class CuAddrSpace extends AddrSpace {}

/** @type {AddrSpace} */
CuAddrSpace.Local  = new AddrSpace("local", 5)

/** @type {AddrSpace} */
CuAddrSpace.Constant = new AddrSpace("constant", 4)

/** @type {AddrSpace} */
CuAddrSpace.Shared = new AddrSpace("shared", 3)

/** @type {AddrSpace} */
CuAddrSpace.Global = new AddrSpace("global", 1)

/** @type {AddrSpace} */
CuAddrSpace.Generic  = new AddrSpace("generic", 0)

/** @type {AddrSpace} */
CuAddrSpace.Unknown  = AddrSpace.Unknown

module.exports = CuAddrSpace
