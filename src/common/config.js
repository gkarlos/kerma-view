/** /---------------------------------------------------------------/
 * @file common/config.js
 * @fileoverview
 *  Part of the kerma project
 * @author gkarlos 
 * @module common/config
 * @description 
 * App configuration. Includes settings and relavant utilities
 *  
 *//**-------------------------------------------------------------*/
'use strict'

const electron = require('electron');
const app      = electron.app

/**
 * Build types
 * @namespace
 */
const build = {
  /** */
  dev : "dev",
  /** */
  release : "release"
}

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

/** Check whether in debug mode */
function inDebugMode() {
  return this.settings.debug;
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
  defaults,
  build,
  settings,
  inDebugMode,
  isDevBuild,
  isReleaseBuild,
}