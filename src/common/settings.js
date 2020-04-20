/**--common/settings.js-------------------------------------------------/
 *
 * Part of the kerma project
 * 
 *------------------------------------------------------------------/
 * 
 * @file common/settings.js
 * @author gkarlos 
 * @module common/settings
 * @description 
 *   Global app settings
 *  
 *-----------------------------------------------------------------*/
'use strict'



/**
 * @property {object}  defaults               - The default values for parties.
 * @property {number}  defaults.players       - The default number of players.
 * @property {string}  defaults.level         - The default level for the party.
 * @property {object}  defaults.treasure      - The default treasure.
 * @property {number}  defaults.treasure.gold - How much gold the party starts with.
 */
var config = {
  /** asd */
  defaults: {
      /** */
      players: 1,
      level:   'beginner',
      treasure: {
          gold: 0
      }
  }
};

// /** 
//  * Default values for (some of) the settings
//  * @namespace
//  * 

/** 
 * Default settings 
 * @namespace
 * @property {boolean} verbose - 
 * @property {object} window - Settings for the main app window
 * @property {number} window.width - Width of the window in pixels
 * @property {number} window.height - Height of the window in pixels
 * @property {string} kermadExecutable
 * @property {string} build 
 */
defaults = {
  verbose : 0,
  /** */
  window : { 
    /** */
    width : 1600, 
    height : 1080 
  },
  kermadExecutable : "kermad",
  build  : build.release,
  editor : "ace"
}

class XClass {

}

module.exports = {
  /**
   * Control the application's verbosity. Values `0,1,2`. At `verbose=0` no output is produced except for errors
   * @type {(0|1|2)} 
   * @default {@link defaults.verboce} => 0
   */
  verbose : 0,
  screen  : { 
    width : 0, 
    height : 0 
  },

  window  : { 
    width : defaults.window.width, 
    height : defaults.window.height 
  },
  build   : defaults.build,
  cl      : { 
    tags  : true,
    color : true
  },
  silent  : false,
  debug   : false,
  color   : true,
  editor  : defaults.editor
}

module.exports.defaults = defaults

/**
 * Restore the settings back the the defaults; as
 * define by {@link settings.defaults}
 */
module.exports.resetDefaults = function () {

}