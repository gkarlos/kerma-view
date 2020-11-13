/** @ignore @typedef {import("@renderer/models/Kernel")} Kernel */

const App = require('@renderer/app')
const Component = require('@renderer/ui/component/Component')

class KernelInformerView extends Component{

  #node
  #rendered

  constructor() {
    super('kernel-informer', App.ui.containers.mainSelection.secondRow.right)
    this.#rendered = false;
  }

  render() {
    if ( !this.#rendered) {
      console.log(this.container)
      this.#node = $("<div></div>")
      $(this.container.node).insertAt(0, this.#node)
      this.#rendered = true
    }
    return this;
  }

  clear() {
    if ( this.#rendered)
      this.#node.html("");
  }

  /**
   * @param {Kernel} kernel
   */
  show(kernel) {
    if ( this.#rendered)
      this.#node.html(
        `
          <strong>Loads:</strong> ${kernel.stats.loads} <br/>
          <strong>Stores:</strong> ${kernel.stats.stores} <br/>
        `
      )
  }
}

module.exports = KernelInformerView