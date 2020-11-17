/** @ignore @typedef {import("@renderer/models/Kernel")} Kernel */
/** @ignore @typedef {import("@renderer/models/Idx")} Index */

/** @typedef {function(Index, number, number) : void} ComputeViewOnChangeCallback */

const App = require('@renderer/app')
const Index = require("@renderer/models/Idx")
const { EventEmitter } = require("events")
const Events = require('@renderer/services/compute-selection/Events')

/**
 * @memberof module:compute-selection
 */
class ComputeSelectionView {

  /** @type {boolean}      */ #rendered
  /** @type {EventEmitter} */ #Emitter
  /** @type {Kernel}       */ #Kernel

  /** @type {JQuery}       */ #BlockContainer
  /** @type {JQuery}       */ #BlockNode
  /** @type {JQuery}       */ #BlockXInput
  /** @type {JQuery}       */ #BlockYInput

  /** @type {JQuery}       */ #WarpContainer
  /** @type {JQuery}       */ #WarpNode
  /** @type {JQuery}       */ #WarpCount

  /** @type {JQuery}       */ #SelectedWarpNode
  /** @type {JQuery}       */ #SelectedLaneNode

  /** @type {Index}        */ #BlockIndex
  /** @type {number}       */ #WarpIndex
  /** @type {number}       */ #LaneIndex


  constructor(kernel) {
    this.#BlockContainer = App.ui.containers.mainSelection.firstRow.right
    this.#WarpContainer = App.ui.containers.mainSelection.secondRow.right
    this.#Emitter = new EventEmitter()
    this.#Emitter.on('compute-change', () =>
      App.emit(App.Events.INPUT_COMPUTE_SELECTED, this.blockSelection, this.warpSelection, this.laneSelection))
    this.#Kernel = kernel
    this.#BlockIndex = new Index(0, 0);
    this.#WarpCount = Math.floor(this.#Kernel.launch.block.size / 32) + (this.#Kernel.launch.block.size % 32 > 0 ? 1 : 0)
  }

  /** @type {Kernel} */
  get kernel() { return this.#Kernel }

  /** @type {Index} */
  get blockSelection() { return this.#BlockIndex; }

  /** @type {number} */
  get warpSelection() { return this.#WarpIndex; }

  /** @type {number} */
  get laneSelection() { return this.#LaneIndex; }

  enable() {
    if (this.#rendered) {
      if (this.#Kernel && this.#Kernel.launch.grid.x == 1)
        this.#BlockXInput.attr('disabled', 'disabled')
      else
        this.#BlockXInput.removeAttr('disabled')
      if (this.#Kernel && this.#Kernel.launch.grid.y == 1)
        this.#BlockYInput.attr('disabled', 'disabled')
      else
        this.#BlockYInput.removeAttr('disabled')
    }
  }

  disable() {
    if (this.#rendered) {
      this.#BlockXInput.attr('disabled')
      if (this.#Kernel && this.#Kernel.launch.grid.y == 0)
        this.#BlockXInput.attr('disabled')
    }
  }


  /**
   * Register a callback to be invoked when the block selection changes
   * @param {ComputeViewOnChangeCallback} callback
   * @returns {ComputeSelectionView} this
   */
  onChange(callback) {
    console.log("asdasdasd")
    if (typeof (callback) === 'function')
      this.#Emitter.on('compute-change', callback)
    return this
  }

  _createBlockSelect() {

    let self = this

    function blockInputTooltip(input, min, max) {
      return {
        title: () => {
          if (input.hasClass('empty-input'))
            return '<i class="fa fa-exclamation-triangle"></i> Cannot be empty'
          else if (input.hasClass('invalid-input'))
            return `<i class="fa fa-exclamation-triangle"></i> Select a value in [${min}, ${max}]`
          else
            return `[${min}, ${max}]`
        },
        html: true,
        trigger: 'hover'
      }
    }

    function blockChangeHandler() {
      let OldBlockIndex = self.#BlockIndex
      let NewBlockIndex = new Index(parseInt(BlockYInput[0].value), parseInt(BlockXInput[0].value))
      if (!NewBlockIndex.equals(OldBlockIndex)) {
        self.#BlockIndex = NewBlockIndex
        self.#Emitter.emit('compute-change', self.#BlockIndex, self.#WarpIndex, self.#LaneIndex)
      }
    }

    function blockInputHandler(input, min, max) {
      return () => {
        if (input.val().length === 0) {
          input.addClass('empty-input')
          input.tooltip('hide').tooltip('show')
        } else {
          input.removeClass('empty-input')
          input.tooltip('hide')
          let value = parseInt(BlockXInput.val())
          if (value < min || value > max) {
            input.addClass('invalid-input')
            input.tooltip('hide').tooltip('show')
          } else {
            input.removeClass('invalid-input')
            input.tooltip('hide')
          }
        }
      }
    }

    function blockBlurHandler(input, oldVal) {
      return () => (input.hasClass('empty-input') || input.hasClass('invalid-input'))
        ? input.val(oldVal()) && input.trigger('input')
        : blockChangeHandler()
    }

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

    this.#BlockNode = $(`<div class="input-group col-8" id="block-selection-container"></div>`)

    title.appendTo(this.#BlockNode)
    BlockYPre.appendTo(this.#BlockNode)
    BlockYInput.appendTo(this.#BlockNode)
    BlockXPre.appendTo(this.#BlockNode)
    BlockXInput.appendTo(this.#BlockNode)
    this.#BlockXInput = BlockXInput;
    this.#BlockYInput = BlockYInput;

    $(`<div class="input-group-append"><div class="input-group-text block-select-pre-text"> &nbsp&nbsp&nbsp&nbsp </div></div>`).appendTo(this.#BlockNode)

    $(this.#BlockContainer.node).insertAt(1, this.#BlockNode)

    BlockXInput.tooltip(blockInputTooltip(BlockXInput, 0, self.#Kernel.launch.grid.x - 1))
    BlockYInput.tooltip(blockInputTooltip(BlockYInput, 0, self.#Kernel.launch.grid.y - 1))
    BlockXInput.on('input', blockInputHandler(BlockXInput, 0, self.#Kernel.launch.grid.x - 1))
      .on('blur', blockBlurHandler(BlockXInput, () => self.#BlockIndex && self.#BlockIndex.x))
      .on('change', blockChangeHandler)
    BlockYInput.on('input', blockInputHandler(BlockYInput, 0, self.#Kernel.launch.grid.y - 1))
      .on('blur', blockBlurHandler(BlockYInput, () => self.#BlockIndex && self.#BlockIndex.y))
      .on('change', blockChangeHandler)
    if (this.#Kernel && this.#Kernel.launch.grid.x == 1)
      this.#BlockXInput.attr('disabled', 'disabled')
    if (this.#Kernel && this.#Kernel.launch.grid.y == 1)
      this.#BlockYInput.attr('disabled', 'disabled')
  }

  _createWarpSelect() {
    let self = this

    function clearSelection() {
      self.#SelectedWarpNode && self.#SelectedWarpNode.removeClass("selected-warp")
      self.#SelectedWarpNode = undefined
      if (self.#SelectedLaneNode) {
        self.#SelectedLaneNode.removeClass("selected-lane")
        self.#SelectedLaneNode.html("");
        self.#SelectedLaneNode = undefined
      }
    }

    /**
     * Render a thread in a warp
     * @param {number} warp_id
     * @param {number} lane_id
     */
    function renderLane(warp, lane, unusable = false) {
      let thread = $(`<div class="thread ${unusable ? 'unusable' : 'usable'}" data-lane-id=${lane}>${unusable ? '<i class="fas fa-times"></i>' : ''}</div>`)

      if (!unusable)
        thread.popover({
          placement: 'auto',
          trigger: 'manual',
          container: 'body',
          html: true,
          content: () => unusable ?
            `<div>Unusable lane</div>`
            :
            `
            <div>
              <span class="key">${Index.delinearize(warp * 32 + lane, self.#Kernel.launch.block)}</span>
              <span class="value"> / ${warp * 32 + lane}</span>
            </div>
            `
        })

      // <span class="key">glob:</span>
      // <span class="value">${
      //   this.#Model.
      //   this.#model.getBlockSelection().getFirstGlobalLinearThreadIdx() + (warp.getIndex() * CuWarp.Size) + lane
      // }

      $(thread).on('mouseenter', () => thread.popover("show"))
      $(thread).on('mouseleave', () => thread.popover("hide"))
      $(thread).on('click', (e) => {
        if (unusable) return;
        clearSelection();
        self.#SelectedLaneNode = thread
        self.#SelectedLaneNode.addClass("selected-lane")
        self.#LaneIndex = lane
        self.#SelectedLaneNode.html(`<span class="selected-lane-id">${lane}</span>`)
        self.#SelectedWarpNode = self.#SelectedLaneNode.parent().parent().parent()
        self.#SelectedWarpNode.addClass("selected-warp")
        self.#WarpIndex = self.#SelectedWarpNode.attr('data-warp-id');
        self.#Emitter.emit('compute-change', self.#BlockIndex, self.#WarpIndex, self.#LaneIndex)
      })

      // if ( !unusable)
      //   $(thread).click({thread: new CuThread(this.#model.getBlockSelection(), warp.getFirstThreadIndex() + lane)}, (event) => {
      //     if ( !this.#model.hasThreadSelected() || !(this.#model.getThreadSelection().equals(event.data.thread))) {
      //       self.#selected && self.#selected.removeClass("thread-selector-item-selected")
      //       self.#selected = thread
      //       self.#selected.addClass("thread-selector-item-selected")
      //       self.#model.selectThread(event.data.thread)
      //       self.#emitter.emit(Events.ThreadSelect, event.data.thread)
      //     }
      //   })
      return thread
    }


    function renderWarp(warp) {
      let warpview = $(`<div class="list-group-item thread-selector-item" data-warp-id=${warp}></div>`)
      let firstRow = $(`<div class="first-row"></div>`).appendTo(warpview)
      let secondRow = $(`<div class="second-row"></div>`).appendTo(warpview)

      let badge = $(`
        <p class="badge badge-secondary thread-view-warp-index">
          Warp ${warp}${warp < 10 ? "&nbsp&nbsp" : ""}
        </p>
      `).appendTo(firstRow)

      let halfWarp0 = $(`<div class="halfwarp"></div>`)
      let halfWarp1 = $(`<div class="halfwarp"></div>`)

      halfWarp0.append($(`<div></div>`))
      halfWarp1.append($(`<div></div>`))
      for (let lane = 0; lane < 32; ++lane)
        if (lane < 16)
          halfWarp0.append(renderLane(warp, lane, (warp * 32 + lane) >= self.#Kernel.launch.block.size))
        else
          halfWarp1.append(renderLane(warp, lane, (warp * 32 + lane) >= self.#Kernel.launch.block.size))

      // firstRow.append(halfWarp0)
      secondRow.append(halfWarp0).append(halfWarp1)


      warpview.on('click', (e) => {
        // if the click is on a child bail
        if (e.target !== e.currentTarget) return;

        if (self.#SelectedWarpNode != warpview) {
          // select only if the selected is not us or
          // there is no selection at all
          clearSelection();
          warpview.addClass("selected-warp")
          self.#SelectedWarpNode = warpview;
          self.#WarpIndex = e.target.getAttribute('data-warp-id');

          // since we changed warp and the click was not on a
          // thread (otherwise this handler wouldn't be called),
          // set the thread to 0
          self.#SelectedLaneNode = halfWarp0.children('div').eq(1)
          self.#SelectedLaneNode.addClass("selected-lane")
          self.#LaneIndex = 0
          self.#SelectedLaneNode.html(`<span class="selected-lane-id">${self.#LaneIndex}</span>`)
          self.#Emitter.emit('compute-change', self.#BlockIndex, self.#WarpIndex, self.#LaneIndex)
        }
      })

      return warpview
    }

    this.#WarpNode = $(`<div id="thread-selector" class="list-group" data-simplebar></div>`)
    for (let i = 0; i < this.#WarpCount; ++i)
      this.#WarpNode.append(renderWarp(i))

    $(this.#WarpContainer.node).insertAt(0, this.#WarpNode)
  }

  /**
   * @return ComputeSelectionView
   */
  render() {
    if (!this.#rendered) {
      this._createBlockSelect();
      this._createWarpSelect();
      this.#rendered = true;
    }
    return this;
  }

  show() {
    if (this.#rendered) {
      this.#BlockNode.show();
      this.#WarpNode.show();
    }
  }

  hide() {
    if (this.#rendered) {
      this.#BlockNode.detach();
      this.#WarpNode.detach();
    }
  }
}

module.exports = ComputeSelectionView