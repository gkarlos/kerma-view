/**
 * @module ColorGenerator
 * @category Renderer
 * @subcategory util
 */

const randomColor = require('randomcolor')
const random = require('@renderer/util/random')


/**
 * This class generates random colors
 */
class ColorGenerator {
  /** @type {Number} */
  #n
  /** @type {String} */
  #seed
  /** @type {Number} */
  #current
  /** @type {String[]} */
  #colors

  /**
   * 
   * @param {Number} count The number of colors to generate. Defaults to one
   */
  constructor(count=1) {
    this.#n = Number.isInteger(count) && Number.isFinite(count) ? count : 1
    this.#seed = random.getRandomInt(1, 0xFFFFFFFF)
    this.#current = 0
    this.#colors = randomColor({
      luminosity: 'light',
      count : this.#n,
      seed : this.#seed,
      alpha : 0.5,
      format : "rgba"
    })
  }

  /** 
   * The number of available colors
   * @type {Number} 
   */
  get n() { return this.#n }


  reroll() {
    this.#seed = random.uuid(16)
    this.#colors = randomColor({
      luminosity: 'light',
      count : this.#n,
      seed : this.#seed,
      alpha : 0.5,
      format : "rgba"
    })
    this.#current = 0
  }

  extend(by=1){
    this.#colors = randomColor({
      luminosity: 'light',
      count : this.#n + by,
      seed : this.#seed,
      alpha : 0.5,
      format : "rgba"
    })
    this.#n += by
  }

  /**
   * Retrieve a new color. If the available colors are exhausted a new one will be generated
   * and the size of the list will increase
   * 
   * @returns {String}
   */
  next() {
    if ( this.#current == this.#n ) {
      this.extend()
      return this.next()
    }
    return this.#colors[this.#current++]
  }
}

module.exports = ColorGenerator