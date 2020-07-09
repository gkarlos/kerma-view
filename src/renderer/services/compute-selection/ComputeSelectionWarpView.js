const Component = require('@renderer/ui/component/Component')
const App = require('@renderer/app')
const EventEmitter = require('events').EventEmitter
const Events = require("@renderer/services/compute-selection/Events")


/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelection").ComputeSelectionOnWarpSelectCallback}   ComputeSelectionOnWarpSelectCallback */
/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelection").} */
/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelectionModel")} ComputeSelectionModel */
/** @ignore @typedef {import("@renderer/models/cuda/CudaWarp")} CudaWarp */
/** @ignore @typedef {import("@renderer/models/cuda/CudaLaunch")} CudaLaunch */

/**
 * @memberof module:compute-selection
 */
class ComputeSelectionWarpView extends Component {
  
  /** @type {ComputeSelectionModel} */ #model
  /** @type {JQuery} */                #node
  /** @type {EventEmitter} */          #emitter
  /** @type {Boolean} */               #rendered
  /** @type {Boolean} */               #active
  /** @type {Boolean} */               #enabled
  /** @type {Boolean} */               #disposed

  #selected


  /**
   * @param {ComputeSelectionModel} model 
   */
  constructor(model) {
    super('warp-selector', App.ui.containers.mainSelection.secondRow.left)
    this.#model = model
    this.#active = false
    this.#rendered = false
    this.#emitter = new EventEmitter()
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
   * @returns {ComputeSelectionWarpView} this
   */
  activate() {
    if ( this.isDisposed())
      return this;

    if ( !this.isActive()) {
      this._render()
      this.#active = true
    }
    return this
  }

  /**
   * Deactivate the view. An inactive view can be reactivated later
   * @returns {ComputeSelectionWarpView} this
   */
  deactivate() {
    if ( this.isDisposed())
      return this;

    if ( this.isRendered() && this.isActive()) {
      this.#node = this.#node.detach()
      this.#active = false
    }
    return this;
  }

  /**
   * Allow the user to interact with the view
   * If the view is active it immediately becomes enabled. If it is inactive
   * it will be enabled the next time it is activated.
   * No-op if the view is disposed
   * @returns {ComputeSelectionWarpView} this
   */
  enable() {
    if ( !this.isDisposed()) {
      //TODO
    }
    return this
  }

  /**
   * Prevent the user from interacting with the view
   * If the view is activate it immediately becomes disabled. If it is inactive
   * it will be disabled the next time it is activated
   * No-op if the view is disposed
   * @returns {ComputeSelectionWarpView} this
   */
  disable() {
    if ( !this.isDisposed()) {
      //TODO
    }
  }

  /**
   * Dispose the view. A disposed view cannot be reactivated
   * @returns {ComputeSelectionWarpView} this
   */
  dispose() {
    if ( !this.isDisposed()) {
      if ( this.isRendered()) {
        this.#node.remove()
        this.#emitter.removeAllListeners()
        this.#node = undefined
        this.#emitter = undefined
      }
      this.#disposed = true;
    }
    return this;
  }

  /**
   * Register a callback to be invoked when a warp is selected
   * @param {ComputeSelectionOnWarpSelectCallback} A callback 
   */
  onSelect(callback) {
    this.#emitter.on(Events.WarpSelect, callback)
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
   * Render the view
   * @returns {ComputeSelectionWarpView}
   */
  _render() {
    if ( this.isDisposed())
      return this
    
    let block = this.#model.grid.getBlock(0)

    if ( !this.isRendered()) {
      this.#node  = $(`<div id="${this.id}" class="list-group" data-simplebar></div>`)
      // this.#node.append(warpContainer)
  
      for ( let i = 0 ; i < block.numWarps; ++i)
        this.#node.append(this._renderWarp(block.getWarp(i)))
    
      this.#rendered = true
    }

    $(this.container.node).insertAt(1, this.#node)

    if ( this.isEnabled())
      this.enable()
    else
      this.disable()
  }

  /**
   * Render a specific warp
   * @param {CudaWarp} warp 
   */
  _renderWarp(warp) {
    let res =  $(`<div class="list-group-item warp-selector-item" data-warp-id=${warp.getIndex()}></div>`)
    let firstRow = $(`<div id="first-row"> <p class="badge badge-secondary warp-index">Warp ${warp.getIndex()}${warp.getIndex() < 10? "&nbsp&nbsp":""}</p> </div>`)
    let secondRow = $(`<div id="second-row"> </div>`)

    firstRow
      .appendTo(res)
      .append(`<small class="active-lanes-number">&nbsp${warp.getNumUsableLanes() < 10 ? "&nbsp&nbsp" : ""}${warp.getNumUsableLanes()}</small>`)

    let lanesBar = $(`<div class="progress" id="active-lanes"></div>`).appendTo(firstRow)
    
    let activePercent = warp.getNumUsableLanes() / 32 * 100

    // active lanes
    $(`<div class="progress-bar bg-success" role="progressbar" style="width: ${activePercent}%" title="Usable Lanes">
       </div>`)
       .appendTo(lanesBar)
       .tooltip()
    
    if ( warp.hasUnusableLanes()) {
      // inactive lanes
      $(`<div class="progress-bar bg-danger" role="progressbar" style="width: ${100 - activePercent}%" title="Unusable Lanes">
         </div>`)
         .appendTo(lanesBar)
         .tooltip()
      // inactive lanes number
      $(`<small class="inactive-lanes-number"> ${warp.getNumUnusableLanes()}</small>`).appendTo(firstRow)
    }


    let self = this
    res.on('click', {warp : warp}, (event) => {
      self.#selected && self.#selected.removeClass("warp-selector-item-selected")
      self.#selected = res
      self.#selected.addClass("warp-selector-item-selected")
      self.#emitter.emit(Events.WarpSelect, warp, 2)
    })
    
    res.mouseover( () => {

    })

    return res;
  }

}


module.exports = ComputeSelectionWarpView