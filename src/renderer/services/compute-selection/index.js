/**
 * @module compute-selection
 * @category services
 * @property {module:compute-selection~GridInfoView} GridInfoView
 * @property {module:compute-selection~BlockInfoView} BlockInfoView
 * @property {module:compute-selection~ComputeSelectionView} ComputeSelectionView
 * @property {module:compute-selection~ComputeSelectionService} ComputeSelectionService
 * 
 * @property {module:compute-selection.ComputeSelection} ComputeSelection
 * @property {module:compute-selection.ComputeSelectionModel} ComputeSelectionModel
 */
module.exports = {
  GridInfoView : require('./GridInfoView'),
  BlockInfoView : require('./BlockInfoView'),
  
  ComputeUnitSelectionView : require('./ComputeUnitSelectionView'),
  ComputeUnitSelectionService : require('./ComputeUnitSelectionService'),

  ComputeSelection : require('./ComputeSelection'),
  ComputeSelectionModel : require('./ComputeSelectionModel'),
  ComputeSelectionMode : require('./ComputeSelectionMode')
}