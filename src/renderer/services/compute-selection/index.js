/**
 * @module compute-selection
 * @category services
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
  ComputeSelectionMode : require('./ComputeSelectionMode')
}

/// ------------------- ///
///  Callback Typedefs  ///
/// ------------------- ///

/** @ignore @typedef {import("@renderer/models/cuda/CudaWarp")} CudaWarp */
/** @ignore @typedef {import("@renderer/models/cuda/CudaThread")} CudaThread */
/** @ignore @typedef {import("@renderer/models/cuda/CudaBlock")} CudaBlock */
/** @ignore @typedef {import("@renderer/services/compute-selection/ComputeSelectionMode")} ComputeSelectionMode */

/**
 * @callback ComputeSelectionOnBlockSelectCallback
 * @memberof module:compute-selection
 * @param {CudaBlock} block The selected block
 */

/**
 * @callback ComputeSelectionOnWarpSelectCallback
 * @memberof module:compute-selection
 * @param {CudaWarp} warp The selected warp
 */

/**
 * @callback ComputeSelectionOnThreadSelectCallback
 * @memberof module:compute-selection
 * @param {CudaThread} thread The selected thread
 */

/**
 * @callback ComputeSelectionOnUnitSelectCallback
 * @memberof module:compute-selection
 * @param {ComputeSelectionMode} mode The current mode
 * @param {CudaWarp|CudaThread} unit The selected unit (warp or thread)
 */