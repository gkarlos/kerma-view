/** @ignore @typedef {import("@renderer/models/Kernel")} Kernel */
/** @ignore @typedef {import("@renderer/models/Idx")} Index */

const App = require('@renderer/app')
const Index = require("@renderer/models/Idx")
const { EventEmitter } = require("events")
const Events       = require('@renderer/services/compute-selection/Events')

/**
 * @memberof module:compute-selection
 */
class ComputeSelectionView {

  /** @type {boolean}      */ #rendered
  /** @type {EventEmitter} */ #Emitter
  /** @type {JQuery}       */ #WarpContainer
  /** @type {JQuery}       */ #WarpNode
  /** @type {Kernel}       */ #Kernel
  /** @type {Index}        */ #BlockIndex


  /** @type {JQuery}       */ #BlockContainer
  /** @type {JQuery}       */ #BlockNode
  /** @type {JQuery}       */ #BlockXInput
  /** @type {JQuery}       */ #BlockYInput

  constructor(kernel) {
    this.#BlockContainer = App.ui.containers.mainSelection.firstRow.right
    this.#WarpContainer = App.ui.containers.mainSelection.secondRow.right
    this.#Emitter = new EventEmitter()
    this.#Kernel = kernel
    this.#BlockIndex = new Index(0,0);
  }

  /** @type {Kernel} */
  get kernel() { return this.#Kernel }

  /** @type {Idx} */
  get blockSelection() { return this.#BlockIndex }

  enable() {
    if ( this.#rendered) {
      if ( this.#Kernel && this.#Kernel.launch.grid.x == 1)
        this.#BlockXInput.attr('disabled', 'disabled')
      else
        this.#BlockXInput.removeAttr('disabled')
      if ( this.#Kernel && this.#Kernel.launch.grid.y == 1)
        this.#BlockYInput.attr('disabled', 'disabled')
      else
        this.#BlockYInput.removeAttr('disabled')
    }
  }

  disable() {
    if ( this.#rendered) {
      this.#BlockXInput.attr('disabled')
      if ( this.#Kernel && this.#Kernel.launch.grid.y == 0)
        this.#BlockXInput.attr('disabled')
    }
  }


  /**
   * Register a callback to be invoked when the block selection changes
   * @param {ComputeSelectionOnBlockChangeCallback} callback
   * @returns {ComputeSelectionBlockView} this
   */
  onChange(callback) {
    if ( typeof(callback) === 'function')
      this.#Emitter.on(Events.BlockChange, callback)
    return this
  }

  _createBlockSelect() {

    let self = this

    function blockChangeHandler(input, min, max) {
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

    function blockChangeHandler() {
      let OldBlockIndex = self.#BlockIndex
      let NewBlockIndex = new Index( parseInt(BlockYInput[0].value), parseInt(BlockXInput[0].value))
      if ( !NewBlockIndex.equals(OldBlockIndex)) {
        self.#BlockIndex = NewBlockIndex
        self.#Emitter.emit(Events.BlockChange, OldBlockIndex, NewBlockIndex)
      }
    }

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

    function inputHandler(input, min, max) {
      return () => {
        if ( input.val().length === 0) {
          input.addClass('empty-input')
          input.tooltip('hide').tooltip('show')
        } else {
          input.removeClass('empty-input')
          input.tooltip('hide')
          let value = parseInt(BlockXInput.val())
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

    this.#BlockNode = $(`<div class="input-group col-8" id="block-selection-container"></div>`)
    let title = $(`
      <div class="input-group-prepend">
        <div class="input-group-text block-select-pre-text block-select-pre-text-title">&nbsp&nbspBlock</div>
      </div>
    `)

    let BlockYPre = $(`
      <div class="input-group-prepend">
        <div class="input-group-text block-select-pre-text"> &nbsp&nbspy :</div>
      </div>`)

    let BlockYInput = $(`
      <input id="block-select-y" type='number' value="0" min="0" max="${this.kernel.launch.grid.y - 1}" step="1"/>`)

    let BlockXPre = $(`
      <div class="input-group-prepend" id="block-select-x-pre">
        <div class="input-group-text block-select-pre-text" id="block-select-x-pre-text"> &nbsp&nbspx :</div>
      </div>
    `)

    let BlockXInput = $(`
      <input id="block-select-x" type='number' value="0" min="0" max="${this.kernel.launch.grid.x - 1}" step="1"/>
    `)

    title.appendTo(this.#BlockNode)
    BlockYPre.appendTo(this.#BlockNode)
    BlockYInput.appendTo(this.#BlockNode)
    BlockXPre.appendTo(this.#BlockNode)
    BlockXInput.appendTo(this.#BlockNode)
    this.#BlockXInput = BlockXInput;
    this.#BlockYInput = BlockYInput;

    $(`<div class="input-group-append"><div class="input-group-text block-select-pre-text"> &nbsp&nbsp&nbsp&nbsp </div></div>`).appendTo(this.#BlockNode)

    $(this.#BlockContainer.node).insertAt(1, this.#BlockNode)

    BlockXInput.tooltip(inputTooltip(BlockXInput, 0, self.#Kernel.launch.grid.x - 1))
    BlockYInput.tooltip(inputTooltip(BlockYInput, 0, self.#Kernel.launch.grid.y - 1))
    BlockXInput.on('input', inputHandler(BlockXInput, 0, self.#Kernel.launch.grid.x - 1))
        .on('blur', blurHandler(BlockXInput, () => self.#BlockIndex && self.#BlockIndex.x))
        .on('change', blockChangeHandler)
    BlockYInput.on('input', inputHandler(BlockYInput, 0, self.#Kernel.launch.grid.y - 1))
        .on('blur', blurHandler(BlockYInput, () => self.#BlockIndex && self.#BlockIndex.y))
        .on('change', blockChangeHandler)
    if ( this.#Kernel && this.#Kernel.launch.grid.x == 1) {
      this.#BlockXInput.attr('disabled', 'disabled')
    }
    if ( this.#Kernel && this.#Kernel.launch.grid.y == 1) {
      this.#BlockYInput.attr('disabled', 'disabled')
    }
  }

  _createWarpSelect() {
    this.#WarpNode = $(`
      <div>Warp Selector</div>
    `)
    $(this.#WarpContainer.node).insertAt(0, this.#WarpNode)
  }

  /**
   * @return ComputeSelectionView
   */
  render() {
    if ( !this.#rendered) {
      this._createBlockSelect();
      this._createWarpSelect();
      this.#rendered = true;
    }
    return this;
  }

  show() {
    if ( this.#rendered) {
      this.#BlockNode.show();
      this.#WarpNode.show();
    }
  }

  hide() {
    if ( this.#rendered) {
      this.#BlockNode.detach();
      this.#WarpNode.detach();
    }
  }
}

module.exports = ComputeSelectionView