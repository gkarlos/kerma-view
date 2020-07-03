const Component    = require('@renderer/ui/component/Component')
const App          = require('@renderer/app')
const EventEmitter = require('events').EventEmitter
const Events       = require('@renderer/services/compute-selection/Events')

/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelectionModel")} ComputeSelectionModel */

/**
 * @memberof module:compute-selection
 */
class ComputeSelectionThreadView extends Component {

  /** @type {ComputeSelectionModel} */ #model
  /** @type {JQuery}                */ #node
  /** @type {Boolean}               */ #active
  /** @type {Boolean}               */ #enabled
  /** @type {Boolean}               */ #rendered
  /** @type {Boolean}               */ #disposed

  /**
   * @param {ComputeSelectionModel} model 
   */
  constructor(model) {
    super("thread-selector", App.ui.containers.mainSelection.secondRow.left)
    this.#model    = model
    this.#active   = false
    this.#enabled  = false
    this.#rendered = false
    this.#disposed = false
  }

 /**
   * Check if the view has been rendered
   * @returns {Boolean}
   */
  isRendered() { return this.#rendered }

  /**
   * Check if the the view is currently active
   * @returns {Boolean}
   */
  isActive() { return this.#active }

  /**
   * Check if the view is enabled. i.e the user can interact with it
   * @returns {Boolean}
   */
  isEnabled() { return this.#enabled }

  /**
   * Check if the view is disposed
   * @returns {Boolean}
   */
  isDisposed() { return this.#disposed }

  activate() {
    if ( !this.isActive()) {
      this._render()
      this.#active = true
    }
    return this
  }

  deactivate() {
    if ( this.isRendered() && this.isActive()) {
      this.#node = this.#node.detach()
      this.#active = false
    }
    return this
  }

  enable() {
    if ( !this.isDisposed()) {
      //TODO
    }
    return this
  }

  disable() {
    if ( !this.isDisposed()) {
      //TODO
    }
  }

  dispose() { }

  _renderWarp(i) {
    return $(`<div>${i.toString()}</div>`)
  }

  _render() {
    if ( this.isDisposed())
      return this

    if ( !this.isRendered()) {
      this.#node = $(`<div id="${this.id} class="list-group" data-simplebar>Thread Selector</div>`)

      for ( let i = 0; i < this.#model.block.numWarps; ++i) 
        this.#node.append(this._renderWarp(this.#model.block.getWarp(i)))

      this.#rendered = true
    }

    $(this.container.node).insertAt(1, this.#node)

    if ( this.isEnabled())
      this.enable()
    else
      this.disable()

    return this
  }
}

module.exports = ComputeSelectionThreadView