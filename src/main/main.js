'use strict';

const electron        = require('electron');
const path            = require('path');

//
const log            = require("./logging");
const cli            = require("./cli");
const defaults       = require("../common/config").defaults;


//
const app             = electron.app;
const BrowserWindow   = electron.BrowserWindow;
const menu            = electron.Menu;
const dialog          = electron.dialog;
const ipcMain         = electron.ipcMain;

//

// const options = {
//   W_WIDTH       : 1600,
//   W_HEIGHT      : 1080,
//   SCREEN_WIDTH  : null,
//   SCREEN_HEIGHT : null,
//   WINDOW_SHIFT  : 20,
//   DEBUG         : true,
// };

// START
const {argc, argv} = cli.argParse(process.argv)

app.on("ready", () => {});