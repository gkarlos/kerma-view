const SrcInfo = require('./SrcInfo')
const SrcRange = require('./SrcRange')
const _ = require('@renderer/app')._

/** @ignore @type import("@renderer/models/source/SrcRange") SrcRange*/

/**
 * @memberof module:source
 */
class MemorySrc extends SrcInfo {

  /** @type {String}   */ #type
  /** @type {String}   */ #name
  /** @type {String[]} */ #qualifiers
  /** @type {String}   */ #decl
  /** @type {Striung}  */ #declContext
  
  /**
   * Create a new MemorySrc object
   * @param {Object}      opts
   * @param {String}      [opts.type]
   * @param {String}      [opts.name]
   * @param {String[]}    [opts.qualifiers]
   * @param {String}      [opts.decl]
   * @param {String}      [opts.declcontext]
   * @param {String}      [opts.filename]
   * @param {SrcRange}    [opts.range]
   */
  constructor(opts={}) {
    super(opts)
    this.#type        = opts.type
    this.#name        = opts.name
    this.#qualifiers  = opts.qualifiers || []
    this.#decl        = opts.decl
    this.#declContext = opts.declcontext
  }

  /** @type {String} */
  get type() { return this.#type }

  /** @type {String} */
  get name() { return this.#name }

  /** @type {String} */
  get qualifiers() { return this.#qualifiers }

  /** @type {String} */
  get decl() { return this.#decl }

  /** @type {String} */
  get declContext() { return this.#declContext }

  /**
   * @param {String} type
   * @returns {MemorySrc}
   */
  setType(type) {
    this.#type = type
    return this
  }

  /**
   * @param {String} name
   * @returns {MemorySrc}
   */
  setName(name) {
    this.#name = name
    return this
  }

  /**
   * @param {String} declContext 
   * @returns {MemorySrc}
   */
  setDeclContext(declContext) {
    this.#declContext = declContext
    return this
  }

  /**
   * @param {String} decl 
   * @returns {MemorySrc}
   */
  setDecl(decl) {
    this.#decl = decl;
    return this
  }

  /**
   * @param {String} 
   * @returns {MemorySrc} 
   */
  addQualifier(qualifier) {
    this.#qualifiers.push(qualifier)
    return this
  }

  /** @returns {Boolean} */
  removeQualifier(qualifier) {
    let res = false
    for ( let i = 0; i < this.#qualifiers.length; ++i)
      if ( this.#qualifiers[i] === qualifier) {
        this.#qualifiers.splice(i, 1)
        res = true
      }
    return res
  }

  /** @returns {Boolean} */
  hasQualifier(qualifier) {
    return this.#qualifiers.find(qual => qual === qualifier) != undefined
  }

  /** @returns {String} */
  getType() { 
    return this.#type
  }

  /** @returns {String} */
  getName() { 
    return this.#name
  }

  /** @returns {String} */
  getDecl() { 
    return this.#decl
  }

  /** @returns {String} */
  getDeclContext() { 
    return this.#declContext
  }

  /** @returns {String[]} */
  getQualifiers() {
    return this.#qualifiers
  }

  /**
   * 
   * @param {MemorySrc} other 
   */
  equals(other) {
    return (other instanceof MemorySrc) 
      && super.equals(other)
      && this.#type === other.type
      && this.#name === other.name
      && _.isEqual(this.#qualifiers, other.qualifiers)
  }
}

module.exports = MemorySrc