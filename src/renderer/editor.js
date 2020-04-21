const {app} = require('electron').remote
const path  = require('path')
const ace = require("../../node_modules/ace-builds/src-noconflict/ace")

const {InternalError} = require('../util/error')

// monaco example https://github.com/felixrieseberg/electron-code-editor/tree/master/src

/**
 * 
 */
class Editor {
  /**
   * 
   * @param {string} location A jQuery selector
   */
  constructor(location) {
    if ( typeof location != 'string' && !(location instanceof String))
      throw new InternalError('Invalid argument `location` @Editor.constructor.' +
                              'Expected String, got ' + (typeof location))
    
    this.location_ = location
    this.ace = null
    this.loaded_ = false
  }

  /**
   * Load the Editor into the DOM
   */
  load() {
    

    this.loaded_ = true;
  }
}

module.exports = {
  Editor
}