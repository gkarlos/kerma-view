/** @ignore @typedef {import("@renderer/models/Kernel")} Kernel */

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

  enable() {
    if ( !this.#enabled) {
      this.#enabled = true
      this.#currentView && this.#currentView.enable()
    }
    return this
  }

  disable() {
    if ( this.#enabled) {
      this.#currentView && this.#currentView.disable()
      this.#enabled = false;
    }
    return this
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

}

module.exports = ComputeSelectionService