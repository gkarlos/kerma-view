'use strict'

const electron        = require('electron');
const app             = electron.app

const mode = {
  debug : "debug",
  release : "release"
}

const defaults = {
  WINDOW_WIDTH: 1600,
  WINDOW_HEIGHT: 1080,
  KERMAD_EXECUTABLE: "kermad",
  MODE : mode.release
}

const settings = {
  VERBOSE_LEVEL   : 1,
  SCREEN_WIDTH    : false,
  SCREEN_HEIGHT   : false,
  WINDOW_WIDTH    : defaults.WINDOW_WIDTH,
  WINDOW_HEIGHT   : defaults.WINDOW_HEIGHT,
  MODE            : defaults.MODE,
  SHOW_DEBUG_TAGS : true
}

function inDebugMode() { 
  return settings.MODE === mode.debug;
}

function inReleaseMode() {
  return settings.MODE === mode.debug;
}

function configure() {
  settings.SCREEN_WIDTH  = electron.screen.getPrimaryDisplay().workAreaSize.width;
  settings.SCREEN_HEIGHT = electron.screen.getPrimaryDisplay().workAreaSize.height;
}

function dumpLaunchConfiguration() {
  if ( !inDebugMode())
    return;
  let log = require('../util/cl').log
  log.debug("Configuration: ", {
    system : {
      platform : process.platform,
      version  : process.getSystemVersion(),
      mem : {
        total : process.getSystemMemoryInfo().total,
        free :  process.getSystemMemoryInfo().free.toString() + 
                " (" + ((process.getSystemMemoryInfo().free / process.getSystemMemoryInfo().total) * 100).toFixed(1) + " %)"
      },
      screen : settings.SCREEN_WIDTH + "x" + settings.SCREEN_HEIGHT
    },
    app : {
      args : { "Input" : app.args.input, "Options" : app.args.options },
      window : settings.WINDOW_WIDTH + "x" + settings.WINDOW_HEIGHT
    }
  })
}

module.exports = {
  defaults,
  mode,
  settings,
  configure,
  inDebugMode,
  inReleaseMode,
  dumpLaunchConfiguration
}