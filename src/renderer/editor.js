const {app} = require('electron').remote
const path  = require('path')

// monaco example https://github.com/felixrieseberg/electron-code-editor/tree/master/src

class Editor {
  /**
   * 
   * @param {string} location A jQuery selector
   */
  constructor(location) {
    if ( typeof location != 'string' && !(location instanceof String))
      throw new InternalError('Invalid argument `location` @Editor.constructor. Expected String, got ' + (typeof location))
  }
}

module.exports = {
  Editor
}