'use strict';

const electron        = require('electron');
const path            = require('path');
const app             = electron.app;
const BrowserWindow   = electron.BrowserWindow;
const menu            = electron.Menu;
const dialog          = electron.dialog;
const ipcMain         = electron.ipcMain;
const release         = require('../common/release')
const cl              = require("../util/cl");
const arg             = cl.arg
const config          = require("../common/config")
const settings        = config.settings
const perf            = require('./perf')


app.args = arg.parse.list(process.argv, (error, result) => {
  if ( error)
    arg.parse.defaultErrorHandler(error)
  cl.verbose(0, "Kerma-View v" + app.getVersion() + " | " + settings.build + "." + process.arch + "\n")
  return result;
})

function setup() {
  config.configure()  
  config.dumpLaunchConfiguration()
}

app.on("ready", () => {
  setup();
  app.quit()
});

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
  cl.info("Quiting...")
  perf.dumpPerformanceStats();
})