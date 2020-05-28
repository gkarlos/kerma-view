// const ProgressNotification = require('./ProgressNotification')
const NotificationView = require('./NotificationView')

var BootstrapNotify = undefined

class ProgressNotificationView extends NotificationView {
  /**
   * 
   * @param {ProgressNotification} notification 
   */
  constructor(model) {
    super(model)
  }
}

module.exports = ProgressNotificationView