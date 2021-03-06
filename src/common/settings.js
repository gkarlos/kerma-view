/**--common/settings.js-------------------------------------------------/
 *
 * Part of the kerma project
 * 
 *------------------------------------------------------------------/
 * 
 * @file common/settings.js
 * @author gkarlos 
 * @module settings
 * @category Common
 * @description 
 *   Global app settings
 *  
 *-----------------------------------------------------------------*/
'use strict'

/**
 * Available builds types
 * @namespace
 */
const Builds = {
  /** */
  dev : "dev",
  /** */
  release : "release"
}

/**
 * @namespace
 */
const SupportedEditors = {
  ace : {
    name : "ace",
    theme : 'ace/theme/github',
    mode : 'ace/mode/c_cpp'
  },

  monaco : {
    name : "monaco",
    theme : "TODO",
    mode : "TODO"
  }
}

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
const defaults = {
  verbose : 0,
  /** */
  window : { 
    /** */
    width : 1920, 
    height : 1080 
  },
  kermadExecutable : "kermad",
  build  : Builds.release,
  editor : "ace"
}

/** Check whether in debug mode */
function inDebugMode() {
  return settings.debug;
}

/** Check if build type is {@link build.dev} */
function isDevBuild() { 
  return settings.build === build.dev;
}

/* Check if build type is {@link build.release} */
function isReleaseBuild() {
  return settings.build === build.release;
}

module.exports = {
  /**
   * Control the application's verbosity. Values `0,1,2`. At `verbose=0` no output is produced except for errors
   * @type {(0|1|2)}
   * @default {@link defaults.verboce} => 0
   */
  verbose : 0,
  numDisplays : 0,
  displays : [],
  display : {
    id : 0,
    width : 0,
    height : 0
  },
  window  : {
    width : 1920,
    height : 1080,
    minWidth: 1090,
    minHeight: 750,
    maximized : false,
    zoom : false
  },
  build   : defaults.build,
  cl      : {
    tags  : true,
    color : true,
    requireInput : false
  },
  silent  : false,
  debug   : false,
  color   : true,
  editor  : defaults.editor,
  input   : ""
}

module.exports.defaults = defaults
module.exports.Builds = Builds
module.exports.SupportedEditors = SupportedEditors

/**
 * Restore the settings back the the defaults; as
 * defined by {@link settings.defaults}
 */
module.exports.resetDefaults = function () {
  this.verbose = this.defaults.verbose
  this.screen = this.defaults.screen
  // TODO finish me
}