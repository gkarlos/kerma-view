/** @ignore @typedef {import("@renderer/models/Kernel")} Kernel */
/** @ignore @typedef {import("@renderer/models/Idx")} Index */

/** @typedef {function(Index, number, number) : void} ComputeOnChangeCallback */

const ComputeSelectionView = require('./ComputeSelectionView')

class ComputeSelectionService {

  /** @type {Map<Kernel, ComputeSelectionView>} */
  #views
  /** @type {ComputeSelectionView} */
  #currentView
  /** @type {boolean} */
  #enabled

  constructor() {
    this.#views = new Map()
    this.#enabled = false
  }

  /** @returns {ComputeSelectionService} */
  enable() {
    if ( !this.#enabled) {
      this.#enabled = true
      this.#currentView && this.#currentView.enable()
    }
    return this
  }

  /** @returns {ComputeSelectionService} */
  disable() {
    if ( this.#enabled) {
      this.#currentView && this.#currentView.disable()
      this.#enabled = false;
    }
    return this
  }

  /** @returns {Index} */
  getBlock() {
    return this.#currentView.blockSelection;
  }

  /** @returns {number} */
  getWarp() {
    return this.#currentView.warpSelection;
  }

  /** @returns {number} */
  getLane() {
    return this.#currentView.threadSelection;
  }

  /**
   * Show a compute selection for a kernel
   *
   * Selections are cached to avoid re-building the DOM
   *
   * The call only does something if the requested kernel
   * is different that the current one.
   *
   * @param {Kernel} [kernel]
   */
  show(kernel) {
    if ( !this.#currentView) {
      this.#currentView = new ComputeSelectionView(kernel);
      this.#views.set(kernel, this.#currentView);
    } else if ( kernel && kernel.id != this.#currentView.kernel.id ) {
      // requesting a different kernel
      let newView = undefined
      for ( let k in this.#views)
        if ( this.#views[k].id == kernel.id) {
          newView = this.#views[k]
          break;
        }
      if ( !newView) {
        // view for kernel not cached
        newView = new ComputeSelectionView(kernel);
        this.#views.set(kernel, newView);
      }

      this.#currentView.hide();
      this.#currentView = newView;
      this.#currentView.show();
    }

    if ( this.#enabled)
      this.#currentView.render().enable()
    else
      this.#currentView.render().disable()
  }

  /**
   * Set a callback to be fired when the user selects a block or warp
   * @param {ComputeOnChangeCallback} callback
   * @returns ComputeSelectionService
   */
  onChange(callback) {
    this.#views.forEach(view => view.onChange(callback))
    return this;
  }

}

module.exports = ComputeSelectionService