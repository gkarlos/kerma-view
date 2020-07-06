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
  /** @type {EventEmitter} */
  #emitter

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
    this.#emitter = new EventEmitter()
    this.onChange( (odlblock, newblock) => console.log("old:",odlblock.toString(),"new:",newblock.toString()))
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

  enable() {
    if ( this.isRendered()) {
      this.#xInput.removeAttr('disabled')
      this.#yInput.removeAttr('disabled')
      this.#enabled = true
    }
    return this
  }

  disable() {
    if ( this.isRendered()) {
      this.#xInput.attr('disabled', 'disabled')
      this.#yInput.attr('disabled', 'disabled')
      this.#enabled = false
    }
    return this
  }


  _validateBlockSelection(x,y) {

  }

  render() {
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
          <input id="block-select-x" type='number' value="0" min="0" max="${this.#model.getGrid().size - 1}" step="1"/>
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

      let self = this;

      let blockChangeHandler = () => {
        console.log(yInput[0].value, xInput[0].value)
        let oldBlock = this.#model.getBlockSelection()
        this.#model.selectBlock(new CudaIndex(parseInt(yInput[0].value), parseInt(xInput[0].value)))
        let newBlock = this.#model.getBlockSelection()
        if ( !oldBlock.eql(newBlock))
          this.#emitter.emit(Events.BlockChange, oldBlock, newBlock)
      }

      xInput.change( event => {
        if ( xInput.val().length == 0)
          xInput.val(0)
        let yValue = parseInt(yInput[0].value) || 0
        let xValue = parseInt(event.target.value)
        blockChangeHandler(yValue, xValue)
      })

      yInput.change( event => {
        console.log(xInput)
        if ( yInput.val().length == 0)
          yInput.val(0)
        let yValue = parseInt(event.target.value)
        let xValue = parseInt(xInput[0].value) || 0
        blockChangeHandler(yValue, xValue)
      })

      checkbox2D
        .change(event => {
          if ( event.target.checked) {
            xInput.attr('max', this.#model.grid.dim.x - 1)
            if ( this.#model.grid.is1D())
              this.#yInput.attr('disabled', true)
            yPre.show()
            yInput.show()
            xPre.show()
          } else {
            yInput.val(0)
            blockChangeHandler(0, )
            yPre.hide()
            yInput.hide()
            xPre.hide()
          }
        })

      

      let xInputTooltip = { title: () => `[${self.#model.grid.dim.minx}, ${self.#model.grid.dim.maxx}]`, trigger : 'hover'}
      let yInputTooltip = { title: () => this.#model.grid.is1D()? 'Grid is 1D' : `[${self.#model.grid.dim.miny}, ${self.#model.grid.dim.maxy}]`, trigger : 'hover'}


      xInput.tooltip(xInputTooltip)
      yInput.tooltip(yInputTooltip)
      
      this.#xInput = xInput
      this.#yInput = yInput
      this.#rendered = true
    } else {
      $(this.container.node).insertAt(0, this.#node)
    }

    if ( !this.isEnabled()) {
      this.disable()
    }
  }

  /**
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