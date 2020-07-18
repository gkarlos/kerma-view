/**
 * Check if a number is a power of 2
 * @param {Number} n 
 * @returns {Boolean}
 */
function isPowerOf2(n) {
  return (typeof n === 'number') && n && (n & (n - 1)) === 0;
}

module.exports = {
  isPowerOf2,
}