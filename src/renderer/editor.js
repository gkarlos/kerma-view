/**--renderer/editor.js---------------------------------------------/
 *
 * Part of the kerma project
 * 
 *------------------------------------------------------------------/
 * 
 * @file renderer/editor.js
 * @author gkarlos 
 * @module renderer/editor
 * @description 
 *   Defines functionality relevant to the editor(s)  
 *  
 *-----------------------------------------------------------------*/
'use strict'

const {app} = require('electron').remote
const path  = require('path')

const ace = require('ace-builds/src/ace')

require('ace-builds/src/mode-javascript');
require('ace-builds/src/theme-monokai');




// ace.config.setModuleUrl('ace/mode/javascript_worker', require('ace-builds/src/worker-javascript'))
// ace.config.setModuleUrl('ace/mode/javascript_json', require('ace-builds/src/worker-json'))

const {InternalError} = require('../util/error')

// monaco example https://github.com/felixrieseberg/electron-code-editor/tree/master/src

/**
 * A character position in the editor
 */
class Position {
  constructor(row, col) {
    this.row = row
    this.col = col
  }
}

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
    this.ace_ = null
    this.location_ = location
    this.loaded_ = false
  }

  /** Load the Editor into the DOM */
  load() {
    this.ace_ = ace.edit(this.location_)
    this.ace_.getSession().setOption('useWorker', false)
    this.ace_.getSession().setMode('ace/mode/javascript')
    this.ace_.setTheme('ace/theme/monokai')
    this.loaded_ = true;
  }

  /** Check whether the editor has been loaded into the dom */
  isLoaded() { return this.loaded_; }

  /** 
   * Set the contents the editor currently dispays
   * 
   * @param {string} content The new value for contents
   * @throws {InternalError}
   * */
  setContent(content) {
    //TODO error check param
    this.ace_.setValue(content);
    return this;
  }

  /** 
   * Highlight a specific row 
   */
  higlightRow(i, highlighter=null) {

  }

  /**
   * Highlight part of the contents of the editor. When values are 
   * nonsensical (e.g negative range) it is a no-op. 
   * 
   * Passing no arguments will highlight the full contents
   * 
   * @param {integer} fromRow - Starting row
   * @param {integer} fromCol - Stating column.  
   * @param {integer} toRow   - Ending row (inclusive). If not set, 
   *                            the rest of the contents will be highlighted
   * @param {integer} toCol   - Ending column (inclusive). If not set,
   *                            highlighting will stop at the last character of
   *                            the last column. Ignored if set but {@link toRow} 
   *                            is not
   * @param {*} highlighter 
   */
  highlightRange(fromRow=0, fromCol=0, toRow=undefined, toCol, highlighter=null) {
    //TODO implement me
    return this
  }

}

module.exports = {
  Position,
  Editor
}