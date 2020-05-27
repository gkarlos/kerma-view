const NotificationModel = require('./NotificationModel')

/**
 * @memberof module:notification
 */
class ProgressNotificationModel extends NotificationModel {

  /**
   * @param {Object} options 
   * @param {String} [options.type] A title for the notification
   * @param {String} [options.message] The actual notification message
   * @param {String} [options.details] Additional details
   * @param {Integer|Infinity} total Total progress value. If {@link Infinity} progress ends only when {@link ProgressNotification#complete} is called
   */
  constructor(options={}) {
    super({
      type: options.type,
      title: options.title,
      message: options.message,
      details: options.details
    })

    this.total = options.total | 100

    this.currentProgress = this.total === Infinity? Infinity : 0
    this.currentProgressInfo = undefined
    this.onStartCallbacks = []
    this.onStopCallbacks = []
    this.onProgressCallbacks = []
    this.onCompleteCallbacks = []
    this.started = false
    this.completed = false
  }

  getTotal() { return this.total }

  /**
   * Check if this notification is infinite
   */
  isInfinite() { return this.total === Infinity }

  /**
   * Retrieve the current progress value.
   * If the total progress was set to {@link Infinity} then this method returns {@link Infinity} as well
   */
  getCurrentProgress() { return this.currentProgress }

  /**
   * Start the progress of this notification.
   * This is a no-op if the notification has stopped and registered **onStart** callbacks are not invoked
   */
  start() { 
    this.started = true 
    this.onStartCallbacks.forEach(cb => cb())
  }

  /**
   * Force complete the progress.
   * No-op if the progress is completed. See {@link ProgressNotification#isCompleted}
   * All callbacks registered with {@link ProgressNotification#onComplete} are fired
   */
  complete() { 
    if ( !this.isCompleted) {
      if ( !this.isInfinite)
        this.currentProgress = this.total
      this.completed = true
      this.onCompletenCallbacks.forEach(cb => cb())
    }
  }

  /**
   * Check if the this notification has started
   */
  isStarted() { return this.started }

  /**
   * Check if the progress has completed
   * Always returns false if total progress is set to {@link Infinity}
   */
  isCompleted() { return this.completed }

  /**
   * Update the progress. No-op if the notification has not started.
   * See {@link hasStarted()}
   * 
   * If this is an infinite notification {@link ProgressNotification#isInfinite} the
   * *value* parameter is ignored
   * 
   * @param {Number} value 
   * @param {String} info 
   */
  progress(value, info) {
    if ( this.isStarted()) {

      if ( this.isInfinite() ) {
        this.onProgressCallbacks.forEach( cb => cb(info, Infinity, Infinity))
      }
      else {
        let oldValue = this.currentProgress;
        let newValue = Math.min(this.currentProgress + value, this.total);
    
        this.currentProgress = newValue;
        this.currentProgressInfo = info | undefined
    
        this.onProgressCallbacks.forEach( cb => cb(oldValue, newValue))

        if ( this.isCompleted())
          this.onCompletenCallbacks.forEach( cb => cb()) 
      }
    }
  }

  /**
   * Set a callback to be fired when the progress starts
   * 
   * @param {ProgressNotificationOnStartCallback} callback 
   */
  onStart(callback) { 
    this.onStartCallbacks.push(callback)
  }

  /**
   * Set a callback to be fired when the progress changes
   * 
   * @param {ProgressNotificationOnProgressCallback} callback Fired when progress changes
   */
  onProgress(callback) { 
    this.onProgressCallbacks.push(callback)   
  }
};

module.exports = ProgressNotificationModel

/**
 * This callback is fired when {@link module:notification~ProgressNotification} starts
 * @callback ProgressNotificationOnStartCallback
 * @returns {void}
 */

/**
 * This callback is fired when {@link module:notification~ProgressNotification} completes
 * @callback ProgressNotificationOnCompleteCallback
 * @returns {void}
 */

/**
 * This callback is fired when there is a {@link module:notification~ProgressNotification} progress update
 * @callback ProgressNotificationOnProgressCallback
 * @param {string} info The info string passed to the progress update
 * @param {int|Infinity} oldValue The progress value before the progress update.
 *        {@link Infinity} if the notification is infinite. See {@link module:notification~ProgressNotification#isInfinite}
 * @param {int|Infinity} newValue The progress value after the progress update.
 *        {@link Infinity} if the notification is infinite. See {@link ProgressNotification#isInfinite}
 * @returns {void}
 */