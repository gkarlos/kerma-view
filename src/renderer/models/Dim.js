
/**
 * This class is used to describe a 3D shape. Can be used to describe
 * thread grid/block or memory ranges.
 *
 * @memberof module:models
 */
class Dim {
  /** @type {Number} */
  #x
  /** @type {Number} */
  #y
  /** @type {Number} */
  #z

  /**
   * Create a new Dim instance
   * @param {Number} x Size of the x-dimension (Number of columns)
   * @param {Number} [y] Size of the y-dimension (Number of rows)
   * @param {Number} [z] Size of the z-dimension (Number of layers)
   */
  constructor(x, y = 1, z = 1) {
    if (!Number.isInteger(x))
      throw new Error('Invalid argument `x`. Must be integer')
    if (!Number.isInteger(y))
      throw new Error('Invalid argument `y`. Must be integer')
    if (!Number.isInteger(z))
      throw new Error('Invalid argument `z`. Must be integer')
    if (x < 1 || y < 1 || z < 1)
      throw new Error('Dim value cannot be < 1')
    this.#x = x
    this.#y = y
    this.#z = z
  }

  /**
   * Size of the x-dimension (Number of columns)
   * @returns {Number}
   */
  get x() { return this.#x }

  /**
   * Size of the y-dimension (Number of rows)
   * @returns {Number}
   */
  get y() { return this.#y }

  /**
   * Size of the z-dimension (Number of layers)
   * @returns {Number}
   */
  get z() { return this.#z }

  /**
   * Minimum value for the x dimension
   * @returns {Number}
   */
  get minx() { return 0 }

  /**
   * Minimum value for the y dimension
   * @returns {Number}
   */
  get miny() { return 0 }

  /**
   * Minimum value for the z dimension
   * @returns {Number}
   */
  get minz() { return 0 }

  /**
   * Maximum value for the x dimension
   * @returns {Number}
   */
  get maxx() { return this.#x - 1 }

  /**
   * Maximum value for the y dimension
   * @returns {Number}
   */
  get maxy() { return this.#y - 1 }

  /**
   * Maximum value for the z dimension
   * @returns {Number}
   */
  get maxz() { return this.#z - 1 }

  /**
   * Number of rows (y-dimension)
   * @alias y
   * @returns {Number}
   */
  get rows() { return this.#y }

  /**
   * Number of columns (x-dimension)
   * @alias x
   * @type {Number}
   */
  get cols() { return this.#x }

  /**
   * Number of layers (z-dimension)
   * @alias x
   * @type {Number}
   */
  get layers() { return this.#z }

  /**
   * Total number of elements
   * @type {Number}
   */
  get size() { return this.#x * this.#y * this.#z }

  /**
   * Total number of elements
   * @returns {Number}
   */
  getSize() { return this.size }

  /**
   * Check if an index exists in these dimensions
   * @param {Index|Number} index
   */
  hasIndex(index) {
    if (!(index instanceof Index) && !Number.isInteger(index))
      throw new Error("index must be a Index or Integer")
    let idx = index
    if (Number.isInteger(index)) {
      if (index < 0)
        return false
      idx = new Index(index)
    }
    return !(idx.x >= this.#x || idx.y >= this.#y)
  }

  /**
   * Check if 1-dimensional, i.e can be indexed only in the x-dimension
   * @returns {Boolean}
   */
  is1D() {
    return this.#y === 1 && this.#z === 1
  }

  /**
   * Check if 2-dimensional. i.e can be indexed in the y-dimension
   * @returns {Boolean}
   */
  is2D() {
    return this.#y > 1 && this.#z === 1
  }

  /**
   * Check if 3-dimensional. i.e can be indexed in both the z-dimension
   * @returns {Boolean}
   */
  is3D() {
    return this.#z > 1
  }

  /**
   * Create a copy of this Dim object
   * @returns {Dim}
   */
  clone() {
    return new Dim(this.#x, this.#y, this.#z)
  }

  /**
   * String representation of this Dim object
   * @returns {String}
   */
  toString() {
    let str = `${this.#x}x${this.#y}`
    if (this.#z > 1)
      str += `x${this.#z}`
    return str
  }

  /**
   * Compare with another Dim for value-equality
   * @param {Dim} other Another Dim
   * @returns {Boolean}
   */
  equals(other) {
    return (other instanceof Dim) && this.#x === other.x && this.#y === other.y && this.#z === other.z
  }

  /**
   * Returns an array with the size of the x,y and z dimensions (in that order)
   * @returns {Array.<Number>}
   */
  toArray() {
    return [this.#x, this.#y, this.#z]
  }
}

/** @type {Dim} */
Dim.Unit = new Dim(1, 1, 1);

/** @type {Dim} */
Dim.lin2 = new Dim(2)

/** @type {Dim} */
Dim.lin4 = new Dim(4)

/** @type {Dim} */
Dim.lin8 = new Dim(8)

/** @type {Dim} */
Dim.lin16 = new Dim(16)

/** @type {Dim} */
Dim.lin32 = new Dim(32)

/** @type {Dim} */
Dim.lin64 = new Dim(64)

/** @type {Dim} */
Dim.lin128 = new Dim(128)

/** @type {Dim} */
Dim.lin256 = new Dim(256)

/** @type {Dim} */
Dim.lin512 = new Dim(512)

/** @type {Dim} */
Dim.lin1024 = new Dim(1024)

/** @type {Dim} */
Dim.lin2048 = new Dim(2048)

/** @type {Dim} */
Dim.square2x2 = new Dim(2, 2)

/** @type {Dim} */
Dim.square4x4 = new Dim(4, 4)

/** @type {Dim} */
Dim.square8x8 = new Dim(8, 8)

/** @type {Dim} */
Dim.square16x16 = new Dim(16, 16)

/** @type {Dim} */
Dim.square32x32 = new Dim(32, 32)

/** @type {Dim} */
Dim.square64x64 = new Dim(64, 64)

/** @type {Dim} */
Dim.square128x128 = new Dim(128, 128)

/** @type {Dim} */
Dim.square256x256 = new Dim(256, 256)

module.exports = Dim