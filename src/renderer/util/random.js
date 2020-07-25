/**
 * @module random
 * @category Renderer
 * @subcategory util
 */
module.exports = function(){
  /**
   * Generates a random alphanumerid string of some length
   * from a given charset
   * 
   * @param {Integer} len length of the result
   * @param {String} charSet String to pick the characters from
   * @returns {String}
   * @memberof module:random
   */
  function uuid(len=40, charSet='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
    let res = '';
    for (let i = 0; i < len; i++) {
      let pos = Math.floor(Math.random() * charSet.length);
      res += charSet.substring(pos, pos + 1);
    }
    return res;
  }
  
  /**
   * Generates a random integer value in the given range (inclusive)
   * @param {Number} min 
   * @param {Number} max 
   * @returns {Number}
   * @memberof module:random
   */
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; 
  }

  /**
   * Generates a random multiple of a value. Optionally bounded
   * @param {Number} value
   * @param {Number} max 
   * @returns {Number}
   * @memberof module:random
   */
  function getRandomMultiple(value, max=0) {
    if ( max) {
      return getRandomInt(1, Math.floor(max / value)) * value
    } else {
      return getRandomInt(1, 10) * value
    }
  }

  return {
    uuid,
    getRandomInt,
    getRandomMultiple
  }
}()