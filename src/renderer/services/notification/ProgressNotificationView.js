'use-strict';

require('lobibox/js/lobibox')

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
  * @extends module:notification.NotificationView
  * @requires module:notification.NotificationView
  */
class ProgressNotificationView extends NotificationView {

  /**
   * @param {ProgressNotificationModel} model 
   */
  constructor(model) {
    super(model)

    /** @type {Array.<ProgressNotificationOnProgressChangeCallback>} */
    this.onProgressChangeCallbacks = []
    
    /** @type {Array.<ProgressNotificationOnProgressCompleteCallback>} */
    this.onProgressCompleteCallbacks = []

    /** @type {Array.<ProgressNotificationOnClickCallbacks>} */
    this.updates = []
  }

  /**
   * Register a callback to be invoked when there is a progress update
   * @param {ProgressNotificationOnProgressChangeCallback} callback A callback
   * @returns {ProgressNotificationView} self
   */
  onProgress(callback) {
    if ( typeof callback === 'function')
      this.onProgressChangeCallbacks.push(callback)
    return this;
  }

  /**
   * Register a callback to be invoked when the progress completes
   * @param {ProgressNotificationOnProgressChangeCallback} callback A callback
   * @returns {ProgressNotificationView} self
   */
  onComplete(callback) {
    if ( typeof callback === 'function')
      this.onProgressCompleteCallbacks.push(callback)
    return this;
  }

  /**
   * 
   * @param {Integer} value 
   * @param {String} info 
   */
  progress(value, info) {
    if ( !this.model.isCompleted()) {
      if ( !this.viewimpl)
        this.show()
        
      this.model.progress(value)
      this.model.setDetails(info)

      if ( info) 
        this.viewimpl.update('message', this._renderMessage())
      this.viewimpl.update('progress', this.model.getCurrentProgress())

      this.onProgressChangeCallbacks.forEach(callback => callback(this.model)) 
      
      if ( this.model.isCompleted()) {
        setTimeout(() => {
          this.onProgressCompleteCallbacks.forEach(callback => callback(this.model))
          if ( !this.isSticky())
            this.hide()
        }, ProgressNotificationView.OnCompleteDelay)
      }  
    }

    return this
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
      showProgressbar: true,
      type   : 'danger',
      delay  : 0,
      offset : 2,
      animate   : NotificationView.Animation,
      placement : NotificationView.Position,
      template  : ProgressNotificationView.Template
    })
  }

  /** @protected */
  _renderInfo() { 
    return $.notify({
      icon: NotificationView.Icon.Info,
      title: this._renderTitle(),
      message: this._renderMessage(),
    }, 
    {
      allow_dismiss: NotificationView.Dismissable,
      showProgressbar: true,
      type   : 'info',
      delay  : 0,
      offset : 2,
      animate   : NotificationView.Animation,
      placement : NotificationView.Position,
      template  : ProgressNotificationView.Template
    })
  }

  /** @protected */
  _renderSuccesss() { 
    return $.notify({
      icon: NotificationView.Icon.Success,
      title: this._renderTitle(),
      message: this._renderMessage()
    }, {
      allow_dismiss: NotificationView.Dismissable,
      showProgressbar: true,
      type   : 'success',
      delay  : 0,
      offset : 2,
      animate   : NotificationView.Animation,
      placement : NotificationView.Position,
      template  : ProgressNotificationView.Template
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
      showProgressbar: true,
      type   : 'warning',
      delay  : 0,
      offset : 2,
      animate   : NotificationView.Animation,
      placement : NotificationView.Position,
      template  : ProgressNotificationView.Template
    })
  } 

  /** @protected */
  _renderDefault() {
    return $.notify({
      icon: NotificationView.Icon.Success,
      title: this._renderTitle(),
      message: this._renderMessage()
    }, {
      allow_dismiss: NotificationView.Dismissable,
      showProgressbar: true,
      type   : 'dark',
      delay  : 0,
      offset : 2,
      animate   : NotificationView.Animation,
      placement : NotificationView.Position,
      template  : ProgressNotificationView.Template
    })
  }
}

/**
 * @static
 * The notification template
 */
ProgressNotificationView.Template = `
  <div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">
    <button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>
    <span data-notify="icon"></span>
    <span data-notify="title">{1}</span>
    <span data-notify="message">{2}</span>
    <div class="progress" data-notify="progressbar">
      <div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>
    </div>
  </div>`

/**
 * @static
 * Delay (in ms) after the progress is completed and before hide() is called 
 */
ProgressNotificationView.OnCompleteDelay = 1000

module.exports = ProgressNotificationView