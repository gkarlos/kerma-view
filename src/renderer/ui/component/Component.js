/**
 * Base class for ui components
 * @memberof module:ui/component
 */
class Component {
  /**
   * @param {String} name A name for this component
   */
  constructor(name="UnnamedComponent") {
    /** 
     * The name of this component 
     * @type {String}
     */
    this.name = name;
    /**
     * Whether this component has been rendered at least once 
     * @type {boolean} 
     * @default false
     */
    this.rendered = false

    /** 
     * A DOM node that is the root of this component.  <br/>
     * At the moment most components use a jQuery node 
     * and only a few use vanilla js DOM elements 
     * (e.g [document.createElement](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement)) <br/>
     * So for now users must know what kind of node is used. <br/>
     * This is meant to be changed as we progressively move away from jQuery
     * 
     * 
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
    throw new Error(`render() function for component '${this.name}' not implemented`)
  }
}

module.exports = Component