/**--renderer/events.js---------------------------------------------/
 *
 * Part of the kerma project
 * 
 *------------------------------------------------------------------/
 * 
 * @file renderer/events.js
 * @module renderer/events
 * @author gkarlos 
 * @description 
 *   This module includes all the available events
 *  
 *//*--------------------------------------------------------------*/

module.exports = {
  /** @event */UI_RESIZE : "ui:resize",
  /** @event */UI_COMPONENT_READY: "ui:component-ready",

  /** @event */EDITOR_LOADED : "editor:loaded",
  /** @event */EDITOR_INPUT_LOADED: "editor:input-loaded",
  /** @event */EDITOR_TAB_SELECTED: "editor:tab-selected",

  /** @event */INPUT_SELECTED: "input:selected",
  
  /** @event */SESSION_NEW : "session:new",
  /** @event */SESSION_KILLED: "session:killed"
}