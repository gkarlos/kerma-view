/**
 * This module contains string utilities
 * @module string
 * @category util
 */

/**
 * Capitalize the first letter of a string
 * @param {String} s 
 */
function capitalizeFirst(s) {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

module.exports = {
  capitalizeFirst
}