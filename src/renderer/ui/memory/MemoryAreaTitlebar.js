const Component = require('../component/Component')

/** @ignore @typedef{import("@rerderer/app").} App*/

/**
 * A button that creates memory of random dimensions and
 * inserts a {@link MemoryVis} of it into {@link ui.memory.body} 
 * 
 * This class is only meant to be used within {@link MemoryAreaTitleBar}
 * 
 * @memberof module:memory-ui
 */
class AddRandomMemoryButton extends Component {
  /**@type {Boolean}*/ #installed
  /**@type {Boolean}*/ #rendered
  /**@type {App}    */ App

  /**
   * @param {String} id 
   * @param {String|JQuery} container 
   */
  constructor(id, container) {
    super(id, container)
    this.name = `AddRandomMemoryButton[${id}]`
    this.node = $(`<a class="btn btn-sm" href="#" id="${this.id}"><i class="fas fa-dice" style="font-size:20px"></i></a>`)
    this.#installed = false
    this.#rendered = false
  }

  /** @returns {Boolean} */
  isRendered() { return this.#rendered }

  /** @returns {Boolean} */
  isInstalled() { return this.#installed }

  ////////////////////////////////
  ////////////////////////////////

  /** @returns {JQuery} */
  render() {
    if ( !this.isRendered()) {
      this.#rendered = true;
    }
    return this.node;
  }

  useDefaultControls() {
    $('#button-add-memory').on('click', () => {
      const {Memory} = require('../memory-array')
      let m = new Memory("myArray", "int", [1024])
      console.log(m)
      m.render('#heatmap-example')
    })
  }

  /**
   * Fires when the button is clicked
   * @callback AddRndMemBtnOnClickCb
   * @param {AddRandomMemoryButton} self Reference to the clicked button
   * @memberof module:memory-ui.AddRandomMemoryButton
   */

  /**
   * @param {AddRndMemBtnOnClickCb} callback 
   * @returns {AddRandomMemoryButton} this
   */
  onClick(callback) {
    if ( !$.isFunction(callback))
      throw new Error('callback is not a function')
    this.node.on("click", callback)
    return this
  }
  
  /** @returns {AddRandomMemoryButton} */
  install() {
    if ( !this.isInstalled()) {
      this.render()
      $(this.node).appendTo(this.container)

      var MemoryFactory = require('@mock/MemoryFactory')
      var App = require('@renderer/app')

      this.onClick( () => {
        let mem = MemoryFactory.createRandom()
        App.Services.Vis.create(mem)
      })

      this.#installed = true
    }
    return this
  }
}

/**
 * Title bar for the memory area
 * 
 * This class is only meant to be used within {@link module:memory-ui.MemoryArea}
 * 
 * @memberof module:memory-ui
 */
class MemoryAreaTitleBar extends Component {
  /**@type {Boolean}*/ #installed
  /**@type {Boolean}*/ #rendered

  /**
   * @param {String} id 
   * @param {String|JQuery} container 
   */
  constructor(id, container) {
    super(id, container)
    this.name = `MemoryAreaTitlebar[${this.id}]`
    this.node         = $(`<div class="card-header" id="${this.id}"></div>`)
    this.titleWrapper = $(`<span class="title"></span>`)
    this.addButton = new AddRandomMemoryButton("button-add-memory", this.node)
  }

  /** @returns {JQuery} */
  render() {
    if ( !this.isRendered()) {
      $(this.titleWrapper).appendTo(this.node)
      this.addButton.render()
      this.#rendered = true
    }
    return this.node
  }

  /** @returns {MemoryAreaTitleBar} */
  install() {
    if ( !this.isInstalled()) {
      this.render()

      this.addButton.install()
      
      $(this.container).append(this.node)

      this.#installed = true
    }
    return this
  }

  /**
   * @param {String} title
   */
  setTitle(title) {
    this.titleWrapper.text(title)
  }

  /** @returns {MemoryAreaTitleBar} */
  _registerListeners() {
    // this.addButton.useDefaultControls()
  }

  /** @returns {Boolean} */
  isRendered() { return this.#rendered }

  /** @returns {Boolean} */
  isInstalled() { return this.#installed }
}

module.exports = MemoryAreaTitleBar