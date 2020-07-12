const Component    = require('@renderer/ui/component/Component')
const EventEmitter = require('events').EventEmitter
const Events       = require('@renderer/services/compute-selection/Events')
const App          = require('@renderer/app')
const { CudaIndex, CudaBlock } = require('@renderer/models/cuda')

/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelectionModel")} ComputeSelectionModel */
/** @ignore @typedef {import("@renderer/services/compute-selection").ComputeSelectionOnBlockChangeCallback} ComputeSelectionOnBlockChangeCallback*/

/**
 * @memberof module:compute-selection
 */
class ComputeSelectionBlockView extends Component {

  /** @type {ComputeSelectionModel} */ #model
  /** @type {JQuery}                */ #node
  /** @type {JQuery}                */ #xInput
  /** @type {JQuery}                */ #yInput
  /** @type {Boolean}               */ #active
  /** @type {Boolean}               */ #enabled
  /** @type {Boolean}               */ #rendered
  /** @type {Boolean}               */ #disposed
  /** @type {EventEmitter}          */ #emitter

  /**
   * 
   * @param {ComputeSelectionModel} model 
   */
  constructor(model) {
    super('warp-selector', App.ui.containers.mainSelection.secondRow.left.firstRow)
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
   * @returns {ComputeSelectionBlockView} this
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
   * @returns {ComputeSelectionBlockView} this
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
   * @returns {ComputeSelectionBlockView} this
   */
  enable() {
    if ( !this.isDisposed()) {
      if ( this.isRendered()) {
        this.#xInput.removeAttr('disabled')
        this.#yInput.removeAttr('disabled')
        this.#enabled = true
      }
    }
    return this
  }

  /**
   * Prevent the user from interacting with the view
   * If the view is activate it immediately becomes disabled. If it is inactive
   * it will be disabled the next time it is activated.
   * No-op if the view is disposed
   * @returns {ComputeSelectionBlockView} this
   */
  disable() {
    if ( !this.isDisposed()) {
      if ( this.isRendered()) {
        this.#xInput.attr('disabled', 'disabled')
        this.#yInput.attr('disabled', 'disabled')
        this.#enabled = false
      }
    }
    return this
  }

  /**
   * Dispose the view. A disposed view cannot be reactivated
   * @returns {ComputeSelectionBlockView} this
   */
  dispose() {
    if ( !this.isDisposed()) {
      if ( this.isRendered()) {
        this.#node.remove()
        this.#emitter.removeAllListeners()
        this.#node    = undefined
        this.#xInput  = undefined
        this.#yInput  = undefined
        this.#emitter = undefined
      }
      this.#disposed = true;
    }
    return this
  }

  _render() {
    if ( !this.isRendered()) {
      this.#node = $(`<div class="input-group col-8" id="block-selection-container"></div>`)

      $(this.container.node).insertAt(0, this.#node)

      let title = 
        $(`
          <div class="input-group-prepend">
            <div class="input-group-text block-select-pre-text block-select-pre-text-title">&nbsp&nbspBlock</div>
          </div>
        `)

      let yPre = 
        $(`
          <div class="input-group-prepend">
            <div class="input-group-text block-select-pre-text"> &nbsp&nbspy :</div>
          </div>
        `)

      let yInput = 
        $(`
          <input id="block-select-y" type='number' value="0" min="0" size="5" max="${this.#model.getGrid().dim.y - 1}" step="1"/>
        `)

      let xPre = 
        $(`
          <div class="input-group-prepend" id="block-select-x-pre">
            <div class="input-group-text block-select-pre-text" id="block-select-x-pre-text"> &nbsp&nbspx :</div>
          </div>
        `)

      let xInput = 
        $(`
          <input id="block-select-x" maxlength="5" type='number' value="0" min="0" max="${this.#model.getGrid().size - 1}" step="1"/>
        `)

      let checkbox2DContainer = 
        $(`
          <div class="input-group-text block-select-pre-text block-select-pre-text-last"> 
            2D&nbsp&nbsp
          </div>
        `)

      let checkbox2D 
        = $(`<input type="checkbox">`).appendTo(checkbox2DContainer)


      title
        .appendTo(this.#node)
      yPre
        .appendTo(this.#node).hide()
      yInput
        .appendTo(this.#node).hide()
      xPre
        .appendTo(this.#node).hide()
      xInput
        .appendTo(this.#node)
      checkbox2DContainer
        .appendTo(this.#node)

      

      function inputTooltip(input, min, max) {
        return {
          title: () => {
            if ( input.hasClass('empty-input'))
              return '<i class="fa fa-exclamation-triangle"></i> Cannot be empty'
            else if ( input.hasClass('invalid-input'))
              return `<i class="fa fa-exclamation-triangle"></i> Select a value in [${min}, ${max}]`
            else
              return `[${min}, ${max}]`
          },
          html: true,
          trigger : 'hover'
        }
      }

      xInput.tooltip(inputTooltip(xInput,this.#model.grid.dim.minx, this.#model.grid.dim.maxx))
      yInput.tooltip(inputTooltip(yInput,this.#model.grid.dim.miny, this.#model.grid.dim.maxy))
      
      let self = this;

      function blockChangeHandler() {
        let oldBlock = self.#model.getBlockSelection()
        self.#model.selectBlockByIdx(new CudaIndex(parseInt(yInput[0].value), parseInt(xInput[0].value)))
        let newBlock = self.#model.getBlockSelection()
        if ( !oldBlock.equals(newBlock))
          self.#emitter.emit(Events.BlockChange, oldBlock, newBlock)
      }

      function inputHandler(input, min, max) {
        return () => {
          if ( input.val().length === 0) {
            input.addClass('empty-input')
            input.tooltip('hide').tooltip('show')
          } else {
            input.removeClass('empty-input')
            input.tooltip('hide')
            let value = parseInt(xInput.val())
            console.log(value)
            if ( value < min || value > max) {
              input.addClass('invalid-input')
              input.tooltip('hide').tooltip('show')
            } else {
              input.removeClass('invalid-input')
              input.tooltip('hide')
            }
          }
        }
      }

      function blurHandler(input, oldVal) {
        return () => ( input.hasClass('empty-input') || input.hasClass('invalid-input')) 
           ? input.val(oldVal()) && input.trigger('input')
           : blockChangeHandler()
      }
      
      xInput.on('input', inputHandler(xInput, self.#model.grid.dim.minx, self.#model.grid.dim.maxx))
            .on('blur', blurHandler(xInput, () => self.#model.getBlockSelection().getIndex().x))
            .on('change', blockChangeHandler)
      yInput.on('input', inputHandler(yInput, self.#model.grid.dim.mixy, self.#model.grid.dim.maxy))
            .on('blur', blurHandler(yInput, () => self.#model.getBlockSelection().getIndex().y))
            .on('change', blockChangeHandler)

      checkbox2D
        .change(event => {
          if ( event.target.checked) {
            xInput.attr('max', this.#model.grid.dim.x - 1)
            if ( this.#model.grid.is1D()) {
              this.#yInput.attr('disabled', true)
              this.#yInput.tooltip({title: "Grid is 1D", trigger: 'click'})
            }
            yPre.show()
            yInput.show()
            xPre.show()
          } else {
            yInput.val(0)
            blockChangeHandler()
            yPre.hide()
            yInput.hide()
            xPre.hide()
          }
        })

      this.#xInput = xInput
      this.#yInput = yInput
      this.#rendered = true
    }
    
    $(this.container.node).insertAt(0, this.#node)

    if ( !this.isEnabled()) {
      this.disable()
    }
  }

  /**
   * Register a callback to be invoked when the block selection changes
   * @param {ComputeSelectionOnBlockChangeCallback} callback 
   * @returns {ComputeSelectionBlockView} this
   */
  onChange(callback) {
    if ( typeof(callback) === 'function')
      this.#emitter.on(Events.BlockChange, callback)
    return this
  }
}

module.exports = ComputeSelectionBlockView