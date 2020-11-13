/** @ignore @typedef {import("@renderer/models/source/SrcRange")} SrcRange */
/** @ignore @typedef {import("@renderer/models/Stmt")} Stmt */

/**
 * @memberof module:models
 */
class Kernel {
  /** @type {Number}   */ #id
  /** @type {SrcRange} */ #range
  /** @type {String}   */ #color
  /** @type {String}   */ #name
  /** @type {Stmt[]}   */ #stmts

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
  }

  /**
   * @param {Stmt} stmt
   */
  addStmt(stmt) {
    this.#stmts.push(stmt)
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