const Component    = require('@renderer/ui/component/Component')
const EventEmitter = require('events').EventEmitter
const Events       = require('@renderer/services/compute-selection/Events')
const App          = require('@renderer/app')
const ComputeSelectionMode = require('@renderer/services/compute-selection/ComputeSelectionMode')
const { capitalizeFirst } = require('@renderer/util/string')

/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelectionModel")} ComputeSelectionModel */

/**
 * @memberof module:compute-selection
 */
class ComputeSelectionModeView extends Component {
  /** @type {ComputeSelectionModel} */ #model
  /** @type {JQuery}  */               #node
  /** @type {Boolean} */               #rendered
  /** @type {Boolean} */               #active
  /** @type {Boolean} */               #enabled
  /** @type {Boolean} */               #disposed
  /** @type {Selectize.IApi} */        #viewImpl
  /** @type {EventEmitter}   */        #emitter


  /**
   * @param {ComputeSelectionModel} model 
   */
  constructor(model) {
    super('compute-mode-selector', App.ui.containers.mainSelection.secondRow.left.firstRow)
    this.#model    = model
    this.#active   = false
    this.#rendered = false
    this.#disposed = false
    this.#enabled  = false
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
   * @returns {ComputeSelectionModeView} this
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
   * @returns {ComputeSelectionModeView} this
   */
  deactivate() {
    if ( this.isRendered() && this.isActive()) {
      this.#node = this.#node.detach()
      this.#active = false
    }
    return this
  }

  /**
   * Enable the view. i.e allow the user to interact with it
   * @returns {ComputeSelectionModeView} this
   */
  enable() { 
    if ( !this.isDisposed())
      this.#viewImpl.enable()
    return this
  }

  /**
   * Disable the view. i.e prevent the user from interacting with it
   * @returns {ComputeSelectionModeView} this
   */
  disable() { 
    if ( !this.isDisposed())
      this.#viewImpl.disable()
    return this
  }

  /**
   * Dispose the view. A disposed view cannot be reused
   * @returns {ComputeSelectionModeView} this
   */
  dispose() {
    if ( !this.isDisposed()) {
      if ( this.isRendered()) {
        this.#node.remove()
        this.#viewImpl.destroy()
        this.#emitter.removeAllListeners()

        this.#node     = undefined
        this.#viewImpl = undefined
        this.#emitter  = undefined
      }
      this.#disposed = true
    }
    return this
  }

  /**
   * Render the view
   * @returns {ComputeSelectionModeView} this
   */
  _render() {
    if ( this.isDisposed())
      return this

    if ( !this.isRendered()) {
        this.#node = $(`
        <div class="input-group select-group" id="compute-mode-view">
          <div class="input-group-prepend">
            <div class="input-group-text mode-select-pre-text">Mode</div>
          </div>
        </div>
      `)

      this.#viewImpl = $(`<select id="compute-mode-select"></select>`)
        .appendTo(this.#node)
        .selectize({
        valueField: 'name',
        create: false,
        dropdownParent: 'body',
        maxItems: 1,
        render : {
          item : (mode, escape) => {
            return mode.equals(ComputeSelectionMode.Thread) ? 
              `<div class="kernel-selection-selected-item">
                <span class="kernel-name">
                  <i class="fas fa-ruler-horizontal"></i>&nbsp${capitalizeFirst(mode.name)}
                <span>
              </div>`
              : 
              `<div class="kernel-selection-selected-item">
                <span class="kernel-name">
                  <i class="fas fa-stream"></i>&nbsp&nbsp${capitalizeFirst(mode.name)}
                <span>
              </div>`
          },
          option: (mode, escape) => {
            return `<div class="compute-mode-view-option">${capitalizeFirst(mode.name)}</div>`
          }
        }
      })[0].selectize

      if ( !this.#viewImpl) throw new Error("Failed to create ComputeSelectionModeView")

      this.#viewImpl.addOption(ComputeSelectionMode.Thread)
      this.#viewImpl.addOption(ComputeSelectionMode.Warp)
      this.#viewImpl.setValue(this.#model.mode.name)

      
      let self = this;
      
      this.#viewImpl.on('change', (value) => {
        if ( value.length > 0) {
          let oldMode = this.#model.mode
          let newMode = ComputeSelectionMode.fromString(value)
          this.#model.setMode(newMode)
          if ( !oldMode.equals(newMode))
            this.#emitter.emit(Events.ModeChange, oldMode, newMode)
        }
      })

      this.#rendered = true
    }

    $(this.container.node).insertAt(1, this.#node)

    if ( !this.isEnabled()) {
      this.disable()
    }

  }

  /**
   * Register a callback to be invoked when the mode is changed
   * @param {ComputeSelectionOnModeChangeCallback} callback 
   * @returns {ComputeSelectionModeView}
   */
  onChange(callback) {
    this.#emitter.on(Events.ModeChange, callback)
    return this
  }

}

module.exports = ComputeSelectionModeView