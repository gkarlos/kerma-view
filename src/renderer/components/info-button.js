const Component = require('./component')

class InfoButton extends Component {
  constructor(id, container) {
    super()
    this.id = id
    this.container = container
    this.node = null
    this.name = "InfoButtom"
  }

  render() {
    this.node = $(`
      <div id='${this.id}'>
        <h4><i class="fas fa-info-circle"></i></h4>
      </div>
    `)

    this.node.css("cursor", "pointer")
             .css("float", "right")

    this.node.appendTo(this.container)
    return this
  }
}


module.exports = (app) => {
  let ui = app.ui

  let infoButton = ui.registerComponent(new InfoButton("info-button", "#top-toolbar-right"))

  infoButton.render()

  ui.emit('component-ready', infoButton)

  $(infoButton.node).on('click', () => {
    app.showAboutPanel({todo: "TODO"})
  })
}