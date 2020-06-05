const App = require('@renderer/app')

const Service                   = require('@renderer/services/Service')
const NotificationModel         = require('@renderer/services/notification/NotificationModel')
const ProgressNotificationModel = require('@renderer/services/notification/ProgressNotificationModel')
const NotificationView          = require('@renderer/services/notification/NotificationView')
const ProgressNotificationView  = require('@renderer/services/notification/ProgressNotificationView')


var Log = null

/** @memberof module:notification */
class NotificationService extends Service {
  
  /**
   * @param {module:app.App} app A reference to the App instance
   */
  constructor(app) {
    super("NotificationService")
    
    /** @ignore @type {import("@renderer/app")} */
    this.app = app;

    /** @type {NotificationService.NotificationType} */
    this.NotificationType = NotificationService.NotificationType

    Log = this.app.Logger

    // Toggle the service when the notification button is pressed
    App.ui.toolbar.util.notificationButton.onClick( () => this.isEnabled()? this.disable() : this.enable())
  }

  /** enable the service  */
  enable() { 
    super.enable(); 
    Log.info("Notifications enabled")
    return this;
  }
  
  /** disable the service */
  disable() { 
    super.disable(); 
    $.notifyClose();
    Log.info("Notifications disabled")
    return this;
  }

  /**
   * @private
   * @param {module:notification.NotificationService.NotificationType} type 
   * @param {String} message 
   * @param {Object} opts 
   */
  _doNotify(type, message, opts) {
    let model, view
    console.log(type, opts)

    if( opts.progress) {
      model = new ProgressNotificationModel({ type: type, message: message, title: opts.title,  details: opts.details, total: opts.total, sticky: opts.sticky})
      view = new ProgressNotificationView(model)
      if (opts.onProgress && typeof opts.onProgress === 'function')
        view.onProgress(opts.onProgress)
      if ( opts.onComplete && typeof opts.onComplete === 'function')
        view.onComplete(opts.onComplete)
      if ( opts.changeOnComplete) {
        switch ( opts.changeOnComplete) {
          case NotificationService.NotificationType.Info:
          case NotificationService.NotificationType.Success:
          case NotificationService.NotificationType.Error:
          case NotificationService.NotificationType.Warning:
            view.onComplete(() => view.updateType(opts.changeOnComplete)); break;
          default:
            throw new Error(`Invalid value for opts.changeOnCopmlete '${opts.changeOnComplete}'`); break;
        }   
      }
    } else {
      model = new NotificationModel({ type: type, message: message, title: opts.title, details: opts.details, sticky: opts.sticky})
      view = new NotificationView(model)
    }

    if ( opts.sticky)
      view.stick()

    if ( opts.onShow   && typeof opts.onShow   === 'function') view.onShow(opts.onShow)
    if ( opts.onHide   && typeof opts.onHide   === 'function') view.onHide(opts.onHide)
    if ( opts.onChange && typeof opts.onChange === 'function') view.onChange(opts.onChange)

    if ( !this.isDisabled())
      view.show()

    return view
  }

  
  /** 
   * Show an info notification, optionally with progress bar
   * 
   * If the service is disabled this is a no-op
   * 
   * @param {String}  message         The main message of the notification
   * @param {Object}  opts            Additional options
   * @param {String}  [opts.title]    A title for the notification
   * @param {String}  [opts.details]  Additional info for the notification
   * @param {Boolean} [opts.sticky]   If set, the notification will stay open until manually closed
   * @param {Boolean} [opts.progress] If set, the notification will display a progress bar. Progress can be then updated throw the return value handle.
   * @param {module:notification.NotificationService.NotificationType}  [opts.changeOnComplete] If set and {@link opts.progress} is set, the notification will change type upon progress completion.
   * @param {module:notification.NotificationOnShowCallback}   [opts.onShow]   A callback to be invoked when the notification shows
   * @param {module:notification.NotificationOnHideCallback}   [opts.onHide]   A callback to be invoked when the notification hides
   * @param {module:notification.NotificationOnChangeCallback} [opts.onChange] A callback to be invoked when the notification data changes
   * @param {module:notification.ProgressNotificationOnProgressCallback} [opts.onProgress] A callback to be invoked when progress changes. Ignored if not {opts.progress}
   * @param {module:notification.ProgressNotificationOnCompleteCallback} [opts.onComplete] A callback to be invoked when progress completes Ignored if not {opts.progress}
   * @returns {(NotificationView|ProgressNotificationView)} A handle for the notification if one was created, otherwise {@link null}
   */
  info(message="", opts={}) {
    return this._doNotify(NotificationService.NotificationType.Info, message, opts)
  }

  /** 
   * Show warning notification, optionally with progress bar
   * 
   * If the service is disabled this is a no-op
   * 
   * @param {String}  message         The main message of the notification
   * @param {Object}  opts            Additional options
   * @param {String}  [opts.title]    A title for the notification
   * @param {String}  [opts.details]  Additional info for the notification
   * @param {Boolean} [opts.sticky]   If set, the notification will stay open until manually closed
   * @param {Boolean} [opts.progress] If set the notification will display a progress bar. Progress can be then updated throw the return value handle.
   * @param {module:notification.NotificationService.NotificationType}  [opts.changeOnComplete] If set and {@link opts.progress} is set, the notification will change type upon progress completion.
   * @param {module:notification.NotificationOnShowCallback}   [opts.onShow]   A callback to be invoked when the notification shows
   * @param {module:notification.NotificationOnHideCallback}   [opts.onHide]   A callback to be invoked when the notification hides
   * @param {module:notification.NotificationOnChangeCallback} [opts.onChange] A callback to be invoked when the notification data changes
   * @param {module:notification.ProgressNotificationOnProgressCallback} [opts.onProgress] A callback to be invoked when progress changes. Ignored if not {opts.progress}
   * @param {module:notification.ProgressNotificationOnCompleteCallback} [opts.onComplete] A callback to be invoked when progress completes Ignored if not {opts.progress}
   * @returns {(NotificationView|ProgressNotificationView)} A handle for the notification if one was created, otherwise {@link null}
   */
  warning(message="", opts={}) {
    return this._doNotify(NotificationService.NotificationType.Warning, message, opts)
  }

  /** 
   * Show an error notification, optionally with progress bar
   * 
   * If the service is disabled this is a no-op
   * 
   * @param {String}  message         The main message of the notification
   * @param {Object}  opts            Additional options
   * @param {String}  [opts.title]    A title for the notification
   * @param {String}  [opts.details]  Additional info for the notification
   * @param {Boolean} [opts.sticky]   If set, the notification will stay open until manually closed
   * @param {Boolean} [opts.progress] If set the notification will display a progress bar. Progress can be then updated throw the return value handle.
   * @param {module:notification.NotificationService.NotificationType}  [opts.changeOnComplete] If set and {@link opts.progress} is set, the notification will change type upon progress completion.
   * @param {module:notification.NotificationOnShowCallback}   [opts.onShow]   A callback to be invoked when the notification shows
   * @param {module:notification.NotificationOnHideCallback}   [opts.onHide]   A callback to be invoked when the notification hides
   * @param {module:notification.NotificationOnChangeCallback} [opts.onChange] A callback to be invoked when the notification data changes
   * @param {module:notification.ProgressNotificationOnProgressCallback} [opts.onProgress] A callback to be invoked when progress changes. Ignored if not {opts.progress}
   * @param {module:notification.ProgressNotificationOnCompleteCallback} [opts.onComplete] A callback to be invoked when progress completes Ignored if not {opts.progress}
   * @returns {(NotificationView|ProgressNotificationView)} A handle for the notification if one was created, otherwise {@link null}
   */
  error(message="", opts={}) {
    return this._doNotify(NotificationService.NotificationType.Error, message, opts)
  }

  /** 
   * Show an error notification, optionally with progress bar
   * 
   * If the service is disabled this is a no-op
   * 
   * @param {String}  message         The main message of the notification
   * @param {Object}  opts            Additional options
   * @param {String}  [opts.title]    A title for the notification
   * @param {String}  [opts.details]  Additional info for the notification
   * @param {Boolean} [opts.sticky]   If set, the notification will stay open until manually closed
   * @param {Boolean} [opts.progress] If set the notification will display a progress bar. Progress can be then updated throw the return value handle.
   * @param {module:notification.NotificationService.NotificationType}  [opts.changeOnComplete] If set and {@link opts.progress} is set, the notification will change type upon progress completion.
   * @param {module:notification.NotificationOnShowCallback}   [opts.onShow]   A callback to be invoked when the notification shows
   * @param {module:notification.NotificationOnHideCallback}   [opts.onHide]   A callback to be invoked when the notification hides
   * @param {module:notification.NotificationOnChangeCallback} [opts.onChange] A callback to be invoked when the notification data changes
   * @param {module:notification.ProgressNotificationOnProgressCallback} [opts.onProgress] A callback to be invoked when progress changes. Ignored if not {opts.progress}
   * @param {module:notification.ProgressNotificationOnCompleteCallback} [opts.onComplete] A callback to be invoked when progress completes Ignored if not {opts.progress}
   * @returns {(NotificationView|ProgressNotificationView)} A handle for the notification if one was created, otherwise {@link null}
   */
  success(message="", opts={}) {
    return this._doNotify(NotificationService.NotificationType.Success, message, opts)
  }

  /** 
   * Show a notification, optionally with progress bar
   * 
   * If the service is disabled this is a no-op
   * 
   * @param {String}  message         The main message of the notification
   * @param {Object}  opts            Additional options
   * @param {String}  [opts.title]    A title for the notification
   * @param {String}  [opts.details]  Additional info for the notification
   * @param {Boolean} [opts.sticky]   If set, the notification will stay open until manually closed
   * @param {Boolean} [opts.progress] If set the notification will display a progress bar. Progress can be then updated throw the return value handle.
   * @param {module:notification.NotificationService.NotificationType}  [opts.changeOnComplete] If set and {@link opts.progress} is set, the notification will change type upon progress completion.
   * @param {module:notification.NotificationOnShowCallback}   [opts.onShow]   A callback to be invoked when the notification shows
   * @param {module:notification.NotificationOnHideCallback}   [opts.onHide]   A callback to be invoked when the notification hides
   * @param {module:notification.NotificationOnChangeCallback} [opts.onChange] A callback to be invoked when the notification data changes
   * @param {module:notification.ProgressNotificationOnProgressCallback} [opts.onProgress] A callback to be invoked when progress changes. Ignored if not {opts.progress}
   * @param {module:notification.ProgressNotificationOnCompleteCallback} [opts.onComplete] A callback to be invoked when progress completes Ignored if not {opts.progress}
   * @returns {NotificationView|ProgressNotificationView} A handle for the notification if one was created, otherwise {@link null}
   */
  notify(message="", opts={}) {
    return this._doNotify(NotificationService.NotificationType.Default, message, opts)
  }
}


/**
 * Enum for the allowed notification types
 * @static
 * @readonly
 * @enum {String}
 */
NotificationService.NotificationType = {
  Success : NotificationModel.Type.Success,
  Info    : NotificationModel.Type.Info,
  Warning : NotificationModel.Type.Warning,
  Error   : NotificationModel.Type.Error,
  Default  : NotificationModel.Type.Default
}

module.exports = NotificationService