/**
 * @module traits
 * @category Common
 * @subcategory util
 */


'use strict'

function isNumber(v) { 
  return !isNaN(parseFloat(v)) && !isNaN(v - 0) 
}

function isString(v) {
  // return Object.prototype.toString.call(v) == '[object String]'
  return (typeof v === 'string' || v instanceof String)
}

function isArray(v) {
  return Array.isArray(v)
}

function isObject(v) {
  return v instanceof Object; 
}

function isFunction(v) {
  return !!(v && v.constructor && v.call && v.apply);
}

module.exports = {
  isNumber,
  isString,
  isArray,
  isObject,
  isFunction
}