'use-strict';

const NotificationView          = require('@renderer/services/notification/NotificationView')

/** @ignore @typedef {import("./ProgressNotificationModel").} ProgressNotificationModel */

/**
 * This callback is part of the {@link module:notification~ProgressNotificationView} class.
 * Fired when the notification progress is updated
 * @callback ProgressNotificationOnProgressChangeCallback
 * @param {ProgressNotificationModel} model The notification model instance
 * @memberof module:notification
 * @returns void
 */

/**
 * This callback is part of the {@link module:notification~ProgressNotificationView} class.
 * Fired when the notification progress is completed
 * @callback ProgressNotificationOnProgressCompleteCallback
 * @param {ProgressNotificationModel} model The notification model instance
 * @memberof module:notification
 * @returns void
 */

 /**
  * @class
  * @memberof module:notification
  * @extends  NotificationView
  * @requires module:notification.NotificationView
  */
class ProgressNotificationView extends NotificationView {
  /**
   * @param {ProgressNotificationModel} model 
   */
  constructor(model) {
    super(model)
    this.viewimpl = undefined

    /** @type {Array.<ProgressNotificationOnProgressChangeCallback>} */
    this.onProgressChangeCallbacks = []
    
    /** @type {Array.<ProgressNotificationOnProgressCompleteCallback>} */
    this.onProgressCompleteCallbacks = []
  }

  /**
   * Register a callback to be invoked when there is a progress update
   * @param {ProgressNotificationOnProgressChangeCallback} callback A callback
   * @returns {Boolean} Whether the callback was registered successfully
   */
  onProgress(callback) {
    if ( typeof callback === 'function') {
      this.onProgressChangeCallbacks.push(callback)
      return true
    }
    return false;
  }

  /**
   * 
   * @param {*} value 
   * @param {*} info 
   */
  progress(value, info) {
    
  }

  _renderError() { 
    return $.notify({
      icon: NotificationView.Icon,
      title: `<strong>${this.model.getTitle()}</strong>`,
      message: this.model.getMessage(),
      newest_on_top: true,
      allow_dismiss: true
    }, {

    })
  }
  _renderInfo() { }
  _renderSuccesss() { }
  _renderWarning() { } 
}

module.exports = ProgressNotificationView