/**==-- util/fs.js ----------------------------------------------===//
//
// Part of the kerma project
//
//===------------------------------------------------------------===//
//
// @file util/fs.js 
// @module fs
// @category Common
// @subcategory util
// @description 
// This module includes filesystem utilities. It mostly wraps 
// around and combines nodejs's fs and path functionality
//
//===------------------------------------------------------------===*/
'use strict'

const fs      = require('fs')
const path    = require('path')

/**
 * Check whether a path corresponds to an existing directory
 * 
 * @param {string} path A path
 * @returns {boolean} true - {@link path} exists and is a directory. 
 */         
fs.dirExists = function(path) { 
  return fs.existsSync(path) && fs.lstatSync(path).isDirectory(); 
}

/** 
 * Check whether a path corresponds to an existing file
 * @param {string} path A path
 * @return true - {path} exists and is a file. <br/>
 *         false - otherwise
 */
fs.fileExists = function(path) { 
  return fs.existsSync(path) && fs.lstatSync(path).isFile(); 
}

/**
 * Transform a path to a URI
 * 
 * @param {*} _path 
 */
fs.uriFromPath = function(_path) {
  var pathName = path.resolve(_path).replace(/\\/g, '/');
  if (pathName.length > 0 && pathName.charAt(0) !== '/') {
    pathName = '/' + pathName;
  }
  return encodeURI('file://' + pathName);
}

module.exports = fs