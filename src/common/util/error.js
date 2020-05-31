/**-----------------------------------------------------------------/
 *
 * Part of the kerma project
 * 
 *------------------------------------------------------------------/
 * 
 * @file util/error.js
 * @author gkarlos 
 * @module util/error
 * @description 
 *  Defines error types for the app. Different components may
 *  extend those classes
 *  
 *-----------------------------------------------------------------*/

 const color = require('cli-color')

/** Base class for command line related errors */
class CLError extends Error { 
  constructor(msg) { 
    super(msg)
    this.name = color.bold('cl');
  } 
}

/** Error indicating a file wasn't found */
class FileNotFoundError extends CLError {
  /**
   * @param {*} filename - the name of the file
   */
  constructor(filename) { 
    super(`Could not find file '${filename}'`) 
  }
}

/** Indicates internal errors */
class InternalError extends Error {
  constructor(msg) { 
    super(msg)
    this.name = 'InternalError'
  } 
}

module.exports = {
  CLError, 
  FileNotFoundError,
  InternalError
}