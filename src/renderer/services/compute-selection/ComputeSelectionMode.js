/**
 * @memberof module:compute-selection
 */
class ComputeSelectionMode {
  /* @type {String} */
  #name

  /**
   * Create a new ComputeSelectionMode
   * @param {String} name 
   */
  constructor(name) {
    if ( !name)
      throw new Error("Missing required argument `name`")
    this.#name = name
  }

  /** 
   * Retrieve the name of the mode
   * @returns {String}
   */
  get name() { return this.#name}

  /**
   * Compare two modes for equality
   * @param {ComputeSelectionMode} more Another mode to compare with
   * @return {Boolean} Whether the modes are equal or not
   */
  equals(mode) {
    if ( ! (mode instanceof ComputeSelectionMode))
      return false
    return this.#name === mode.name
  }

  toString() {
    return this.name
  }
}

/** */
ComputeSelectionMode.Thread  = new ComputeSelectionMode('thread')

/** */
ComputeSelectionMode.Warp    = new ComputeSelectionMode('warp')

/** */
ComputeSelectionMode.Unknown = new ComputeSelectionMode('unknown')

/** */
ComputeSelectionMode.Default = ComputeSelectionMode.Thread

/**
 * Get a ComputeSelection mode from a String
 * @returns {ComputeSelectionMode}
 */
ComputeSelectionMode.fromString = function(str) {
  if ( str === ComputeSelectionMode.Thread.name)
    return ComputeSelectionMode.Thread
  else if ( str === ComputeSelectionMode.Warp.name)
    return ComputeSelectionMode.Warp
  else
    return ComputeSelectionMode.Unknown
}

module.exports = ComputeSelectionMode