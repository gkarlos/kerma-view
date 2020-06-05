const NotificationModel = require('./NotificationModel')

/**
 * A progress notification is a notification for which progress can be defined:
 * - A total value is defined (see constructor {@link options.total}) and the notification
 *   is complete only when the value is reached. Current progress is increased by 
 *   {@link module:notification.ProgressNotificationModel#progress}
 * @memberof module:notification
 */
class ProgressNotificationModel extends NotificationModel {

  static INFINITE_IN_PROGRESS = Number.POSITIVE_INFINITY

  static INFINITE_NO_PROGRESS = Number.NEGATIVE_INFINITY
  static   FINITE_NO_PROGRESS = 0

  /**
   * @param {Object} [options]
   * @param {String} [options.type] The notification type
   * @param {String} [options.title] A title for the notification
   * @param {String} [options.message] The actual notification message
   * @param {String} [options.details] Additional details
   * @param {Integer|Infinity} [options.total] Total progress value. If {@link Infinity} progress ends only when {@link ProgressNotification#complete} is called
   */
  constructor(options={}) {
    super({
      type: options.type,
      title: options.title,
      message: options.message,
      details: options.details
    })

    this.total = options.total || 100
    this.currentProgress = 0;

    this.currentProgressInfo = undefined

    this.started = false
    this.completed = false
  }

  /**
   * Retrieve the value of the total progress
   * @returns {Integer|Infinity}
   */
  getTotalProgress() { return this.total }

  /**
   * Retrieve the current progress value.
   * If the total progress was set to {@link Infinity} then this method returns {@link Infinity} as well
   * @returns {Integer|Infinity}
   */
  getCurrentProgress() { return this.currentProgress }

  /**
   * Retrieve the info string associated with the last progress update (if any)
   * @returns {String|null}
   */
  getCurrentProgressInfo() { return this.currentProgressInfo }

  /**
   * Check if this notification is infinite
   * @returns {Boolean}
   */
  isInfinite() { return this.total === Infinity }

  /**
   * Check if the progress has started
   */
  hasStarted() { return this.started != Number.NEGATIVE_INFINITY && this.started > 0}

  /**
   * Force complete the progress.
   * No-op if the progress is completed. See {@link ProgressNotification#isCompleted}
   */
  complete() { 
    if ( !this.isCompleted()) {
      if ( !this.isInfinite())
        this.currentProgress = this.total
      this.completed = true
    }
  }

  /**
   * Check if the this notification has started
   * @returns {bool}
   */
  isStarted() { return this.started }

  /**
   * Check if the progress has completed
   * Always returns false if total progress is set to {@link Infinity}
   */
  isCompleted() { return this.completed }

  /**
   * Update the notifications progress.
   * The notification is considered "started" after the first progress call.
   * A progress call that will result is {@link ProgressNotificationModel#getCurrentProgress() >= 100}
   * is considered completed.
   * 
   * See {@link hasStarted()}
   * 
   * @param {Number} [value]
   */
  progress(value) {
    if (value === undefined || value === null)
      value = 0

    let newValue = Math.min(this.currentProgress + value, this.total);
    
    this.currentProgress = newValue;
    
    if ( this.currentProgress >= this.total)
      this.completed = true
  }
};

module.exports = ProgressNotificationModel

// /**
//  * This callback is fired when {@link module:notification~ProgressNotification} starts
//  * @callback ProgressNotificationOnStartCallback
//  * @returns {void}
//  */

// /**
//  * This callback is fired when {@link module:notification~ProgressNotification} completes
//  * @callback ProgressNotificationOnCompleteCallback
//  * @returns {void}
//  */

// /**
//  * This callback is fired when there is a {@link module:notification~ProgressNotification} progress update
//  * @callback ProgressNotificationOnProgressCallback
//  * @param {string} info The info string passed to the progress update
//  * @param {int|Infinity} oldValue The progress value before the progress update.
//  *        {@link Infinity} if the notification is infinite. See {@link module:notification~ProgressNotification#isInfinite}
//  * @param {int|Infinity} newValue The progress value after the progress update.
//  *        {@link Infinity} if the notification is infinite. See {@link ProgressNotification#isInfinite}
//  * @returns {void}
//  */