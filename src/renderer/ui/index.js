/**
 * This is an aggegation of all ui (sub-)modules
 * 
 * @module ui
 */
module.exports = {
  console : require('./console'),
  editor : require('./editor'),
  layout : require('./layout'),
  memory : require('./memory'),
  toolbars : require('./toolbars'),
  component : require('./component'),
  /** The ui init module */
  init : require('./init')
}