const NotificationType = require('./NotificationType')

/** @ignore @typedef {import("./NotificationType").} NotificationType */

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
   * @param {NotificationType} [options.type] Type of the notification
   * @param {String} [options.title] Title of the notification
   * @param {String} [options.message] Message of the notification
   * @param {String} [options.details] Details of the notification
   */
  constructor(options={}) {
    this.title   = options.title   || ""
    this.message = options.message || ""
    this.details = options.details || ""
    this.type    = options.type    || NotificationType.Default
  }

  /** 
   * Get the title of the notification   
   * @returns {String} 
   */
  getTitle() { return this.title }

  /** 
   * Get the message of the notification 
   * @returns {String} 
   */
  getMessage() { return this.message }
  
  /** Get the details of the notification 
   * @returns {String}
   */
  getDetails() { return this.details }

  /** 
   * Check if there are details
   * @returns {Boolean}
   */
  hasDetails() { return this.details && this.details.length > 0 }
  
  /** 
   * Get the type of the notification
   * @returns {NotificationType}
   */
  getType()    { return this.type    }

  /**
   * Set the title of the notification
   * @param {String} title 
   * @returns {NotificationModel} self
   */
  setTitle(title) { this.title = title; return this; }
  
  /** 
   * Set the message of the notification 
   * @param {String} msg A message
   * @returns {NotificationModel} self
   */
  setMessage(msg) { this.message = msg; return this; }

  /** 
   * Set the details of the notification 
   * @param {String} details Additional details
   * @returns {NotificationModel} self
   */
  setDetails(details) { this.details = details; return this; }

  /**
   * Set the type of the notification
   * @param {module:notification.NotificationType} type A notification type
   * @returns {NotificationModel} self
   */
  setType(type) { 
    this.type = type; return this; 
  }
}

/// Workaround for jsdoc to show static non-method members
/// is to define them outside the class. If defined inside
/// the class jsdoc will display them as non-static members

NotificationModel.Type = NotificationType

module.exports = NotificationModel