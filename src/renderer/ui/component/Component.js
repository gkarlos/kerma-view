/** @ignore @typedef {import("@renderer/ui/containers/Container")} Container */

/**
 * Base class for ui components
 * @memberof module:component
 */
class Component {
  /** @type {String} */
  #name
  /** @type {String} */
  #id
  // /** @type {Boolean} */
  // #rendered
  /** @type {Component} */
  #container
  
  /**
   * @param {String} name A name for this component
   * @param {String} id
   * @param {Container} container
   */
  constructor(id, container) {

    /**
     * @type {String}
     */
    this.#id = id

    /**
     * @type {Container}
     */
    this.#container = container

    /** 
     * A DOM node that is the root of this component.  <br/>
     * At the moment most components use a jQuery node 
     * and only a few use vanilla js DOM elements 
     * (e.g [document.createElement](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement)) <br/>
     * So for now users must know what kind of node is used. <br/>
     * This is meant to be changed as we progressively move away from jQuery
     */
    this.node = null;
  }

  /**
   * Each components must implement this method
   * 
   * Base implementation just throws
   * 
   * @abstract
   */
  render() {
    throw new Error(`render() function for component '${this.name}' is not implemented`)
  }
  
  /**
   * Check if the component renderer
   * 
   * Each components must implement this method
   * 
   * Base implementation just throws
   * 
   * @abstract
   * @returns {Boolean}
   */
  isRendered() {
    throw new Error(`isRendered() function for Component '${this.id}' is not implemented`)
  }

  /** @type {String} */
  get id() { return this.#id}

  /** @type {Container} */
  get container() { return this.#container}
}

module.exports = Component