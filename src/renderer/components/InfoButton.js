const Component = require('./component')
const Events = require('../events')
const openAboutWindow = require('electron-about-window').default
const path = require('path')

class InfoButton extends Component {
  constructor(id, container, app) {
    super()
    this.id = id
    this.container = container
    this.app = app
    this.node = null
    this.name = `InfoButton[${this.id}]`
    this.rendered = false
    this.app.ui.registerComponent(this)
  }

  render() {
    this.node = $(`
      <div id='${this.id}'>
        <h4><i class="fas fa-info-circle"></i></h4>
      </div>
    `).css("cursor", "pointer")
      .css("float", "right")

    this.node.appendTo(this.container)

    this.app.ui.emit(Events.UI_COMPONENT_READY, this)
    this.rendered = true
    return this
  }
}

function defaultCreate(app) {
  if ( !app)
    throw new InternalError('InfoButton.defaultCreate requires an app reference and none was passed')

  let infoButton = new InfoButton("info-button", "#top-toolbar-right", app).render()

  app.ui.on(Events.UI_READY, () => {
    $(infoButton.node).on('click', () => {
      console.log(app.root)
      openAboutWindow({
        product_name: "KermaView",
        icon_path: app.iconPath,
        package_json_dir: app.root
      })
    })
  })
}

module.exports = {
  InfoButton,
  defaultCreate
}