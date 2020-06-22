/** 
 * @module jquery 
 * @category extensions
 */

 module.exports = (() =>{

  /**
   * Insert a DOM element at a specific position in its container
   * 
   * @memberof module:jquery
   * @param {Number} index 
   * @param {*} element 
   */
  $.fn.insertAt = function(index, element) {
    var lastIndex = this.children().length;
    if (index < 0) {
      index = Math.max(0, lastIndex + 1 + index);
    }
    this.append(element);
    if (index < lastIndex) {
      this.children().eq(index).before(this.children().last());
    }
    return this;
  }
 })()