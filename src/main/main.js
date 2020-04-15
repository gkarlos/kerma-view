'use strict';

const electron        = require('electron');
const path            = require('path');
const app             = electron.app;
const BrowserWindow   = electron.BrowserWindow;
const menu            = electron.Menu;
const dialog          = electron.dialog;
const ipcMain         = electron.ipcMain;
const chalk           = require("chalk")

//
const release        = require('../common/release')
const cl             = require("../util/cl");
const log            = cl.log
const arg            = cl.arg
const config         = require("../common/config")
const settings       = config.settings

// var args = {} /* hold cl args after parsing */

function dumpPerformanceStats() {
  let stats = {
    memory : process.getHeapStatistics(),
    cpu : process.getCPUUsage(),
    iocounters : process.getIOCounters(),
  }

  if ( config.inDebugMode())
    log.debug("Performance Stats:", stats)
  else if ( app.args.options.printStatistics)
    log.info("Performance Stats:", stats)
}

function setup() {

  config.configure()  
  // Store cmd line args to app.args for other 
  // modules to access via require('electron').app.args
  app.args = arg.parse(process.argv)

  if ( settings.VERBOSE_LEVEL > 0 )
    log.log("Kerma-View v" + app.getVersion() + " | " + settings.MODE)

  config.dumpLaunchConfiguration();
}



app.on("ready", () => {
  setup()
  app.quit()
});

app.on("exit", () => {
  console.log("quiting")
  dumpPerformanceStats();
})



app.on('before-quit',function()
{
  // console.log('before-quit')
})

app.on('window-all-closed', () => {
  app.quit();
});

app.on('will-quit', function () {
  // console.log('will-quit');
});

app.on("quit", () => {
  log.info("Quiting...")
  dumpPerformanceStats();
})