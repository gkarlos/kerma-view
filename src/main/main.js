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
const config          = require("../common/config")
const settings        = config.settings
const perf            = require('./perf')
const devtools        = require('../util/devtools')


app.args = cl.parse.list(process.argv, (error, result) => {
  if ( error)
    cl.parse.defaultErrorHandler(error)
  cl.verbose(0, "Kerma-View v" + app.getVersion() + " | " + settings.build + "." + process.arch + "\n")
  return result;
})

/**
 * Perform necessary setup before window.ready
 */
function setup() {
  config.configure() 
  config.dumpLaunchConfiguration()
}

/**
 * Creates the main window
 */
function createMainWindow() {
  let win = new BrowserWindow({
    width : settings.window.width, height : settings.window.height,
    webPreferences : {
      nodeIntegration : true
    },
    icon : path.join(__dirname, '../../', 'assets', 'icon-48.png')
  })

  win.setVibrancy('ultra-dark') // TODO read more

  if ( settings.debug)
    devtools.open(win, true,true);

  win.setMenuBarVisibility(false)
  win.loadFile(path.join(__dirname, "../", "renderer", "index.html"))
  win.on('close', () => {
    cl.debug('Closing main window')
  })

  return win;
}

let mainWindow = null;

app.on("ready", () => {
  setup()

  try {
    mainWindow = createMainWindow();
  } catch ( error) {
    cl.error(error).exit(0);
  }
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
  perf.dumpPerformanceStats();
})