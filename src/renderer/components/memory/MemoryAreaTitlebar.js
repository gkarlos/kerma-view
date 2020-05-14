const Component = require('../component')

class MemoryAreaTitleBar extends Component {
  constructor(id, container, app) {
    super()
    this.id = id
    this.container = container
    this.app = app
    this.name = `MemoryAreaTitlebar[${this.id}]`
  }

  render() {
    this.node = $(`
      <div class="card-header">
        <span class="title"><strong>Memory</strong></span> 
        <a class="btn btn-sm btn-success" href="#" id="button-add-memory">Add...</a>
      </div>
    `).appendTo(this.container)

    $('#button-add-memory').on('click', () => {
      const {Memory} = require('../memory-array')
      let m = new Memory("myArray", "int", [1024])
      console.log(m)
      m.render('#heatmap-example')
    })

    return this;
  }
}

module.exports = MemoryAreaTitleBar