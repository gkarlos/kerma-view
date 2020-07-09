const Component    = require('@renderer/ui/component/Component')
const App          = require('@renderer/app')
const EventEmitter = require('events').EventEmitter
const Events       = require('@renderer/services/compute-selection/Events')
const { CudaWarp,
        CudaIndex} = require('@renderer/models/cuda')
const { first } = require('lodash')

/** @ignore @typedef {import("@renderer/models/cuda/CudaWarp")} CudaWarp */
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

  /**
   * Activate the view
   * @returns {ComputeSelectionThreadkView} this
   */
  activate() {
    if ( !this.isActive()) {
      this._render()
      this.#active = true
    }
    return this
  }

  /**
   * Deactivate the view
   * @returns {ComputeSelectionThreadView} this
   */
  deactivate() {
    if ( this.isRendered() && this.isActive()) {
      this.#node = this.#node.detach()
      this.#active = false
    }
    return this
  }

  /**
   * Allow the user to interact with the view
   * If the view is active it immediately becomes enabled. If it is inactive
   * it will be enabled the next time it is activated.
   * No-op if the view is disposed
   * @returns {ComputeSelectionThreadView} this
   */
  enable() {
    if ( !this.isDisposed()) {
      //TODO
    }
    return this
  }

  /**
   * Prevent the user from interacting with the view
   * If the view is active it immediately becomes disabled. If it is inactive
   * it will be disabled the next time it is activated.
   * No-op if the view is disposed
   * @returns {ComputeSelectionThreadView} this
   */
  disable() {
    if ( !this.isDisposed()) {
      //TODO
    }
  }

  /**
   * Dispose the view. A disposed view cannot be reactivated
   * @returns {ComputeSelectionThreadView} this
   */
  dispose() { 
    //TODO
  }

  /**
   * Render a thread in a warp
   * @param {CudaWarp} warp 
   * @param {Number} lane
   */
  _renderThread(warp, lane) {
    let block = this.#model.getBlockSelection()

    let thread = $(`<div class="thread"></div>`)
      .popover({
        placement: 'auto',
        trigger: 'manual',
        container: 'body',
        html: true,
        content: () => {
          console.log(block.size, CudaIndex.linearize(block.getIndex(), this.#model.getGrid().dim))
          return `
          <div> 
            <span class="key">btid:</span>
            <span class="value">${warp.getFirstThreadIndex() + lane}</span>
            <span class="key">gtid:</span>
            <span class="value">${
              block.size * CudaIndex.linearize(block.getIndex(), this.#model.getGrid().dim)
              + (warp.getFirstThreadIndex() + lane)
            }
          </div>
          `
        }
      })

    $(thread).on('mouseenter', () => thread.popover("show"))
    $(thread).on('mouseleave', () => thread.popover("hide"))
    return thread
  }

  /**
   * Render a warp in the view
   * @param {CudaWarp} warp 
   */
  _renderWarp(warp) {

    let res       = $(`<div class="list-group-item thread-selector-item" data-warp-id=${warp.getIndex()}></div>`)
    let firstRow  = $(`<div class="first-row"></div>`).appendTo(res)
    let secondRow = $(`<div class="second-row"></div>`).appendTo(res)

    let badge = $(`
      <p class="badge badge-secondary thread-view-warp-index">
        Warp ${warp.getIndex()}${warp.getIndex() < 10? "&nbsp&nbsp":""}
      </p>
    `).appendTo(firstRow)

    firstRow.append($(`<span class="first-index">${warp.getFirstThreadIndex()}</span>`))
    secondRow.append($(`<span class="middle-index">${warp.getFirstThreadIndex() + 16}</span>`))

    let halfWarp0 = $(`<div class="halfwarp"></div>`)
    let halfWarp1 = $(`<div class="halfwarp"></div>`)

    for ( let i = 0; i < CudaWarp.Size; ++i )
      if ( i < CudaWarp.Size / 2)
        halfWarp0.append(this._renderThread(warp, i))
      else
        halfWarp1.append(this._renderThread(warp, i))
    
    
    firstRow.append(halfWarp0)
    secondRow.append(halfWarp1)

    return res
  }

  /**
   * Render the view
   */
  _render() {
    if ( this.isDisposed())
      return this

    let block = this.#model.getBlockSelection()

    if ( !this.isRendered()) {
      this.#node = $(`<div id="${this.id}" class="list-group" data-simplebar></div>`)

      for ( let i = 0; i < block.numWarps; ++i) 
        this.#node.append(this._renderWarp(block.getWarp(i)))

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