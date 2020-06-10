/**
 * Represents a point in 3 Dimensions
 * @category models
 * @subcategory util
 */
class Point {
  #x
  #y
  #z

  _argCheck(x,y,z) {
    if ( x && !Number.isInteger(x))
      throw new Error('Invalid argument `x`: must be integer')
    if ( y && !Number.isInteger(y))
      throw new Error('Invalid argument `y`: must be integer')
    if ( z && !Number.isInteger(z))
      throw new Error('Invalid argument `z`: must be integer')
  }

  /**
   * Creates a new `Point` object
   * @param {Integer}  x
   * @param {Integer} [y]
   * @param {Integer} [z]
   */
  constructor(x=0,y=0,z=0) {
    this._argCheck(x, y, z)
    this.#x = x
    this.#y = y
    this.#z = z
  }
  
  /** 
   * Retrieve the x-coordinate
   * @returns {Integer}
   */
  get x() { return this.#x }

  /**
   * Retrieve the y-coordinate
   * @returns {Integer}
   */
  get y() { return this.#y }

  /**
   * Retrieve the z-coordinate
   * @returns {Integer}
   */
  get z() { return this.#z }

  /**
   * Creates and return a copy of the `Point` object
   * @returns {Coordinate}
   */
  clone() {
    let copy = new Coordinate(this.#x, this.#y, this.#z)
    return copy
  }

  /**
   * Adds another `Point` to this one
   * @param {Point} other Another point
   */
  add(other) {
    if ( other) {
      this.#x += other.x
      this.#y += other.y
      this.#z += other.z
    }
    return this;
  }

  /**
   * Adds values to the coordinates of the `Point`
   * @param {Integer} x
   * @param {Integer} [y]
   * @param {Integer} [z]
   * @returns {Point} this
   */
  addValue(x, y=0, z=0) {
    if ( x)
      this.#x += x
    if ( y)
      this.#y += y
    if ( z)
      this.#z += z
    return this
  }

  /**
   * Subtracts another `Point` from this one
   * @param {Point} other Another point
   * @returns {Point} this
   */
  sub(other) {
    if ( other) {
      this.#x -= other.x
      this.#y -= other.y
      this.#z -= other.z
    }
    return this;
  }

  /**
   * Subtracts values from the coordinates of the `Point`
   * @param {Integer} x
   * @param {Integer} [y]
   * @param {Integer} [z]
   * @returns {Point} this
   */
  subValue(x, y=0, z=0) {
    if ( x)
      this.#x -= x
    if ( y)
      this.#y -= y
    if ( z)
      this.#z -= z
    return this
  }

  /**
   * Check if all coordinates are positive, i.e reside in the top-right quadrant
   * @returns {Boolean}
   */
  allPositive() {
    return this.#x > 0 && this.#y > 0 && this.#z > 0
  }

  /**
   * Check if all coordinates are negative, i.e reside in the bottom-left quadrant
   * @returns {Boolean}
   */
  allNegative() {
    return this.#x < 0 && this.#y < 0 && this.#z < 0
  }

  /**
   * Check if all coordinates are zero, i.e the point is the origin of the 3D plane
   * @returns {Boolean}
   */
  allZero() {
    return this.#x == 0 && this.#y == 0 && this.#z == 0
  }

}

module.exports = Point