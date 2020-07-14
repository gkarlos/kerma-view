/**
 * @module editor
 * @category Renderer
 * @subcategory Ui
 */
module.exports = {
  EditorTabs : require('./EditorTabs'),
  EditorToolbar : require('./EditorToolbar'),
  Editor : require('./Editor').Editor,
  defaultCreate: require('./Editor').defaultCreate
}