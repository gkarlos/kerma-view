const Component = require('../component/Component')

/**
 * A button that creates memory of random dimensions and
 * inserts a {@link MemoryVis} of it into {@link ui.memory.body} 
 * 
 * This class is only meant to be used within {@link MemoryAreaTitleBar}
 * 
 * @memberof module:ui/memory
 */
class AddRandomMemoryButton extends Component {
  constructor(id, container, app) {
    super(`AddRandomMemoryButton[${id}]`)
    this.id = id;
    this.container = container;
    this.app = app;
  }

  render() {
    if ( this.rendered ) { console.log(`[warn] multiple render() calls for ${this.name}. This is a no-op`); return this; }

    this.node = $(`<a class="btn btn-sm btn-success" href="#" id="${this.id}">Add...</a>`).appendTo(this.container)

    this.rendered = true;
    return this;
  }

  useDefaultControls() {
    $('#button-add-memory').on('click', () => {
      const {Memory} = require('../memory-array')
      let m = new Memory("myArray", "int", [1024])
      console.log(m)
      m.render('#heatmap-example')
    })
  }
}

/**
 * Title bar for the memory area
 * 
 * This class is only meant to be used within {@link MemoryArea}
 * 
 * @memberof module:renderer/components/memory
 */
class MemoryAreaTitleBar extends Component {
  constructor(id, container, app) {
    super()
    this.id = id
    this.container = container
    this.app = app
    this.name = `MemoryAreaTitlebar[${this.id}]`
    this.addButton = new AddRandomMemoryButton("button-add-memory", `#${this.id}`, this.app);
  }

  render() {
    this.node = $(`
      <div class="card-header" id="${this.id}">
        <span class="title"><strong>Memory</strong></span> 
      </div>
    `).appendTo(this.container)

    this.addButton.render()

    this.addButton
    return this;
  }

  useDefaultControls() {
    this.addButton.useDefaultControls()
  }
}

module.exports = MemoryAreaTitleBar