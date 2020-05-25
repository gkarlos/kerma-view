/**
 * Model for a basic notification
 * 
 * @class
 * @memberof module:notification
 */
class NotificationModel {

  /**
   * @param {String} type    Type of the notification
   * @param {String} title   Title of the notification
   * @param {String} message Message of the notification
   * @param {String} details Details of the notification
   */
  constructor(type, title, message, details) {
    this.title   = title
    this.message = message
    this.details = details
    this.type    = type
  }

  /** Get the title of the notification   */
  getTitle() { return this.title }

  /** Get the message of the notification */
  getMessage() { return this.message }
  
  /** Get the details of the notification */
  getDetails() { return this.details }
  
  /** Get the type of the notification    */
  getType()    { return this.type    }

  /**
   * Set the title of the notification
   * @param {String} title 
   */
  setTitle(title) { this.title = title}
  
  /** 
   * Set the message of the notification 
   * @param {String} msg A message
   */
  setMessage(msg) { this.message = msg }

  /** 
   * Set the details of the notification 
   * @param {String} details Additional details
   */
  setDetails(details) { this.details = details}

  /**
   * Set the type of the notification
   * @param {String} type A notification type
   */
  setType(type) { this.type = type }

  /**
   * Factory method that creates a success notification
   * 
   * @static
   * @param {String} title Title of the notification
   * @param {String} message Message of the notification
   * @param {String} details Details of the notification
   */
  static createSuccess(title, message, details) {
    return new NotificationModel(Notification.Success, title, message, details)
  }

  /**
   * Factory method that creates an info notification
   * 
   * @static
   * @param {String} title Title of the notification
   * @param {String} message Message of the notification
   * @param {String} details Details of the notification
   */
  static createInfo(title, message, details) {
    return new NotificationModel(Notification.Info, title, message, details)
  }
  
  /**
   * Factory method that creates a warning notification
   * 
   * @static
   * @param {String} title Title of the notification
   * @param {String} message Message of the notification
   * @param {String} details Details of the notification
   */
  static createWarning(title, message, details) {
    return new NotificationModel(Notification.Warning, title, message, details)
  }

  /**
   * Factory method that creates an error notification
   * 
   * @static
   * @param {String} title Title of the notification
   * @param {String} message Message of the notification
   * @param {String} details Details of the notification
   */
  static createError(title, message, details) {
    return new NotificationModel(Notification.Error, title, message, details)
  }
}

/// Workaround for jsdoc to show static non-method members
/// is to define them outside the class. If defined inside
/// the class jsdoc will display them as non-static members

/** 
 * Success Type 
 * @static 
 */
NotificationModel.Success = "success"

/** 
 * Error Type 
 * @static 
 */
NotificationModel.Error = "error"

/** 
 * Info Type 
 * @static 
 */
NotificationModel.Info = "info"

/** 
 * Warning Type 
 * @static 
 */
NotificationModel.Warning = "warning"

module.exports = NotificationModel