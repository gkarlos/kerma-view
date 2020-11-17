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

/** @ignore @typedef {import("@renderer/models/cuda/Kernel")} Kernel */


module.exports = {
  /** @event */UI_READY : "ui:ready",
  /** @event */UI_RESIZE : "ui:resize",
  /** @event */UI_COMPONENT_READY : "ui:component-ready",
  /** @event */UI_COMPONENTS_READY : "ui:components-ready",

  /** @event */EDITOR_LOADED : "editor:loaded",
  /** @event */EDITOR_INPUT_LOADED : "editor:input-loaded",
  /** @event */EDITOR_TAB_SELECTED : "editor:tab-selected",
  /** @event */EDITOR_VALUE_CHANGED: "editor:value-changed",

  /** @event */CODEWALK_START : "codewalk:start",
  /** @event */CODEWALK_NEXT : "codewalk:next",
  /** @event */CODEWALK_STOP : "codewalk:stop",

  /** @event */RELOAD : "app:reload",


  /** @event */KERMAD_INPUT_ERROR : "kermad:input-error",

  /**
   * @event
   * @param {Object} input
   * @param {String} input.dir
   * @param {String} input.source
   * @param {String} input.compiledb
   */
  INPUT_SELECTED : "input:selected",

  /** @event */INPUT_TYPE_SELECTED : "input:type-selected",

  /**
   * @event
   * @param {Kernel} kernel
   */
  INPUT_KERNEL_SELECTED : "input:kernel-selected",


  /**
   * Fires when the user selects (or changes) block/warp/lane
   * @event
   * @param {Index} blockIdx
   * @param {number} warpid
   * @param {number} laneid
   */
  INPUT_COMPUTE_SELECTED : "input:compute-selected",

  /** @event */INPUT_KERNEL_LAUNCH_SELECTED : "input:kernel-launch-selected",
  /** @event */SESSION_NEW : "session:new",
  /** @event */SESSION_KILLED : "session:killed"
}