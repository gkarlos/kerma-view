/**
 * @module shortcuts
 * @category Main
 */

const electron        = require('electron')
const globalShortcut  = electron.globalShortcut
const {InternalError} = require('@common/util/error')
const cl              = require('@main/cl')

module.exports = (app) => {
  if ( !app.windows.main)
    throw new InternalError('Cannot register shortcuts before app.window is ready')

  globalShortcut.register('f5', () => {
    cl.info('Refreshing window (f5)')
    app.windows.main.reload()
  })
}