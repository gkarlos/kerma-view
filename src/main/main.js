'use strict';

const electron        = require('electron');
const path            = require('path');

//
const release    = require('../common/release')
const log            = require("./logging");
const cl             = require("../util/cl");
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
// 



app.on("ready", () => {
  // TODO
  cl.arg.parse(process.argv)
});

app.on("exit", () => {
  console.log("exiting")
})