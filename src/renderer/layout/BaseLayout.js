/**--renderer/components/layout/BaseLayout.js-----------------------/
 *
 * Part of the kerma project
 * 
 *------------------------------------------------------------------/
 * 
 * @file renderer/components/layout/BaseLayout.js
 * @author gkarlos 
 *  
 *//*--------------------------------------------------------------*/

 'use-strict'

// const Component = require('../component')
const {InternalError} = require('../../util/error')

/**
 * @abstract
 * @extends Component
 * @memberof module:renderer/components/layout
 * @classdesc
 *  Base (abstract) class for the app layout(s)
 *                                                       <br/>
 *  The app layout is composed for 3 main components:
 * 
 *  - header
 *  - body
 *  - footer 
 * 
 *  and their (common) container. The structure of these 
 *  components may differ between different implementations 
 *  of {@link BaseLayout}
 *  
 */
class BaseLayout {
  constructor(name) {

    if ( this.constructor === BaseLayout)
      throw new InternalError('Cannot instantiate abstract class BaseLayout')
    // if ( this.node === BaseLayout.prototype.node)
    //   throw new InternalError("Abstract method BaseLayout.node() must be implemented")

    this.name_ = name || "unnamed-layout"
  }

  // ------------------
  // Abstract methods
  // ------------------

  /**
   * Retrieve the app container
   * 
   * @abstract 
   * @returns {Element} A DOM element that is the root element of the layout
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element}
   */
  node() {
    throw new InternalError("Cannot invoke abstract method BaseLayout.node")
  }

  /** 
   * Materialize the layout components, and place the root node {@link this.node} into the DOM
   */
  render() {
    throw new InternalError("Cannot invoke abstract method BaseLayout.render")
  }

  /**
   * Check if the layout has been rendered.
   */
  rendered() {
    throw new InternalError("Cannot invoke abstract method BaseLayout.rendered")
  }

  // ------------------
  // Concrete methods
  // ------------------

  /** Retrieve the layout's name */
  get name() {
    return this.name_
  }

  /** Set the layout's name */
  set name(name) {
    this.name_ = name;
  }
}

module.exports = BaseLayout