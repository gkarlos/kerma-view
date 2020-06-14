/**
 * @memberof module:compute-unit-selection
 */
class ComputeUnitSelectionMode {
  /* @type {String} */#name

  /**
   * Create a new ComputeUnitSelectionMode
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
  get name() { return this.name}

  /**
   * Compare two modes for equality
   * @param {ComputeUnitSelectionMode} more Another mode to compare with
   * @return {Boolean} Whether the modes are equal or not
   */
  equals(mode) {
    if ( typeof mode !== ComputeUnitSelectionMode)
      return false
    return this.#name === mode.name
  }
}

/** */
ComputeUnitSelectionMode.Thread  = new ComputeUnitSelectionMode('thread')

/** */
ComputeUnitSelectionMode.Warp    = new ComputeUnitSelectionMode('warp')

/** */
ComputeUnitSelectionMode.Unknown = new ComputeUnitSelectionMode('unknown')

module.exports = ComputeUnitSelectionMode