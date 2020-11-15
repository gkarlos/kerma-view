/** @ignore @typedef {import("@renderer/models/source/SrcRange")} SrcRange */
/** @ignore @typedef {import("@renderer/models/Stmt")} Stmt */
/** @ignore @typedef {import("@renderer/models/Dim")} Dim */


/**
 * @typedef {object} KernelLaunch
 * @property {Dim} grid
 * @property {Dim} block
 */

/**
 * @typedef {object} KernelStatistics
 * @property {number} loads
 * @property {number} stores
 * @property {number} atomics
 * @property {number} memops
 */

/**
 * @memberof module:models
 */
class Kernel {
  /** @type {Number}   */ #id
  /** @type {SrcRange} */ #range
  /** @type {String}   */ #color
  /** @type {String}   */ #name
  /** @type {Stmt[]}   */ #stmts
  /** @type {KernelLaunch}     */ #launch
  /** @type {KernelStatistics} */ #stats

  /** @type {} */

  /**
   * @param {Number} id
   * @param {string} name
   * @param {SrcRange} range
   */
  constructor(id,name,range,color) {
    this.#id = id
    this.#name = name
    this.#range = range
    this.#color = color
    this.#stmts = []
    this.#launch = {}
    this.#stats = {}
  }

  /**
   * Set the launch parameters
   * @param {Dim} grid
   * @param {Dim} block
   * @returns Kernel
   */
  setLaunch(grid, block) {
    this.#launch.grid = grid
    this.#launch.block = block
    return this
  }

  /**
   * Set the kernel statistics
   * @param {KernelStatistics} stats
   * @returns Kernel
   */
  setStatistics(stats) {
    this.#stats = stats
    return this
  }

  /**
   * @param {Stmt} stmt
   * @returns Kernel
   */
  addStmt(stmt) {
    this.#stmts.push(stmt)
    return this
  }

  /** @type {Number} */
  get id() { return this.#id }

  /** @type {SrcRange} */
  get range() { return this.#range }

  /** @type {string} */
  get name() { return this.#name }

  /** @type {string} */
  get color() { return this.#color }

  /** @type {Stmt[]} */
  get stmts() { return this.#stmts }

  /** @type {KernelStatistics} */
  get stats() { return this.#stats }

  /** @type {KernelLaunch} */
  get launch() { return this.#launch }

  /**
   * @param {String} color
   * @return this;
   */
  setColor(color){
    this.#color = color
    return this
  }
  /**
   * Compare with another kernel for equality
   * @param {Kernel} other
   */
  equals(other) {
    return (other instanceof Kernel)
      && this.#id === other.id
  }

  /**
   * String representation of this kernel
   * @param {Boolean} [short=false] If set a compact String representation is returned
   * @returns {String}
   */
  toString(short=false) {
    return `#${this.id}, ${this.name}`
  }
}

module.exports = Kernel