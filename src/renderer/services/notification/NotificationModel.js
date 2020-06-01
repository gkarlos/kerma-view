/**
 * Model for a basic notification.
 * 
 * Base class for all other notifications
 * 
 * @memberof module:notification
 */
class NotificationModel {

  /**
   * @param {Object} options
   * @param {String} [options.type] Type of the notification
   * @param {String} [options.title] Title of the notification
   * @param {String} [options.message] Message of the notification
   * @param {String} [options.details] Details of the notification
   */
  constructor(options={}) {
    this.title   = options.title   || ""
    this.message = options.message || ""
    this.details = options.details || ""
    this.type    = options.type    || NotificationModel.Info
  }

  /** Get the title of the notification   */
  getTitle() { return this.title }

  /** Get the message of the notification */
  getMessage() { return this.message }
  
  /** Get the details of the notification */
  getDetails() { return this.details }

  /** 
   * Check if there are details
   * @returns {Boolean}
   */
  hasDetails() { return this.details && this.details.length > 0 }
  
  /** Get the type of the notification    */
  getType()    { return this.type    }

  /**
   * Set the title of the notification
   * @param {String} title 
   */
  setTitle(title) { this.title = title; return this; }
  
  /** 
   * Set the message of the notification 
   * @param {String} msg A message
   */
  setMessage(msg) { this.message = msg; return this; }

  /** 
   * Set the details of the notification 
   * @param {String} details Additional details
   */
  setDetails(details) { this.details = details; return this; }

  /**
   * Set the type of the notification
   * @param {String} type A notification type
   */
  setType(type) { this.type = type; return this; }
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