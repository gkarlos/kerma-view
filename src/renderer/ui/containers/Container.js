/**
 * @memberof module:containers
 * @extends Component
 */
class Container {
  /** @type {String} */
  #id 
  /** @type {{id: String}} */
  #location
  /** */
  #node

  /**
   * @param {String} id
   * @param {Object} location
   * @param {String} location.id
   */
  constructor(id, location) {
    this.#id = id
    this.#location = location
    this.#node = null
  }

  /** @type {String} */
  get id() { return this.#id }

  /** @type {{id: String}} */
  get location() { return this.#location}

  /** */
  setNode(node) { this.#node = node}
  
  /** @type {Object} */
  get node() { return this.#node }
}

module.exports = Container