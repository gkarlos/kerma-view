/**--util/devtools.js-----------------------------------------------/
*
* Part of the kerma project
* 
*-------------------------------------------------------------------/
* 
* @file util/devtools.js
* @author gkarlos 
* @module util/devtools
* @description 
*   Utilities relevant to opening devtools
*  
*------------------------------------------------------------------*/
'use strict'

const BrowserWindow = require("electron").BrowserWindow

const cl       = require('./cl')
const settings = require('../common/settings')

/**
 * Open dev tools relative to a window. An invalid {@link window} param
 * results in a no-op and false returned.
 * 
 * @static
 * @param {Electron.BrowserWindow} window - A window
 * @param {boolean} [detached] - Detach the dev tools from the window
 * @param {boolean} [dragable] - Drag the dev tools window along the main window
 *                             Value ignored if {@link detached} is `false` or
 *                             window.width + devtools.width > screen.width
 * @returns The {@link window} parameter on success. Otherwise `false`
 */
function open(window=null, detached=false, dragable=false) {


  if ( !window || !(window instanceof BrowserWindow))
    return false;

  if ( !detached)
    return window.toggleDevTools();
  
  let devtools = new BrowserWindow();
  let WindowAndDevToolFitScreen = () =>
      window.getBounds().width + devtools.getBounds().width >= settings.screen.width;

  // Create a detached devtools window 
  // https://stackoverflow.com/questions/52178592/how-to-set-the-devtools-window-position-in-electron
  window.webContents.setDevToolsWebContents(devtools.webContents);
  window.webContents.openDevTools({ mode: 'detach', activate : 'true' });
  window.webContents.on('devtools-opened', () => {
    setImmediate(() => devtools.focus()); // focus the devtools window
    devtools.s
  });

  if ( WindowAndDevToolFitScreen() )
    devtools.setPosition(settings.screen.width - devtools.getBounds().width - 1, window.getBounds().y)
  else {
    devtools.setPosition(window.getBounds().x + window.getBounds().width, window.getBounds().y)

    if ( dragable)
      window.on('move', () =>
        devtools.setPosition(window.getBounds().x + window.getBounds().width, window.getBounds().y) )
  }

  window.on('close', () => devtools && devtools.close())

  devtools.on('close', () => {
    cl.debug('Closing dev tools');
    devtools = null;
  })
}

module.exports = {
  open
}

