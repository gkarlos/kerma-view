const Component = require('@renderer/ui/component/Component')
const App = require('@renderer/app')

/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelectionModel").} ComputeSelectionModel */

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
    this.#node = $(`<div id="warp-view" class="list-view">WarpView </div>`)
    for ( let i = 0 ; i < 32; ++i)
      this.#node.append(ComputeSelectionWarpView.#renderWarp(i))
    this.#node.appendTo(this.container.node)
  }

  static #renderWarp = function(id) {
    return $(`<div class="warp"> Warp ${id}</div>`)
  }
}

module.exports = ComputeSelectionWarpView