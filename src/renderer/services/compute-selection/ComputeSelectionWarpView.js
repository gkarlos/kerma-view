const Component = require('@renderer/ui/component/Component')
const App = require('@renderer/app')
const EventEmitter = require('events').EventEmitter
const Events = require("@renderer/services/compute-selection/Events")


/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelection").ComputeSelectionOnWarpSelectCallback}   ComputeSelectionOnWarpSelectCallback */

/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelectionModel")} ComputeSelectionModel */
/** @ignore @typedef {import("@renderer/models/cuda/CudaWarp")} CudaWarp */
/** @ignore @typedef {import("@renderer/models/cuda/CudaLaunch")} CudaLaunch */

class ComputeSelectionWarpView extends Component {
  
  /** @type {ComputeSelectionModel} */
  #model
  /** @type {JQuery} */
  #node
  /** @type {EventEmitter} */
  #emitter
  /** @type {Boolean} */
  #active
  /** @type {Boolean} */
  #rendered
  #selected


  /**
   * @param {ComputeSelectionModel} model 
   */
  constructor(model) {
    super('warp-selector', App.ui.containers.mainSelection.secondRow)
    this.#model = model
    this.#active = false
    this.#rendered = false
    this.#emitter = new EventEmitter()
  }

  isRendered() { 
    return this.#rendered
  }

  isActive() {
    return this.#active
  }

  activate() {
    if ( !this.isActive()) {
      this.render()
      this.#active = true
    }
    return this
  }

  deactivate() {
    if ( this.isRendered() && this.isActive()) {
      console.log("deactivating")
      this.#node = this.#node.remove()
      this.#active = false
    }
    return this;
  }

  clear() {

  }

  render() {
    this.#node = $(`<div id="warp-view-container"> WarpView </div>`)
    let warpContainer = $(`<div id="warp-container" class="list-group" data-simplebar></div>`)
    this.#node.append(warpContainer)

    for ( let i = 0 ; i < this.#model.block.numWarps; ++i)
      warpContainer.append(this._renderWarp(this.#model.block.getWarp(i)))
    $(this.container.node).insertAt(1, this.#node)
    this.#rendered = true
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

      this.#emitter.emit(Events.WarpSelect, warp)
    })
    
    res.mouseover( () => {

    })

    return res;
  }

  /**
   * Register a callback to be invoken when a warp is selected
   * @param {ComputeSelectionOnWarpSelectCallback} A callback 
   */
  onSelect(callback) {
    this.#emitter.on(Events.WarpSelect, callback)
  }

  onClear(callback) {
    
  }
}


module.exports = ComputeSelectionWarpView