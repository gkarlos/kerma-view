'use strict';

const NotificationModel = require('@renderer/services/notification/NotificationModel')

const BootstrapNotify   = require('@lib/bootstrap-notify')

/** @ignore @typedef {import("./NotificationModel").} NotificationModel */

/**
 * This callback is part of the {@link module:notification.NotificationView} class.
 * Fired when the notification is shown
 * @callback NotificationOnShowCallback
 * @param {NotificationModel} model The notification model instance
 * @memberof module:notification
 * @returns void
 */

/**
 * This callback is part of the {@link module:notification.NotificationView} class.
 * Fired when the notification is manually closed
 * @callback NotificationOnHideCallback
 * @param {NotificationModel} model The notification model instance
 * @memberof module:notification
 * @returns void
 */

/**
 * This callback is part of the {@link module:notification.NotificationView} class.
 * Fired when the notification data is changed
 * @callback NotificationOnChangeCallback
 * @param {NotificationModel} model The notification model instance
 * @memberof module:notification
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
 * @class
 * @memberof module:notification
 * @requires module:notification.NotificationModel
 * @requires module:notification.NotificationView
 * @requires bootstrap-notify<external>
 */
class NotificationView {

  /**
   * @param {NotificationModel} model The model of this view
   */
  constructor(model) {
    /** 
     * @private 
     * @type {NotificationModel}
     * */
    this.model = model
    /**
     * Reference to bootstrap-notify's notifcation object
     */
    this.viewimpl = undefined
    /** @type {Array.<NotificationOnShowCallback>}   */
    this.onShowCallbacks = []
    /** @type {Array.<NotificationOnHideCallback>}  */
    this.onHideCallbacks = []
    /** @type {Array.<NotificationOnChangeCallback>} */
    this.onChangeCallbacks = []

    this.sticky = false
  }

  /** 
   * Make the notification sticky
   * @returns {NotificationView} self
   */
  stick() {
    this.sticky = true
    return this;
  }

  /** 
   * Check if the notification is sticky
   * @returns {Boolean}
   */
  isSticky() {
    return this.sticky
  }

  /**
   * Retrieve the notification model
   * 
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
    this.onChangeCallbacks.forEach(callback => callback(this.model))
    return this;
  }

  /**
   * Update the type of the notification
   * 
   * @param {*} type 
   */
  updateType(type) {
    this.model.setType(type)
    if ( this.viewimpl) {
      this.viewimpl.update('type', this.model.getType())
      switch(type) {
        case NotificationModel.Type.Info    : this.viewimpl.update('icon', NotificationView.Icon.Info); break;
        case NotificationModel.Type.Error   : this.viewimpl.update('icon', NotificationView.Icon.Error); break;
        case NotificationModel.Type.Success : this.viewimpl.update('icon', NotificationView.Icon.Success); break;
        case NotificationModel.Type.Warning : this.viewimpl.update('icon', NotificationView.Icon.Warning); break;
        case NotificationModel.Type.Default : this.viewimpl.update('icon', NotificationView.Icon.Info); break;
        default : throw new Error(`Unknown Notification type: ${type}`)
      }
    }
    this.onChangeCallbacks.forEach(callback => callback(this.model))
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
    //TODO update viewimpl details
    this.onChangeCallbacks.forEach(callback => callback(this.model))
    return this;
  }


  /**
   * Change the notification to a success
   * @returns {NotificationView} self
   */
  success() { 
    if( this.model.getType() != NotificationModel.Success) 
      this.updateType(NotificationModel.Success) 
    return this
  }

  /**
   * Change the notification to an error
   * @returns {NotificationView} self
   */
  error() {
    if ( this.model.getType() != NotificationModel.Error)
      this.updateType(Notification.Error)
    return this
  }


  /**
   * Show the notification 
   * @returns {NotificationView} self
   */
  show() { 
    if ( this.viewimpl)
      delete this.viewimpl
    this.viewimpl = this._renderNotification()
    this.onShowCallbacks.forEach(callback => callback(this.model))
    return this;
  }

  /**
   * Hide the notification 
   * @returns {this}
   */
  hide() { 
    setTimeout(() => {
      this.onHideCallbacks.forEach(callback => callback(this.model))
      this.viewimpl.close()
    }, NotificationView.HideDelay)
    return this;
  }

  /**
   * Register a callback to be invoked when the notification is displayed
   * That is, the callback will be called when {@link NotificationView#show} is called
   * 
   * @param {NotificationOnShowCallback} callback A callback
   * @returns {Boolean} Whether the callback was registered successfully
   */
  onShow(callback) { 
    if ( typeof callback === 'function')
      this.onShowCallbacks.push(callback) 
    return this
  }

  /**
   * Register a callback to be invoked when the notification gets (manually) closed
   * That is, the callback will be called when {@link NotificationView#show} is called
   * 
   * @param {NotificationOnHideCallback} callback A callback
   * @returns {Boolean} Whether the callback was registered successfully
   */
  onHide(callback) { 
    if ( typeof callback === 'function')
      this.onHideCallbacks.push(callback) 
    return this
  }

  /**
   * Register a callback to be fired when the notification data changes
   * e.g on {@link NotificationHandler#updateTitle}
   * @param {NotificationOnChangeCallback} callback A callback
   * @returns {NotificationView}
   */
  onChange(callback) {
    if ( typeof callback === 'function')
      this.onChangeCallbacks.push(callback) 
    return this
  } 


  //// Protected ///

  /** @protected */
  _renderNotification() {
    switch(this.model.type) {
      case NotificationModel.Type.Error:
        return this._renderError()
      case NotificationModel.Type.Info: 
        return this._renderInfo()
      case NotificationModel.Type.Success:
        return this._renderSuccesss()
      case NotificationModel.Type.Warning:
        return this._renderWarning()
      case NotificationModel.Type.Default:
        return this._renderDefault()
      default:
        throw new Error(`Unknown type: '${this.model.type}'`)
    }
  }

  
  /** @protected */
  _renderTitle() {
    return `<strong>${this.model.getTitle()}</strong>`
  }


  /** @protected */
  _renderDetails() {
    return this.model.hasDetails()? ` <span class="text-muted"> ${this.model.getDetails()}</span>` : ""
  }


  /** @protected */
  _renderMessage() {
    return this.model.getMessage() + this._renderDetails()
  }


  /** @protected */
  _renderError() { 
    return $.notify({
      icon: NotificationView.Icon.Error,
      title: this._renderTitle(),
      message: this._renderMessage()
    }, 
    {
      allow_dismiss: NotificationView.Dismissable,
      showProgressbar: false,
      type   : 'danger',
      delay  : this.isSticky()? 0 : NotificationView.Duration,
      offset : 2,
      placement : NotificationView.Position,
      template  : NotificationView.Template,
      animate: NotificationView.Animation
    })
  }


  /** @protected */
  _renderInfo() {
    return $.notify({
      icon: NotificationView.Icon.Info,
      title: this._renderTitle(),
      message: this._renderMessage()
    }, 
    {
      allow_dismiss: NotificationView.Dismissable,
      showProgressbar: false,
      type   : 'info',
      delay  : this.isSticky()? 0 : NotificationView.Duration,
      offset : 2,
      placement : NotificationView.Position,
      template  : NotificationView.Template,
      animate: NotificationView.Animation
    })
  }


  /** @protected */
  _renderSuccesss() {
    return $.notify({
      icon: NotificationView.Icon.Info,
      title: this._renderTitle(),
      message: this._renderMessage()
    }, 
    {
      allow_dismiss: NotificationView.Dismissable,
      showProgressbar: false,
      type   : 'success',
      delay  : this.isSticky()? 0 : NotificationView.Duration,
      offset : 2,
      placement : NotificationView.Position,
      template  : NotificationView.Template,
      animate: NotificationView.Animation
    })
  }


  /** @protected */
  _renderWarning() {
    return $.notify({
      icon: NotificationView.Icon.Warning,
      title: this._renderTitle(),
      message: this._renderMessage()
    }, {
      allow_dismiss: NotificationView.Dismissable,
      showProgressbar: false,
      type   : 'warning',
      delay  : this.isSticky()? 0 : NotificationView.Duration,
      offset : 2,
      animate   : NotificationView.Animation,
      placement : NotificationView.Position,
      template  : NotificationView.Template
    })
  }

  /** @protected */
  _renderDefault() {
    return $.notify({
      icon: NotificationView.Icon.Default,
      title: this._renderTitle(),
      message: this._renderMessage()
    }, {
      allow_dismiss: NotificationView.Dismissable,
      showProgressbar: true,
      type   : 'dark',
      delay  : this.isSticky()? 0 : NotificationView.Duration,
      offset : 2,
      animate   : NotificationView.Animation,
      placement : NotificationView.Position,
      template  : NotificationView.Template
    })
  }
}

/** 
 * Default icons used for the various notifications
 * @static
 * @protected
 */
NotificationView.Icon = {
  /** Default Info Icon        */Info    : 'fa fa-info-circle',
  /** Default Error Icon       */Error   : 'fas fa-times-circle',
  /** Default Success Icon     */Success : 'fa fa-check-circle',
  /** Default Warning Icon     */Warning : 'fa fa-exclamation-triangle',
  /** Default Notification Icon*/Default : 'fa fa-info-circle'
}

/**
 * The notification template
 * @static
 */
NotificationView.Template = `
  <div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">
    <button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>
    <span data-notify="icon"></span>
    <span data-notify="title">{1}</span>
    <span data-notify="message">{2}</span>
  </div>`

/** @static */
NotificationView.Animation = { exit: 'animate__animated animate__fadeOutRight' }
/** @static */
NotificationView.Position  = { from: "bottom", align: "right" }
/** @static */
NotificationView.Duration  = 5000
/** @static */
NotificationView.Dismissable = true

/**
 * Delay (in ms) for when the notification dissappers after hide() is called 
 * @static
 * @protected 
 */
NotificationView.HideDelay = 350

module.exports = NotificationView