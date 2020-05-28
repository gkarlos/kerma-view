'use strict';

const NotificationModel = require('./NotificationModel')

// we will lazily load the module the first time render is called
var BootstrapNotify = undefined

/**
 * This callback is part of the {@link module:notification~NotificationHandler} class.
 * Fired when the notification is shown
 * @callback NotificationViewOnShowCallback
 * @param {NotificationModel} model The notification model instance
 * @returns void
 */

/**
 * This callback is part of the {@link module:notification~NotificationHandler} class.
 * Fired when the notification is manually closed
 * @callback NotificationViewOnHideCallback
 * @param {NotificationModel} model The notification model instance
 * @returns void
 */

/**
 * This callback is part of the {@link module:notification~NotificationHandler} class.
 * Fired when the notification data is changed
 * @callback NotificationViewOnChangeCallback
 * @param {NotificationModel} model The notification model instance
 * @returns void
 */

/**
 * This class renders a notification to the DOM
 * 
 * To avoid undecessary complexity (as the use cases are minimal for now)
 * this class acts both as a view and a handler for notifications. That is,
 * the {@link module:notification~NotificationService} operates (and returns)
 * these object.
 * 
 * In the future we may explicitely add a NotificationHandler if the use cases
 * get more complicated
 * 
 * @memberof module:notification
 */
class NotificationView {

  /**
   * @param {NotificationModel} model The model of this view
   */
  constructor(model) {
    this.model = model
    this.viewimpl = undefined
    /** @type {Array.<NotificationViewOnShowCallback>}  */
    this.onShowCallbacks = []
    /** @type {Array.<NotificationViewOnHideCallback>}  */
    this.onHideCallbacks = []
    /** @type {Array.<NotificationViewOnChangeCallback>} */
    this.onChangeCallbacks = []

  }

  /**
   * Retrieve the notification model
   * @returns {NotificationModel}
   */
  getModel() { return this.model }

  /**
   * Update the title of the notification
   * 
   * @param {String} title 
   */
  udpateTitle(title) { 
    this.model.setTitle(title)
    if ( this.viewimpl)
      this.viewimpl.update('title', title)
    this.onChangeCallbacks.forEach(callback => callback(model))
    return this;
  }

  /**
   * Update the message of the notification
   * 
   * @param {String} message 
   */
  updateMessage(message) {
    this.model.setMessage(message)
    if ( this.viewimpl)
      this.viewimpl.update('message', message)
    this.onChangeCallbacks.forEach(callback => callback(this.model))
    return this;
  }

  /**
   * Update the details of the notification
   * 
   * @param {String} details 
   */
  updateDetails(details) {
    this.model.setDetails(details)
    //todo update viewimpl details
    this.onChangeCallbacks.forEach(callback => callback(this.model))
    return this;
  }

  /** Show the notification */
  show() {  
    if ( !BootstrapNotify)
      BootstrapNotify = require('bootstrap-notify')

    if ( this.viewimpl)
      delete this.viewimpl

    this.viewimpl = this._renderNotification()

    this.onShowCallbacks.forEach(callback => callback(this.model))
    return this;
  }

  /** Hide the notification */
  hide() { 
    this.viewimpl.close() 
    this.onHideCallbacks.forEach(callback => callback(this.model))
    return this;
  }

  /**
   * Register a callback to fired when the notification is displayed
   * @param {NotificationViewOnShowCallback} callback 
   */
  onShow(callback) { this.onShowCallbacks.push(callback) }

  /**
   * Register a callback to be fired when the notification gets (manually) closed
   * That is, the callback will only be called when {@link NotificationHandler#hide} is called
   * @param {NotificationViewOnHideCallback} callback 
   */
  onHide(callback) { this.onHideCallbacks.push(callback) }

  /**
   * Register a callback to be fired when the notification data changes
   * e.g on {@link NotificationHandler#updateTitle}
   * @param {NotificationViewOnChangeCallback} callback 
   */
  onChange(callback) { this.onChangeCallbacks.push(callback) } 

  /// inner methods

  _renderNotification() {
    switch(this.model.type) {
      case NotificationModel.Error:
        return this._renderError()
      case NotificationModel.Info:
        return this._renderInfo()
      case NotificationModel.Success:
        return this._renderSuccesss()
      case NotificationModel.Warning:
        return this._renderWarning()
      default:
        throw new Error(`Unknown type: '${this.model.type}'`)
    }
  }

  _renderError() {
    return $.notify(
      {
        icon: 'fa fa-info-circle',
        newest_on_top: true,
        allow_dismiss: true,
        title: `<strong>${this.model.getTitle()}</strong>`,
        message: this.model.getMessage()
      }
      ,
      {
        mouse_over: 'pause',
        delay: 2000,
        type: 'danger',
        animate: {
          enter: 'animated fadeInDown',
          exit: 'animated fadeOutUp'
        },
        placement : {
          from: "bottom",
          align: "right"
        }
      }
    )
  }

  _renderInfo() {
    return $.notify(
      {
        icon: 'fa fa-info-circle',
        newest_on_top: true,
        allow_dismiss: true,
        title: `<strong>${this.model.getTitle()}</strong>`,
        message: this.model.getMessage()
      }
      ,
      {
        mouse_over: 'pause',
        delay: 2000,
        type: 'info',
        animate: {
          enter: 'animated fadeInDown',
          exit: 'animated fadeOutUp'
        },
        placement : {
          from: "bottom",
          align: "right"
        }
      }
    )
  }

  _renderSuccesss() {
    return $.notify(
      {
        icon: 'fa fa-info-circle',
        newest_on_top: true,
        allow_dismiss: true,
        title: `<strong>${this.model.getTitle()}</strong>`,
        message: this.model.getMessage()
      }
      ,
      {
        mouse_over: 'pause',
        delay: 2000,
        type: 'success',
        animate: {
          enter: 'animated fadeInDown',
          exit: 'animated fadeOutUp'
        },
        placement : {
          from: "bottom",
          align: "right"
        }
      }
    )
  }

  _renderWarning() {
    return $.notify(
      {
        icon: 'fa fa-info-circle',
        newest_on_top: true,
        allow_dismiss: true,
        title: `<strong>${this.model.getTitle()}</strong>`,
        message: this.model.getMessage()
      }
      ,
      {
        mouse_over: 'pause',
        delay: 2000,
        type: 'warning',
        animate: {
          enter: 'animated fadeInDown',
          exit: 'animated fadeOutUp'
        },
        placement : {
          from: "bottom",
          align: "right"
        }
      }
    )
  }
}

module.exports = NotificationView