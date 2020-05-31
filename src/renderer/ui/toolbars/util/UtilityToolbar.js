const Component      = require('@renderer/ui/component/Component')
const SettingsButton = require('./SettingsButton')
const NotificationsButton = require('./NotificationButton')
const InfoButton     = require('./InfoButton')
const Events         = require('@renderer/events')
const MenuSeparator  = require('@renderer/ui/MenuSeparator')

class UtilityToolbar extends Component {
  constructor(id, container, app) {
    super(`UtilityToolbar[${id}]`)

    this.id = id
    this.container = container
    this.app = app
    this.notificationButton = new NotificationsButton('notifications-button', `#${this.id}`, this.app)
    this.separator = new MenuSeparator('utility-bar-separator', `#${this.id}`, this.app)
    this.settingsButton = new SettingsButton('settings-button', `#${this.id}`, this.app)
    this.infoButton = new InfoButton('info-button', `#${this.id}`, this.app)
  }

  render() {
    this.node = $(`
      <div id="${this.id}">
      </div>
    `).appendTo(this.container)
    this.node.css('float', 'right').css("display", "flex")

    this.notificationButton.render()
    this.separator.render()
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