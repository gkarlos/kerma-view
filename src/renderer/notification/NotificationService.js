const Notification         = require('./Notification')
const ProgressNotification = require('./ProgressNotification')
const NotificationView     = require('./NotificationView')

function createNotification(type, msg, details, progress) {
  if ( typeof progress === 'boolean')
    return progress? new ProgressNotification(type, msg, details, 100)
                   : new Notification(type, msg, details)
  else
    return progress? new ProgressNotification(type, msg, details, progress)
                   : new Notification(type, msg, details)
}

/**
 * @memberof module:notification
 */
class NotificationService {
  constructor(app) {
    this.enabled = true
  }

  /** enable the service  */
  enable() { this.enabled = true }
  
  /** disable the service */
  disable() { this.enabled = false}

  /** check if the service is enabled */
  isEnabled() { return this.enabled }

  /** 
   * Show a success notification
   * If the service is disabled this is a no-op
   * 
   * @param {String} msg
   * @param {String} details
   * @param {int} progress 
   * @returns {NotificationView}
   */
  success(msg, details, progress=0) {
    if ( !this.enabled)
      return null
    let notification = createNotification(Notification.Success, msg, details, progress)
    this.viewer.show(notification)
    return notification
  }

  
  /** 
   * Display an error notification
   * If the service is disabled this is a no-op
   * 
   * @param {String} msg
   * @param {String} details
   * @param {int} progress 
   * @returns {NotificationView}
   */
  error(msg, details, progress=0) {
    let notification = createNotification(Notification.Error, msg, details, progress)

    if ( this.enabled)
      this.viewer.show(notification)

    return notification
  }

  /** 
   * Display a warning notification
   * If the service is disabled this is a no-op
   * 
   * @param {String} msg
   * @param {String} details
   * @param {int} progress 
   * @returns {NotificationView}
   */
  warning(msg, details, progress=0) {
    let notification = createNotification(Notification.Warning, msg, details, progress)
    
    if ( this.enabled)
      this.viewer.show(notification)
    
    return notification
  }

  /** 
   * Display a success notification
   * If the service is disabled this is a no-op
   * 
   * @param {String} msg
   * @param {String} details
   * @param {int} progress 
   * @returns {NotificationView}
   */
  info(msg, details, progress=0) {
    if ( this.enabled) {
      let notification = createNotification(Notification.Info, msg, details, progress)
      let notificationView = new NotificationView(notification)
      return notificationView.render()
    }

    return null
  }
  
}

module.exports = NotificationService