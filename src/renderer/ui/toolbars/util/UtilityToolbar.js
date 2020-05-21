const Component      = require('../../component/Component')
const SettingsButton = require('./SettingsButton')
const InfoButton     = require('./InfoButton')
const Events         = require('renderer/events')

class UtilityToolbar extends Component {
  constructor(id, container, app) {
    super(`UtilityToolbar[${id}]`)

    this.id = id
    this.container = container
    this.app = app
    this.settingsButton = new SettingsButton('settings-button', `#${this.id}`, this.app)
    this.infoButton = new InfoButton('info-button', `#${this.id}`, this.app)
  }

  render() {
    this.node = $(`
      <div id="${this.id}">
      </div>
    `).appendTo(this.container)
    this.node.css('float', 'right').css("display", "flex")

    this.settingsButton.render()
    this.infoButton.render()
    this.rendered = true;
    this.app.emit(Events.UI_COMPONENT_READY, this)
    return this;
  }

  useDefaultControls() {
    this.settingsButton.useDefaultControls()
    this.infoButton.useDefaultControls()
  }
}

module.exports = UtilityToolbar