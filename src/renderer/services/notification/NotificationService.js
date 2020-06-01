const Service                   = require('@renderer/services/Service')
const NotificationModel         = require('@renderer/services/notification/NotificationModel')
const ProgressNotificationModel = require('@renderer/services/notification/ProgressNotificationModel')
const NotificationView          = require('@renderer/services/notification/NotificationView')
const ProgressNotificationView  = require('@renderer/services/notification/ProgressNotificationView')

/** @memberof module:notification */
class NotificationService extends Service {
  constructor(app) {
    super("NotificationService")
  }

  /** enable the service  */
  enable() { super.enable() }
  
  /** disable the service */
  disable() { super.disable() }

  /** 
   * Show a success notification
   * If the service is disabled this is a no-op
   * 
   * @param {String} msg
   * @param {String} details
   * @param {int} progress 
   * @returns {NotificationView}
   */
  success(title, msg, details, props) {
    let model= new NotificationModel(NotificationModel.Success, title, msg, details)
    let view = new NotificationView(model)

    if ( props) {
      if ( props.onShow)
        view.onShow(props.onShow)
      if ( props.onHide)
        view.onHide(props.onHide)
      if ( props.onChange)
        view.onChange(props.onChange)
    }
    
    view.show()
    
    return view
  }

  
  /** 
   * Show an info notification
   * If the service is disabled this is a no-op
   * 
   * @param {String}  message         The main message of the notification
   * @param {Object}  [opts]          Additional options
   * @param {String}  [opts.title]    A title for the notification
   * @param {String}  [opts.details]  Additional info for the notification
   * @param {Boolean} [opts.progress] If set the notification will be a {@link module:notification.ProgressNotificationView}
   * @param {module:notification.NotificationOnShowCallback}   [opts.onShow]   A callback to be invoked when the notification shows
   * @param {module:notification.NotificationOnHideCallback}   [opts.onHide]   A callback to be invoked when the notification hides
   * @param {module:notification.NotificationOnChangeCallback} [opts.onChange] A callback to be invoked when the notification data changes
   * @param {module:notification.ProgressNotificationOnProgressCallback} [opts.onProgress] A callback to be invoked when progress changes. Ignored if not {opts.progress}
   * @param {module:notification.ProgressNotificationOnCompleteCallback} [opts.onComplete] A callback to be invoked when progress completes Ignored if not {opts.progress}
   */
  info(message="", opts={}) {
    console.log(message)

    let model, view

    if ( opts.progress) {
      model = new ProgressNotificationModel({ type: NotificationModel.Info, message: message, title: opts.title,  details: opts.details, total: opts.total})
      view = new ProgressNotificationView(model)
    } else {
      model = new NotificationModel({ type: NotificationModel.Info, message: message, title: opts.title,  details: opts.details})
      view = new NotificationView(model)
    }

    if ( opts.onShow && typeof opts.onShow === 'function') view.onShow(props.onShow)
    if ( opts.onHide && typeof opts.onHide === 'function') view.onHide(opts.onHide)
    if ( opts.onChange && typeof opts.onChange === 'function') view.onChange(opts.onChange)

    if ( opts.progress) {
      if (opts.onProgress && typeof opts.onProgress === 'function')
        view.onProgress(opts.onProgress)
      if ( opts.onComplete && typeof opts.onComplete === 'function')
        view.onComplete(opts.onComplete)
      view.onComplete(() => view.updateType(NotificationModel.Success))
    }

    view.show()
    return view
  }

  /** 
   * Show a warning notification
   * If the service is disabled this is a no-op
   * 
   * @param {String} msg
   * @param {String} details
   * @param {int} progress 
   * @returns {NotificationView}
   */
  warning(title, msg, details, props) {
    let model= new NotificationModel(NotificationModel.Warning, title, msg, details)
    let view = new NotificationView(model)

    if ( props) {
      if ( props.onShow)
        view.onShow(props.onShow)
      if ( props.onHide)
        view.onHide(props.onHide)
    }
    
    view.show()
    return view
  }

  /** 
   * Show an error notification
   * If the service is disabled this is a no-op
   * 
   * @param {String} msg
   * @param {String} details
   * @param {int} progress 
   * @returns {NotificationView}
   */
  error(title, msg, details, props) {
    let model= new NotificationModel(NotificationModel.Error, title, msg, details)
    let view = new NotificationView(model)

    if ( props) {
      if ( props.onShow)
        view.onShow(props.onShow)
      if ( props.onHide)
        view.onHide(props.onHide)
    }
    
    view.show()
    return view
  }

  // successProgress(msg, details, total=100) {

  // }

  
  // /** 
  //  * Display an error notification
  //  * If the service is disabled this is a no-op
  //  * 
  //  * @param {String} msg
  //  * @param {String} details
  //  * @param {int} progress 
  //  * @returns {NotificationView}
  //  */
  // error(msg, details, progress=0) {
  //   let notification = createNotification(Notification.Error, msg, details, progress)

  //   if ( this.enabled)
  //     this.viewer.show(notification)

  //   return notification
  // }

  // /** 
  //  * Display a warning notification
  //  * If the service is disabled this is a no-op
  //  * 
  //  * @param {String} msg
  //  * @param {String} details
  //  * @param {int} progress 
  //  * @returns {NotificationView}
  //  */
  // warning(msg, details, progress=0) {
  //   let notification = createNotification(Notification.Warning, msg, details, progress)
    
  //   if ( this.enabled)
  //     this.viewer.show(notification)
    
  //   return notification
  // }

  // /** 
  //  * Display a success notification
  //  * If the service is disabled this is a no-op
  //  * 
  //  * @param {String} msg
  //  * @param {String} details
  //  * @param {int} progress 
  //  * @returns {NotificationView}
  //  */
  // info(msg, details, progress=0) {
  //   if ( this.enabled) {
  //     let notification = createNotification(Notification.Info, msg, details, progress)
  //     let notificationView = new NotificationView(notification)
  //     return notificationView.render()
  //   }

  //   return null
  // }
  
}

module.exports = NotificationService