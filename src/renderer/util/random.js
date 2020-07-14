/**
 * @module random
 * @category Renderer
 * @subcategory util
 */

/**
 * Generates a random alphanumerid string of some length
 * from a given charset
 * 
 * @param {Integer} len length of the result
 * @param {String} charSet String to pick the characters from
 * @returns {String}
 */
function uuid(len=40, 
              charSet='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
  let res = '';
  for (let i = 0; i < len; i++) {
      let pos = Math.floor(Math.random() * charSet.length);
      res += charSet.substring(pos, pos + 1);
  }
  return res;
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

module.exports = {
  uuid,
  getRandomIntInclusive
}