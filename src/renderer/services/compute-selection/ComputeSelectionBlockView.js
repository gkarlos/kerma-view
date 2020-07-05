const Component    = require('@renderer/ui/component/Component')
const EventEmitter = require('events').EventEmitter
const App          = require('@renderer/app')

/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelectionModel")} ComputeSelectionModel */

/**
 * @memberof module:compute-selection
 */
class ComputeSelectionBlockView extends Component {

  /** @type {ComputeSelectionModel} */
  #model
  /** @type {JQuery} */
  #node
  /** @type {JQuery} */
  #xInput
  /** @type {JQuery} */
  #yInput
  /** @type {Boolean} */
  #rendered
  /** @type {Boolean} */
  #active
  /** @type {Boolean} */
  #enabled

  /**
   * 
   * @param {ComputeSelectionModel} model 
   */
  constructor(model) {
    super('warp-selector', App.ui.containers.mainSelection.secondRow.left.firstRow)
    this.#model = model
    this.#active = false
    this.#rendered = false
    this.#enabled = false
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

  activate() {
    if ( !this.isActive()) {
      this.render()
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

  enable() {}

  disable() {}

  render() {
    if ( !this.isRendered()) {
      this.#node = $(`<div class="input-group col-8" id="block-selection-container"></div>`)

      let title = $(`
        <div class="input-group-prepend">
          <div class="input-group-text block-select-pre-text block-select-pre-text-title">&nbsp&nbspBlock</div>
        </div>`
      ).appendTo(this.#node)

      let yPre = $(`<div class="input-group-text block-select-pre-text"> &nbspy :</div>`).appendTo(title).hide()

      this.#yInput = 
        $(`<input id="block-select-y" type='number' value="0" min="0" size="4" max="${this.#model.getGrid().size - 1}" step="1"/>`).appendTo(this.#node).hide()

      let xSel = $(`
        <div class="input-group-prepend">
          <div class="input-group-text block-select-pre-text"> x :</div>
        </div>
      `).appendTo(this.#node).hide()

      this.#xInput = 
        $(`<input id="block-select-x" type='number' value="0" min="0" max="${this.#model.getGrid().size - 1}" step="1"/>`).appendTo(this.#node)
      
      $(`<div class="input-group-text block-select-pre-text block-select-pre-text-last"> 
          2D&nbsp&nbsp<input type="checkbox">
        </div>
      `).appendTo(this.#node)

      this.#rendered = true
    }

    $(this.container.node).insertAt(0, this.#node)

    if ( !this.isEnabled()) {
      this.disable()
    }
  }


}

module.exports = ComputeSelectionBlockView