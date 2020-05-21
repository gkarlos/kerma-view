/**
 * @file components/component.js 
 */

/**
 * @abstract
 * @classdesc
 *  Base class for components
 */
class Component {
  consturctor(name="UnnamedComponent") {
    this.name = name;
    this.rendered = false
    this.node = null;
  }

  render() {
    console.log(`[warn] render() function for component '${this.name}' not implemented`)
  }
}

module.exports = Component