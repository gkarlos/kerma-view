/**--renderer/events.js---------------------------------------------/
 *
 * Part of the kerma project
 * 
 *------------------------------------------------------------------/
 * 
 * @file renderer/events.js
 * @module renderer/events
 * @category Renderer
 * @author gkarlos 
 * @description 
 *   This module includes all the available events
 *-----------------------------------------------------------------*/

/** @ignore @typedef {import("@renderer/models/cuda/CuKernel")} CuKernel */


module.exports = {
  /** @event */UI_READY : "ui:ready",
  /** @event */UI_RESIZE : "ui:resize",
  /** @event */UI_COMPONENT_READY : "ui:component-ready",
  /** @event */UI_COMPONENTS_READY : "ui:components-ready",

  /** @event */EDITOR_LOADED : "editor:loaded",
  /** @event */EDITOR_INPUT_LOADED : "editor:input-loaded",
  /** @event */EDITOR_TAB_SELECTED : "editor:tab-selected",
  /** @event */EDITOR_VALUE_CHANGED: "editor:value-changed",

  /** @event */KERMAD_INPUT_ERROR : "kermad:input-error",

  /** 
   * @event 
   * @param {String} filename
   */
  INPUT_FILE_SELECTED : "input:selected",
  
  /** @event */INPUT_TYPE_SELECTED : "input:type-selected",
  
  /** 
   * @event 
   * @param {CuKernel} kernel
   */
  INPUT_KERNEL_SELECTED : "input:kernel-selected",

  /** @event */INPUT_KERNEL_LAUNCH_SELECTED : "input:kernel-launch-selected",
  
  /** @event */SESSION_NEW : "session:new",
  /** @event */SESSION_KILLED : "session:killed"
}