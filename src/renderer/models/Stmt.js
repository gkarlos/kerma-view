/** @ignore @typedef {import("@renderer/models/source/SrcRange")} SrcRange */


class Stmt {
  /** @type {number}   */ #id
  /** @type {number}   */ #type
  /** @type {SrcRange} */ #range

  /**
   * @param {number} id
   * @param {number} type
   * @param {SrcRange} range
   */
  constructor(id, type, range) {
    this.#id = id
    this.#type = type
    this.#range = range
  }

  get id() { return this.#id; }
  get range() { return this.#range; }
  get type() { return this.#type; }

  isRead() { return this.#id == 1; }
  isWrite() { return this.#id == 2; }
  isReadWrite() { return this.#id == 3; }

  equals(other) {
    return this.id = other.id &&
      this.range == other.range &&
      this.type == other.type
  }
}

module.exports = Stmt