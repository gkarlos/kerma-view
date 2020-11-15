/** @ignore @typedef {import("@renderer/models/Kernel")} Kernel */

const App = require('@renderer/app')
const Component = require('@renderer/ui/component/Component')

class KernelInformerView extends Component{

  #node
  #rendered

  constructor() {
    super('kernel-informer', App.ui.containers.mainSelection.secondRow.left)
    this.#rendered = false;
  }

  render() {
    if ( !this.#rendered) {
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

    function ppDim (dim) {
      let res = `${dim.x}`
      if ( dim.z > 1) {
        return `${dim.z} &#215 ${dim.y} &#215 ` + res
      } else if (dim.y > 1) {
        return `${dim.y} &#215 ` + res
      }
      return res
    }

    if ( this.#rendered)
      this.#node.html(
        `
        <table>
          <tr>
              <th class="small text-muted pr-2" scope="row">L/S/A</th>
              <td>${kernel.stats.loads}/${kernel.stats.stores}/${kernel.stats.atomics}</td>
          </tr>
          <tr>
              <th class="small text-muted pr-2" scope="row">Block</th>
              <td>${ppDim(kernel.launch.grid)}</td>
          </tr>
          <tr>
              <th class="small text-muted pr-2" scope="row">Grid</th>
              <td>${ppDim(kernel.launch.block)}</td>
          </tr>
        </table>`
      )
  }
}

module.exports = KernelInformerView