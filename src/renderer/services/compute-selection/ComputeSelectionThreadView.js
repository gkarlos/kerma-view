const Component    = require('@renderer/ui/component/Component')
const App          = require('@renderer/app')
const EventEmitter = require('events').EventEmitter
const Events       = require('@renderer/services/compute-selection/Events')
const { CuWarp,
        CudaIndex,
        CudaThread} = require('@renderer/models/cuda')

/** @ignore @typedef {import("@renderer/models/cuda/CuWarp")} CuWarp */
/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelectionModel")} ComputeSelectionModel */

/**
 * @memberof module:compute-selection
 */
class ComputeSelectionThreadView extends Component {

  /** @type {ComputeSelectionModel} */ #model
  /** @type {JQuery}                */ #node
  /** @type {JQuery} */                #selected
  /** @type {Boolean}               */ #active
  /** @type {Boolean}               */ #enabled
  /** @type {Boolean}               */ #rendered
  /** @type {Boolean}               */ #disposed
  /** @type {EventEmitter}          */ #emitter
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
    this.#emitter  = new EventEmitter()
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
    return this;
  }

  /**
   * Dispose the view. A disposed view cannot be reactivated
   * @returns {ComputeSelectionThreadView} this
   */
  dispose() { 
    if ( !this.isDisposed()) {
      this.#node.detach()
      this.#emitter.removeAllListeners()
    } 
    return this;
  }

  clearSelection() {
    if ( this.#model.hasThreadSelected()) {
      this.#selected.removeClass("thread-selector-item-selected")
      this.#selected = undefined
    }
    return this;
  }


  /**
   * Register a callback to be invoked when a thread is selected
   * @param {ComputeSelectionOnThreadSelectCallback} callback A callback 
   */
  onSelect(callback) {
    this.#emitter.on(Events.ThreadSelect, callback)
  }

  /**
   * 
   * @param {Comp} callback 
   */
  onEnable(callback) {
    //TODO
  }

  onDisable(callback) {
    //TODO
  }

  /**
   * Render a thread in a warp
   * @param {CuWarp} warp 
   * @param {Number} lane
   */
  _renderThread(warp, lane, unusable=false) {

    let self = this;

    let thread = $(`<div class="thread ${unusable? 'unusable' : 'usable'}">${unusable? '<i class="fas fa-times"></i>' : ''}</div>`)
      .popover({
        placement: 'auto',
        trigger: 'manual',
        container: 'body',
        html: true,
        content: () => unusable?
          `<div>Unusable lane</div>`
          :
          `
          <div> 
            <span class="key">loc:</span>
            <span class="value">${warp.getFirstThreadIndex() + lane}</span>
            <span class="key">glob:</span>
            <span class="value">${
              this.#model.getBlockSelection().getFirstGlobalLinearThreadIdx() + (warp.getIndex() * CuWarp.Size) + lane
            }
          </div>
          `
      })

    $(thread).on('mouseenter', () => thread.popover("show"))
    $(thread).on('mouseleave', () => thread.popover("hide"))

    if ( !unusable)
      $(thread).click({thread: new CudaThread(this.#model.getBlockSelection(), warp.getFirstThreadIndex() + lane)}, (event) => {
        if ( !this.#model.hasThreadSelected() || !(this.#model.getThreadSelection().equals(event.data.thread))) {
          self.#selected && self.#selected.removeClass("thread-selector-item-selected")
          self.#selected = thread
          self.#selected.addClass("thread-selector-item-selected")
          self.#model.selectThread(event.data.thread)
          self.#emitter.emit(Events.ThreadSelect, event.data.thread)
        }
      })
    return thread
  }

  /**
   * Render a warp in the view
   * @param {CuWarp} warp 
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
    let halfWarp0 = $(`<div class="halfwarp"></div>`)

    secondRow.append($(`<span class="middle-index">${warp.getFirstThreadIndex() + 16}</span>`))
    let halfWarp1 = $(`<div class="halfwarp"></div>`)

    for ( let lane = 0; lane < CuWarp.Size; ++lane )
      if ( lane < CuWarp.Size / 2)
        halfWarp0.append(this._renderThread(warp, lane, warp.getLastUsableLaneIndex() < lane))
      else
        halfWarp1.append(this._renderThread(warp, lane, warp.getLastUsableLaneIndex() < lane))
    
    
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

    if ( !this.isRendered()) {
      this.#node = $(`<div id="${this.id}" class="list-group" data-simplebar></div>`)

      for ( let i = 0; i < this.#model.getBlockSelection().getNumWarps(); ++i) 
        this.#node.append(this._renderWarp(this.#model.getBlockSelection().getWarp(i)))

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