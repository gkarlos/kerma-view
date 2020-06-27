const Component = require('@renderer/ui/component/Component')
const App = require('@renderer/app')

/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelectionModel").} ComputeSelectionModel */
/** @ignore @typedef {import("@renderer/models/cuda/CudaWarp")} CudaWarp */

class ComputeSelectionWarpView extends Component {
  
  /** @type {ComputeSelectionModel} */
  #model
  /** @type {JQuery} */
  #node

  /**
   * @param {ComputeSelectionModel} model 
   */
  constructor(model) {
    super('warp-selector', App.ui.containers.mainSelection.secondRow)
    this.#model = model
  }

  render() {
    console.log("rendererng warpView")
    this.#node = $(`<div id="warp-view-container"> WarpView </div>`)
    let warpContainer = $(`<div id="warp-container" class="list-group" data-simplebar></div>`)
    this.#node.append(warpContainer)

    for ( let i = 0 ; i < this.#model.block.numWarps; ++i)
      warpContainer.append(this._renderWarp(this.#model.block.getWarp(i)))
    this.#node.appendTo(this.container.node)
  }

  /**
   * 
   * @param {CudaWarp} warp 
   */
  _renderWarp(warp) {
    let res =  $(`<div class="list-group-item warp-container-item"></div>`)
    let firstRow = $(`<div id="first-row"> <p class="badge badge-secondary">Warp ${warp.getIndex()}</p> </div>`)
    let secondRow = $(`<div id="second-row"> </div>`)

    firstRow
      .appendTo(res)
      .append(`<small class="active-lanes-number"> ${warp.getNumUsableThreads()}</small>`)

    let lanesBar = $(`<div class="progress" id="active-lanes"></div>`).appendTo(firstRow)
    
    let activePercent = warp.getNumUsableThreads() / 32 * 100

    let activeLanes = $(`
      <div class="progress-bar bg-success" role="progressbar" style="width: ${activePercent}%" title="Usable Lanes">
      </div>
      `).tooltip()
    activeLanes.appendTo(lanesBar)

    if ( warp.hasUnusableThreads()) {
      let inactiveLanes = $(`
        <div class="progress-bar bg-danger" role="progressbar" style="width: ${100 - activePercent}%" title="Unusable Lanes">
        </div>
      `).tooltip()
      inactiveLanes.appendTo(lanesBar)
      $(`<small class="inactive-lanes-number"> ${warp.getNumUnusableThreads()}</small>`).appendTo(firstRow)
    }

  
    return res;
  }
}


module.exports = ComputeSelectionWarpView