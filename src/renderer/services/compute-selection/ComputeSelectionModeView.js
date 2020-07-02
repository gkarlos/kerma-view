const Component = require('@renderer/ui/component/Component')
const EventEmitter = require('events').EventEmitter
const App = require('@renderer/app')

/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelectionModel")} ComputeSelectionModel */

class ComputeSelectionModeView extends Component {
  /** @type {ComputeSelectionModel} */ #model
  /** @type {JQuery}  */               #node
  /** @type {Boolean} */               #rendered
  /** @type {Boolean} */               #active
  /** @type {Boolean} */               #enabled
  /** @type {Selectize.IApi} */        #viewImpl

  /**
   * 
   * @param {*} model 
   */
  constructor(model) {
    super('compute-mode-selector', App.ui.containers.mainSelection.secondRow.left.firstRow)
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

  disable() {
    this.#viewImpl.disable()
  }

  enable() { 
    this.#viewImpl.enable()
  }

  deactivate() {
    if ( this.isRendered() && this.isActive()) {
      this.#viewImpl.destroy()
      this.#node = this.#node.remove()
      this.#active = false
    }
    return this
  }

  render() {
    this.#node = $(`
      <div class="input-group select-group" id="compute-mode-view">
        <div class="input-group-prepend">
          <div class="input-group-text mode-select-pre-text">Mode</div>
        </div>
      </div>
    `)

    $(this.container.node).insertAt(1, this.#node)

      // <option value="thread">Thread</option>
      // <option value="warp">Warp</option>

    this.#viewImpl = $(`<select id="compute-mode-select"></select>`)
      .appendTo(this.#node)
      .selectize({
      valueField: 'value',
      create: false,
      dropdownParent: 'body',
      maxItems: 1,
      render : {
        item : (mode, escape) => {
          return mode.value == "Thread" ? 
            `<div class="kernel-selection-selected-item">
              <span class="kernel-name">
                <i class="fas fa-ruler-horizontal"></i>&nbsp${mode.value}
              <span>
            </div>`
            : 
            `<div class="kernel-selection-selected-item">
              <span class="kernel-name">
                <i class="fas fa-stream"></i>&nbsp&nbsp${mode.value}
              <span>
            </div>`
        },
        option: (mode, escape) => {
          return `<div class="compute-mode-view-option">${mode.value}</div>`
        }
      }
    })[0].selectize

    this.#viewImpl.addOption({value: "Warp"})
    this.#viewImpl.addOption({value: "Thread"})
    this.#viewImpl.setValue("Thread")
    this.#rendered = true
  }
}

module.exports = ComputeSelectionModeView