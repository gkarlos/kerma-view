const Component      = require('@renderer/ui/component/Component')
const SettingsButton = require('./SettingsButton')
const NotificationsButton = require('./NotificationButton')
const InfoButton     = require('./InfoButton')
const Events         = require('@renderer/events')
const MenuSeparator  = require('@renderer/ui/MenuSeparator')
const App            = require('@renderer/app')

class UtilityToolbar extends Component {
  constructor(id, container) {
    super(id,container)
    this.notificationButton = new NotificationsButton('notifications-button', `#${this.id}`, App)
    this.separator = new MenuSeparator('utility-bar-separator', `#${this.id}`, App)
    this.settingsButton = new SettingsButton('settings-button', `#${this.id}`, App)
    this.infoButton = new InfoButton('info-button', `#${this.id}`, App)
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
    App.emit(Events.UI_COMPONENT_READY, this)
    return this;
  }

  useDefaultControls() {
    this.settingsButton.useDefaultControls()
    this.infoButton.useDefaultControls()
  }
}

module.exports = UtilityToolbar