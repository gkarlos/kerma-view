

const Component = require('../component')

/**
 * Base (abstract) class for the selectors
 */
class Selector extends Component {
  constructor(id, container, app) {
    super();
    
    if ( this.constructor === Selector)
      throw new InternalError('Cannot instantiate abstract class Selector')

    this.id = id;
    this.container = container;
    this.app = app;
    this.options = []
    this.selected = null;
    this.selected = null;
    this.enabled = true;
    this.name = "GenericSelector"
  }

  /**
   * Add a list of kernels to this selector
   * 
   * @param {*} kernels 
   */
  addOptions(options) { 
    options.forEach(option => this.addOption(option)) 
    return this;
  }

  addOption(option) {
    if (option)
      this.options.push(option);
    if ( this.rendered)
      this.selectize.addOption(option);
    return this;
  }

  disable() {
    this.enabled = false;
    this.rendered && this.selectize.disable();
    return this;
  }

  enable() {
    this.enabled = true;
    this.rendered && this.selectize.enable();
    return this;
  }

  render() {
    const {InternalError} = require('../../../util/error')
    throw new InternalError(`Cannot invoke abstract method Selector.render: Class '${this.constructor.name}' must implement render()`)
  }
}

module.exports = Selector