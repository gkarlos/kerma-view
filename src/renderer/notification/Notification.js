/**
 * @memberof module:notification
 */
class Notification {
  /**
   * @param {String} message 
   * @param {String} details 
   * @param {String} type 
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
}

/** 
 * Success Type 
 * @static 
 */
Notification.Success = "success"

/** 
 * Error Type 
 * @static 
 */
Notification.Error   = "error"

/** 
 * Info Type 
 * @static 
 */
Notification.Info   = "info"

/** 
 * Warning Type 
 * @static 
 */
Notification.Warning   = "warning"

module.exports = Notification