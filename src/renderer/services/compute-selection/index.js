/**
 * @module compute-unit-selection
 * @category services
 * @property {module:compute-unit-selection.GridInfoView} GridInfoView
 * @property {module:compute-unit-selection.BlockInfoView} BlockInfoView
 * @property {module:compute-unit-selection.ComputeSelection} ComputeSelection
 * 
 * @property {module:compute-unit-selection.ComputeUnitSelectionView} ComputeUnitSelectionView
 * @property {module:compute-unit-selection.ComputeUnitSelectionService} ComputeUnitSelectionService
 */
module.exports = {
  GridInfoView : require('./GridInfoView'),
  BlockInfoView : require('./BlockInfoView'),
  ComputeSelection : require('./ComputeSelection'),
  ComputeUnitSelectionView : require('./ComputeUnitSelectionView'),
  ComputeUnitSelectionService : require('./ComputeUnitSelectionService'),

  ComputeSelectionModel : require('./ComputeSelectionModel'),
  ComputeSelectionMode : require('./ComputeSelectionMode')
}