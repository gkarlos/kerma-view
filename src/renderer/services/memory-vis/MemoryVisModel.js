const {uuid} = require('@renderer/util/random')

/** @ignore @typedef {import("@renderer/models/Memory")} Memory */

/**
 * Model for a memory visualization
 * @memberof module:memory-vis
 */
class MemoryVisModel {

  /** @type {Memory} */
  #memory
  /** @type {Number} */
  #id

  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////
  /**
   * Create a new MemoryVisModel instance
   * @param {Memory} memory 
   */
  constructor(memory) {
    this.#memory = memory
    this.#id = uuid(10)
  }

  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////

  /** @type {Memory} */
  get memory() { return this.#memory }

  /** @type {Number} */
  get id() { return this.#id }

  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////

  /**
   * @returns {Memory}
   */
  getMemory() {
    return this.#memory
  }

  /**
   * @returns {Number}
   */
  getId() { 
    return this.#id 
  }

  ////////////////////////////////
  ////////////////////////////////
  ////////////////////////////////
}

module.exports = MemoryVisModel

