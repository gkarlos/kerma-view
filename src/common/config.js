'use strict'

const electron = require('electron');
const app      = electron.app

const build = {
  dev : "dev",
  release : "release"
}

const defaults = {
  window : { width : 1600, height : 1080 },
  kermadExecutable : "kermad",
  build   : build.release,
  editor : {
    ace : {
      theme : 'ace/theme/github',
      mode : 'ace/mode/c_cpp'
    }
  }
}

const settings = {
  verbose : 0,
  screen  : { width : 0, height : 0 },
  window  : { width : defaults.window.width, height : defaults.window.height },
  build   : defaults.build,
  cl      : { 
    tags  : true,
    color : true
  },
  silent  : false,
  debug   : false,
  color   : true
}

function inDebugMode() {
  return this.settings.debug;
}

function isDevBuild() { 
  return settings.build === build.dev;
}

function isReleaseBuild() {
  return settings.build === build.release;
}

function configure() {
  settings.screen.width  = electron.screen.getPrimaryDisplay().workAreaSize.width;
  settings.screen.height = electron.screen.getPrimaryDisplay().workAreaSize.height;
  // TODO set window size based on screen size
}

function dumpLaunchConfiguration() {
  const cl = require('../util/cl')

  let fn = settings.debug? cl.debug : cl.info;
  fn("Configuration: ", {
    system : {
      platform : process.platform,
      version  : process.getSystemVersion(),
      mem : {
        total : process.getSystemMemoryInfo().total,
        free :  process.getSystemMemoryInfo().free.toString() + 
                " (" + ((process.getSystemMemoryInfo().free / process.getSystemMemoryInfo().total) * 100).toFixed(1) + " %)"
      },
      screen : settings.screen.width + "x" + settings.screen.height
    },
    app : {
      args : { "Input" : app.args.input, "Options" : app.args.options },
      window : settings.screen.width + "x" + settings.screen.height
    }
  })
}

module.exports = {
  defaults,
  build,
  settings,
  configure,
  inDebugMode,
  isDevBuild,
  isReleaseBuild,
  dumpLaunchConfiguration
}