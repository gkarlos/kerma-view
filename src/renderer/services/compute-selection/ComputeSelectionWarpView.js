const Component = require('@renderer/ui/component/Component')
const App = require('@renderer/app')
const EventEmitter = require('events').EventEmitter
const Events = require("@renderer/services/compute-selection/Events")


/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelection").ComputeSelectionOnWarpSelectCallback}   ComputeSelectionOnWarpSelectCallback */

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
    return this;
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

  _render() {
    if ( this.isDisposed())
      return this
    
    if ( !this.isRendered()) {
      this.#node  = $(`<div id="warp-container" class="list-group" data-simplebar></div>`)
      // this.#node.append(warpContainer)
  
      for ( let i = 0 ; i < this.#model.block.numWarps; ++i)
        this.#node.append(this._renderWarp(this.#model.block.getWarp(i)))
    
      this.#rendered = true
    }

    $(this.container.node).insertAt(1, this.#node)

    if ( this.isEnabled())
      this.enable()
    else
      this.disable()
  }

  /**
   * 
   * @param {CudaWarp} warp 
   */
  _renderWarp(warp) {
    let res =  $(`<div class="list-group-item warp-container-item" data-warp-id=${warp.getIndex()}></div>`)
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
      self.#selected && self.#selected.removeClass("warp-container-item-selected")
      self.#selected = res
      self.#selected.addClass("warp-container-item-selected")
      self.#emitter.emit(Events.WarpSelect, warp, 2)
    })
    
    res.mouseover( () => {

    })

    return res;
  }

  /**
   * Register a callback to be invoked when a warp is selected
   * @param {ComputeSelectionOnWarpSelectCallback} A callback 
   */
  onSelect(callback) {
    this.#emitter.on(Events.WarpSelect, callback)
  }

  onClear(callback) {
    
  }
}


module.exports = ComputeSelectionWarpView