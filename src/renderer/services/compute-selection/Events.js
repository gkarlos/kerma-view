/**
 * @property {String} ModeChange
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
  BlockSelect : "block-select",
  /** */
  UnitSelect : "unit-select",
  /** */
  WarpSelect : "warp-select",
  /** */
  ThreadSelect : "thread-select",
  /** */
  Enabled : "enabled",
  /** */
  Disabled : "disabled"
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

/// ------------------- ///
///  Callback Typedefs  ///
/// ------------------- ///

/** @ignore @typedef {import("@renderer/models/cuda/CudaWarp")} CudaWarp */
/** @ignore @typedef {import("@renderer/models/cuda/CudaThread")} CudaThread */

/**
 * @callback ComputeSelectionOnBlockSelectCallback
 * @memberof module:compute-selection~ComputeSelection
 * @param {CudaWarp} block The selected block
 */

/**
 * @callback ComputeSelectionOnWarpSelectCallback
 * @memberof module:compute-selection~ComputeSelection
 * @param {CudaWarp} warp The selected warp
 */

/**
 * @callback ComputeSelectionOnThreadSelectCallback
 * @memberof module:compute-selection~ComputeSelection
 * @param {CudaThread} thread The selected thread
 */

/**
 * @callback ComputeSelectionOnUnitSelectCallback
 * @memberof module:compute-selection~ComputeSelection
 * @param {CudaWarp|CudaThread} unit The selected unit (warp or thread)
 */