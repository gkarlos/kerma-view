const Component    = require('@renderer/ui/component/Component')
const EventEmitter = require('events').EventEmitter
const App          = require('@renderer/app')

/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelectionModel")} ComputeSelectionModel */

class ComputeSelectionBlockView extends Component {

  /** @type {ComputeSelectionModel} */
  #model
  /** @type {JQuery} */
  #node
  /** @type {Boolean} */
  #rendered
  /** @type {Boolean} */
  #active

  /**
   * 
   * @param {ComputeSelectionModel} model 
   */
  constructor(model) {
    super('warp-selector', App.ui.containers.mainSelection.secondRow.left.firstRow)
    this.#model = model
    this.#active = false
    this.#rendered = false
  }

  isActive() { return this.#active }

  isRendered() { return this.#rendered }

  activate() {
    if ( !this.isActive()) {
      this.render()
      this.#active = true
    }
    return this
  }

  deactivate() {
    if ( this.isRendered() && this.isActive()) {
      this.#node = this.#node.remove()
      this.#active = false
    }
    return this
  }

  render() {
    // console.log(this.#model.getGrid().is2D())
    this.#node = $(`		
      <div class="input-group" id="block-selection-container">
        <div class="input-group-prepend">
          <div class="input-group-text block-select-pre-text">&nbsp&nbspBlock</div>
        </div>
        <div class="input-group-prepend">
          <div class="input-group-text block-select-pre-text">x</div>
        </div>
        <input type='number' value="0" min="0" max="${this.#model.getGrid().size - 1}" step="1"/>
      </div>
    `)
    let ySel = $(`
      <div class="input-group-prepend">
        <span class="input-group-text block-select-pre-text">y</span>
      </div>
    `)

    ySel.appendTo(this.#node)

    let yInput = $(`<input type='number' value="0" min="0" max="${this.#model.getGrid().size - 1}" step="1"/>`)
    yInput.appendTo(this.#node)

    this.#rendered = true
    $(this.container.node).insertAt(0, this.#node)
  }


}

module.exports = ComputeSelectionBlockView