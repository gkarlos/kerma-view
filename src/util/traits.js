//===-- util/cl.js ----------------------------------------------===//
//
// Part of the kerma project
//
//===------------------------------------------------------------===//
//
// Type traits stuff
//
//===------------------------------------------------------------===//

/** @module traits */

'use strict'

function isNumber(v) { 
  return !isNaN(parseFloat(v)) && !isNaN(v - 0) 
}

function isString(v) {
  return Object.prototype.toString.call(v) == '[object String]'
}

function isArray(v) {
  return Array.isArray(v)
}

function isObject(v) {
  return v instanceof Object; 
}

module.exports = {
  isNumber,
  isString,
  isArray,
  isObject
}