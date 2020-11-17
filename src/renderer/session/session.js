/** @ignore @typedef {import("@renderer/models/Kernel")} Kernel */

const Index = require("@renderer/models/Idx");

class Session {
  id = null;

  // User selected props
  /** @type Kernel[] */ #Kernels
  /** @type Kernel   */ #Kernel
  /** @type Index    */ #Block
  /** @type number   */ #Warp
  /** @type number   */ #Lane

  // Computed props
  /** @type Index    */ #Thread
  /** @type Index    */ #GlobalThread

  constructor(id=null) {
    if ( !id) {
      this.id = require('crypto').randomBytes(16).toString('base64');
    }
    this.#Kernels = []
    this.#Block = new Index(0,0)
    this.#Warp = 0
    this.#Lane = 0
  }

  /** @type {Kernel} */
  get kernel() { return this.#Kernel; }

  /** @type {number} */
  get warp() { return this.#Warp; }

  /** @type {number} */
  get lane() { return this.#Lane; }

  /**
   * Local thread index
   * @type {Index}
   */
  get thread() { return this.#Thread; }

  /**
   * Global thread index
   * @type {index}
   */
  get glbthread() { return this.#GlobalThread; }

  /**
   * Add a kernel to the kernel list of this session
   * @param {Kernel} kernel
   */
  addKernel(kernel) {
    this.#Kernels.push(kernel);
    return this;
  }

  /**
   * Add an array of kernels to the session
   * @param {Kernel[]} kernels an array of Kernels
   * @param {boolean} [clear=false] if set all previous session data is cleared
   * @returns Session
   */
  addKernels(kernels, clear=false) {
    if ( clear)
      this.clear(true)
    this.#Kernels.push.apply(kernels);
    return this;
  }

  /**
   * Select a kernel. No checks are performed so make sure
   * the kernel is one of the kernels in the list
   * @param {Kernel} kernel
   * @returns Session
   */
  setKernel(kernel) {
    this.#Kernel = kernel
    if ( !this.#Block.equals(new Index(0,0)))
      this.setBlock(this.#Block)
    this.setWarp(this.#Warp)
    this.setLane(this.#Lane)
    return this
  }

  /**
   * Set the block for this session. \p idx can be either
   * an Index object or an int. In general we work with
   * Index object so if an int is passed, it will be
   * delinearized into an Index, even if it is actually 1D.
   *
   * The idx passed is assumed to be valid for the launch
   * parameters for the current kernel. This implies that
   * any dilinearization will be based on the dim of the
   * grid retrieved by `getKernel().launch.grid`
   *
   * If not kernel is set, or any other error occurs, the index 
   * will be (0,0)
   * @param {Number|Index} idx
   * @returns Session
   */
  setBlock(idx) {
    let NewBlockIndex;
    if ( Number.isFinite(idx))
      NewBlockIndex = this.#Kernel? Index.delinearize(idx, this.#Kernel.launch.grid) : new Index(0,0)
    else
      NewBlockIndex = (idx && idx instanceof Index) ? idx : new Index(0,0)
    this.#Block = NewBlockIndex;
    return this;
  }

  /**
   * Set the selected warp id. If the id is not in range for the
   * current block size, the value is set to 0 and a warning is logged
   * @param {number} warpid
   * @returns Session
   */
  setWarp(warpid) {
    if ( warpid && this.#Kernel) {
      let NWarps = Math.ceil(this.#Kernel.launch.block / 32);
      if ( warpid >= NWarps) {
        console.warn("invalid warp id", warpid, ". Expected [0,", NWarps, "]. Defaulting to 0");
        this.#Warp = 0;
      } else {
        this.#Warp = warpid;
      }
    } else {
      this.#Warp = 0;
    }
    this._recalculateGlobalIdx();
    return this;
  }

  /**
   * Set the select lane. Value must be in range [0, 31]
   * if the value is out of range the lane is set to 0 and a
   * warning is logged
   * @param {number} laneid
   * @returns Session
   */
  setLane(laneid) {
    if ( Number.isInteger(laneid) && laneid >= 0 && laneid <= 31) {
      this.#Lane = laneid;
    } else {
      this.#Lane = 0;
    }
    this._recalculateGlobalIdx();
    return this;
  }

  /**
   * Set
   */

  /**
   * Retrieve the selected kernel 
   * @returns {Kernel} 
   */
  getKernel() { return this.#Kernel; }

  /** @returns {Kernel[]} */
  getKernels() { return this.#Kernels }

  /**
   * @param {Number} id
   */
  getKernelById(id) {
    for ( let i = 0; i < this.#Kernels.length; ++i)
      if ( this.#Kernels[i].id == id)
        return this.#Kernels[i]
    return undefined
  }

  /**
   * Clear the session. By default only the user selections are cleared
   * @param {boolean} [all=false]
   * 
   */
  clear(all=false) {
    // clean the selection
    this.#Kernel = undefined
    this.#Block = new Index(0,0)
    this.#Warp = 0;
    this.#Lane = 0;
    this.#Thread = new Index(0,0);
    this.#GlobalThread = new Index(0,0);
    if ( all)
      this.#Kernels = []
  }


  // private methods
  _recalculateGlobalIdx() {
    if ( !this.#Kernel) {
      let linearTidx = this.#Block.linearize * this.#Kernel.launch.block.size + (32 * this.#Warp) + laneid
      this.#Thread = Index.delinearize(linearTidx, this.#Kernel.launch.grid)
    }
  }

}

module.exports = Session