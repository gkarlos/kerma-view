/**
 * @module window
 * @category Main 
 */

/**
 * Create a {BrowserWindow} object at a position
 * @param {*} pos 
 */
function createNew(pos) {
  if ( !( 'x' in pos) || !('y' in pos))
    throw new Error('Invalid position. Expecting object with { x: _ , y : _ }')
}

module.exports = {
  createNew
}