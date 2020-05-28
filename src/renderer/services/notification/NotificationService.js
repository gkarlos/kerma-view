const NotificationModel   = require('./NotificationModel')
const NotificationView    = require('./NotificationView')

function createNotification(type, msg, details, progress) {
  if ( typeof progress === 'boolean')
    return progress? new ProgressNotification(type, msg, details, 100)
                   : new Notification(type, msg, details)
  else
    return progress? new ProgressNotification(type, msg, details, progress)
                   : new Notification(type, msg, details)
}

/**
 * @memberof module:notification
 */
class NotificationService {
  constructor(app) {
    this.enabled = true
  }

  /** enable the service  */
  enable() { this.enabled = true }
  
  /** disable the service */
  disable() { this.enabled = false}

  /** check if the service is enabled */
  isEnabled() { return this.enabled }

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
   * @param {String} msg
   * @param {String} details
   * @param {int} progress 
   * @returns {NotificationView}
   */
  info(title, msg, details, props) {
    let model= new NotificationModel(NotificationModel.Info, title, msg, details)
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