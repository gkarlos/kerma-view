//===-- util/fs.js ----------------------------------------------===//
//
// Part of the kerma project
//
//===------------------------------------------------------------===//
//
// This module includes filesystem utilities. It mostly wraps 
// around and combines nodejs's fs and path functionality
//
//===------------------------------------------------------------===/
'use strict'

const fs      = require('fs')

/**
 * Check whether a path corresponds to an existing directory
 * 
 * @param {string} path A path
 * @returns {boolean} true - {@link path} exists and is a directory. 
 */         
function dirExists(path) { 
  return fs.existsSync(path) && fs.lstatSync(path).isDirectory(); 
}

/** 
 * Check whether a path corresponds to an existing file
 * @param {string} path A path
 * @return true - {path} exists and is a file. <br/>
 *         false - otherwise
 */
var fileExists = function(path) { 
  return fs.existsSync(path) && fs.lstatSync(path).isFile(); 
}

module.exports = {
  dirExists,
  fileExists
}