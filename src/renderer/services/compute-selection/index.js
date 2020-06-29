/// ------------------- ///
///       Events        ///
/// ------------------- ///

// /** 
//  * @static
//  
// const Events = {
//   /** */
//   ModeChange : "mode-change",
//   /** */
//   BlockSelect : "block-select",
//   /** */
//   UnitSelect : "unit-select",
//   /** */
//   WarpSelect : "warp-select",
//   /** */
//   ThreadSelect : "thread-select",
//   /** */
//   Enabled : "enabled",
//   /** */
//   Disabled : "disabled"
// }

 /**
 * @module compute-selection
 * @category services
 * @property {module:compute-selection~ComputeSelectionView} ComputeSelectionView
 * @property {module:compute-selection~ComputeSelectionService} ComputeSelectionService
 * @property {module:compute-selection.ComputeSelection} ComputeSelection
 * @property {module:compute-selection.ComputeSelectionModel} ComputeSelectionModel
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