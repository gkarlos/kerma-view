/**
 * @module compute-selection
 * @category Renderer
 * @subcategory services
 */
module.exports = {
  ComputeSelectionBlockView : require('./ComputeSelectionBlockView'),
  ComputeSelectionView : require('./ComputeSelectionView'),
  ComputeSelectionWarpView : require('./ComputeSelectionWarpView'),
  ComputeSelectionThreadView : require('./ComputeSelectionThreadView'),
  ComputeSelectionService : require('./ComputeSelectionService'),
  Events : require('./Events'),
  ComputeSelection : require('./ComputeSelection'),
  ComputeSelectionModel : require('./ComputeSelectionModel'),
  ComputeSelectionMode : require('./ComputeSelectionMode'),
  ComputeSelectionModeView : require('./ComputeSelectionModeView')
}

/// ------------------- ///
///  Callback Typedefs  ///
/// ------------------- ///

/** @ignore @typedef {import("@renderer/models/cuda/CuWarp")} CuWarp */
/** @ignore @typedef {import("@renderer/models/cuda/CuThread")} CuThread */
/** @ignore @typedef {import("@renderer/models/cuda/CuBlock")} CuBlock */
/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelectionMode")} ComputeSelectionMode */

/**
 * @callback ComputeSelectionOnBlockChangeCallback
 * @param {CuBlock} oldBlock The old block
 * @param {CuBlock} newBlock The new block
 * @memberof module:compute-selection
 */

/**
 * @callback ComputeSelectionOnWarpSelectCallback
 * @param {CuWarp} warp The selected warp
 * @memberof module:compute-selection
 */

/**
 * @callback ComputeSelectionOnThreadSelectCallback
 * @param {CuThread} thread The selected thread
 * @memberof module:compute-selection
 */

/**
 * @callback ComputeSelectionOnUnitSelectCallback
 * @param {ComputeSelectionMode} mode The current mode
 * @param {CuWarp|CuThread} unit The selected unit (warp or thread)
 * @memberof module:compute-selection
 */

 /**
  * @callback ComputeSelectionOnModeChangeCallback
  * @param {ComputeSelectionMode} oldMode
  * @param {ComputeSelectionMode} newMode
  * @memberof module:compute-selection
  */

