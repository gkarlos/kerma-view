/**--renderer/ui/memory/index.js------------------------------------/
 *
 * Part of the kerma project
 * 
 *------------------------------------------------------------------/
 * 
 * @file renderer/ui/memory/index.js
 * @module memory
 * @category ui
 * @author gkarlos 
 * @description 
 *   Includes all the components used to visualize memory. i.e
 *   everything included in the "Memory" area of the app
 *  
 *//*--------------------------------------------------------------*/
module.exports = {
  MemoryArea : require('./MemoryArea'),
  MemoryAreaTitlebar: require('./MemoryAreaTitlebar'),
  MemoryVisualizer : require('./MemoryVisualizer'),
  MemoryVisualizerToolbar : require('./MemoryVisualizerToolbar'),
  MemoryVisualizerCells : require('./MemoryVisualizerCells')
}