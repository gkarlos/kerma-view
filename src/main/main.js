/**--main/main.js-----------------------------------------------------/
 *
 * Part of the kerma project
 *
 *------------------------------------------------------------------/
 *
 * @file main/main.js
 * @author gkarlos
 * @module main
 * @category Main
 * @description
 *   The main/entry-point module
 *
 *-----------------------------------------------------------------*/
'use strict';
require('v8-compile-cache')
require('module-alias/register')

require('dotenv').config()

const Logger          = require('./log')
const electron        = require('electron');
const path            = require('path');
const p               = require('@common/util/path')
const app             = electron.app;
const BrowserWindow   = electron.BrowserWindow;
const menu            = electron.Menu;
const dialog          = electron.dialog;
const ipcMain         = electron.ipcMain;
const spawn           = require('child_process').spawn
const settings        = require('@common/settings')
const fs              = require('@common/util/fs')
const cl              = require('@main/cl')
const perf            = require('@main/perf')
const devtools        = require('@common/util/devtools')
const ProgressBar     = require('electron-progressbar')

const Log             = new Logger({color: true, timestamps: true})

let shouldExit = false
if( !process.env.KERMAD_IP) {
  Log.error("KERMAD_IP is not set. Please set in in .env")
  shouldExit = true
}
if ( !process.env.KERMAD_PORT) {
  Log.error("KERMAD_PORT is not set. Please set it in .env")
  shouldExit = true
}
if ( shouldExit) process.exit()

// app.allowRendererProcessReuse = false
app.root     = path.join(__dirname, "../../")
app.iconPath = path.join(app.root, "assets", "icon-48.png")
app.version  = require('../../package.json').version
app.windows  = { main : null, loading: null}
app.title    = `KermaView v${app.getVersion()} | ${settings.build}.${process.arch} ${settings.debug?"[debug]":""}`

app.args = cl.parse.list(process.argv, (error, result) => {
  if ( error)
    cl.parse.defaultErrorHandler(error)
  cl.verbose(0, `KermaView v${app.getVersion()} | ${settings.build}.${process.arch} ${settings.debug?"--debug":""}\n`)

  if ( result.input) {
    app.input.path = result.input
    app.input.content = fs.readFileSync( app.input.path, "utf-8")
  }
  return result;
})

global.kermad = {
  ip: process.env.KERMAD_IP,
  port: process.env.KERMAD_PORT
}

global.examples = {
  "Rodinia" : {
    "b+tree":   { path: "examples/rodinia/cuda/b+tree/b+tree.cu", args: "file mil.txt command command.txt"},
    "backprop": { path: "examples/rodinia/cuda/backprop/backprop.cu", args: "1000000" },
    "bfs":      { path: "examples/rodinia/cuda/bfs/bfs.cu", args: "todo"},
    "cfd":      { path: "examples/rodinia/cuda/cfd/euler3d.cu", args: "todo"},
    "gaussian": { path: "examples/rodinia/cuda/gaussian/gaussian.cu", args: "todo"},
    "hotspot":  { path: "examples/rodinia/cuda/hotspot/hotspot.cu", args: "todo"},
    "lavaMD":   { path: "examples/rodinia/cuda/lavaMD/lavaMD.cu", args: "todo"},
    "lud":      { path: "examples/rodinia/cuda/lud/lud.cu", args: "todo"},
    "nn":       { path: "examples/rodinia/cuda/nn/nn.cu", args: "todo"},
    "nw":       { path: "examples/rodinia/cuda/nw/nw.cu", args: "todo"},
    "particlefilter": { path: "examples/rodinia/cuda/particlefilter/particlefilter.cu", args: "todo"},
    "particlefilter.float": { path: "examples/rodinia/cuda/particlefilter/particlefilter.float.cu", args: "todo"},
    "pathfinder":     { path: "examples/rodinia/cuda/pathfinder/pathfinder.cu", args: "todo"},
    "srad" :          { path: "examples/rodinia/cuda/srad/srad.cu", args: "todo"},
    "streamcluster":  { path: "examples/rodinia/cuda/streamcluster/streamcluster.cu", args: "todo"}
  }
}

// Generate compilation databases
// var GenCompileDB = spawn()
// app.kermad.path = (() => {
//   let kermadPath = path.join(p.resolve(process.env.KERMA_HOME), "bin", "kermad")
//   cl.info(`kermad at ${kermadPath}`)
//   return kermadPath;
// })()
// app.kermad.proc = spawn(app.kermad.path, [])
// app.kermad.proc.stderr.setEncoding('utf-8')
// app.kermad.proc.stdout.setEncoding('utf-8')
// app.kermad.proc.stderr.on('data', (data)  => {
//   app.kermad.proc.stdout.removeAllListeners()
//   app.kermad.proc.stdout.on('data', (d) => console.log(d))
//   let d = data.split(':')
//   app.kermad.host = d[0]
//   app.kermad.port = d[1]
//   cl.info(`kermad listening on ${app.kermad.host}:${app.kermad.port}`)
// })
// app.kermad.proc.stdout.on('data', (data) => console.log(data))
// app.kermad.proc.on('close', (code) => console.log(`kermad exited with ${code}`))

/**
 * Perform configuration steps
 * Called after `app.ready`
 */
function preConfigure() {
  settings.displays = electron.screen.getAllDisplays()

  if ( settings.display.id != 0) {
    if ( settings.display.id > 1 )
      error(`Requested display ${settings.display.id} but only ${settings.display.list.electron} displays detected`).exit(0)
    settings.display.id = 1
  }

  settings.display.width = settings.displays[settings.display.id].workAreaSize.width;
  settings.display.height = settings.displays[settings.display.id].workAreaSize.height;

  if ( settings.window.maximized ) {
    settings.window.width = settings.display.width
    settings.window.height = settings.display.height
  }

  process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true //TODO Remove and fix

  app.settings = settings;
}

/**
 * Configuration step that required main window to have been created
 */
function configure() {
  if( settings.debug)
    require('electron-context-menu')()
}

function createLoadingWindow() {
  cl.debug('Creating window: \'loading\'')

  let loading = new BrowserWindow({
    show: true, 
    frame: false,
    height: 30,
    width: 300,
    nodeIntegration : true,
    transparent: true,
    icon : path.join(__dirname, '../../', 'assets', 'icon-48.png')
  })
  loading.loadFile(path.join(__dirname, "../", "renderer", "static", "loading.html"))
  loading.on('closed', () => {
    cl.debug('Closing window \'loading\'')
    app.windows.loading = null;
  })

  app.windows.loading = loading
  return loading
}

/**
 * Creates the main window
 */
function createMainWindow() { 
  cl.debug('Creating window: \'main\'')

  let win = new BrowserWindow({
    title: app.title,
    width : settings.window.width, height : settings.window.height,
    webPreferences : {
      nodeIntegration : true,
      nodeIntegrationInWorker: true
    },
    show: false,
    icon : path.join(__dirname, '../../', 'assets', 'icon-48.png')
  })
  // win.setPosition(settings.displays[settings.display.id].bounds.x,
  //                 settings.displays[settings.display.id].bounds.y + 50)
  win.setVibrancy('ultra-dark') // TODO read more

  if ( settings.debug)
    devtools.open(win, true, true);

  win.setMenuBarVisibility(false)
  win.loadFile(path.join(__dirname, "../", "renderer", "static", "index.html"))

  win.on('close', () => {
    app.windows.loading && app.windows.loading.close()
    cl.debug('Closing window \'main\'')
    app.windows.main = null
  })

  app.windows.main = win

  return win;
}

function createProgressBar() {
  return new ProgressBar({
    text: "",
    detail: "",
    browserWindow: {
      transparent: true,
      frame: false,
			webPreferences: {
				nodeIntegration: true
			}
    }
  });
}

function registerShortcuts() {
  require('./shortcuts')(app)
}

app.on("ready", () => {
  var progressBar = createProgressBar()

  preConfigure()

  // let loading = createLoadingWindow()

  let mainWindow = createMainWindow();

  configure()

  app.windows.main.webContents.once('dom-ready', () => {
    app.windows.main = mainWindow
    progressBar.setCompleted()
    setTimeout(() => app.windows.main.show(), 300)    
  })
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