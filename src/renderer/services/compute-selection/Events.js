/**
 * @name EventNames
 * @memberof module:compute-selection
 * @property {String} ModeChange="mode-change"
 * @property {String} BlockSelect
 * @property {String} UnitSelect
 * @property {String} WarpSelect
 * @property {String} ThreadSelect
 * @property {String} Enabled
 * @property {String} Disabled
 */
module.exports = {
  /** */
  ModeChange : "mode-change",
  /** */
  BlockChange : "block-change",
  /** */
  UnitSelect : "unit-select",
  /** */
  WarpSelect : "warp-select",
  /** */
  ThreadSelect : "thread-select",
  /** */
  Enabled : "enabled",
  /** */
  Disabled : "disabled",
  /** */
  Change : "change"
}

/**
 * Fires when the mode changes
 * @event module:compute-selection.ModeChange
 * @property {ComputeSelectionMode} newMode The new mode
 * @property {ComputeSelectionMode} oldMode The old mode
 */

/**
 * Fires when a block is selected
 * @event module:compute-selection.BlockSelect
 * @property {CudaBlock} block The selected block
 */

/**
 * Fires when a warp is selected
 * @event module:compute-selection.WarpSelect
 * @property {CudaWarp} warp The selected warp
 */

/**
 * Fires when a thread is selected
 * @event module:compute-selection.ThreadSelect
 * @property {CudaThread} thread The selected thread
 */

/**
 * Fires when either a thread or warp is selected
 * @event module:compute-selection.UnitSelect
 * @property {CudaThread|CudaWarp} unit The selected unit
 * @property {ComputeSelectionMode} mode The current selection mode (@see {module:compute-selection.ComputeSelectionMode})
 */