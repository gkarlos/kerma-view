const ProgressNotification = require('./ProgressNotification')
const Notification         = require('./Notification')

var BootstrapNotify = undefined

/**
 * @memberof module:notification
 */
class NotificationView {
  constructor(notification) {
    this.notification = notification
    this.viewimpl = undefined
    this.rendered = false
  }

  /** */
  updateMessage(message) {    
    this.notification.setMessage(message) 
    this.viewimpl.update('title', message)
  }

  /** */
  updateDetails(details) {
    this.notification.setDetails(details)
    this.viewimpl.update('message', details)
  }

  /** */
  updateProgress(value, info) {
    if ( this.notification instanceof ProgressNotification) {
      this.notification.progress(value, info)
      this.viewimpl.update('progress', 1)
    }
  }

  /** */
  updateType(type) {

  }

  _getType(notification) {

  }

  _renderInfo() {
    return $.notify(
    {
      icon: 'fa fa-info-circle',
      newest_on_top: true,
      allow_dismiss: true,
      title: `<strong>${this.notification.getTitle()}</strong>`,
      message: "asdasd"
    },
    {
      mouse_over: 'pause',
      showProgressbar: true,
      type: 'info',
      animate: {
        enter: 'animated fadeInDown',
        exit: 'animated fadeOutUp'
      },
      placement : {
        from: "bottom",
        align: "right"
      }
    })
  }

  _renderNotification() {
    switch(this.notification.type) {
      case Notification.Error:
        return "error"
      case Notification.Info:
        return this._renderInfo()
      case Notification.Success:
        return "success"
      case Notification.Warning:
        return "warning"
      default:
        throw new Error(`Unknown type: '${notification.type}'`)
    }
  }

  /** */
  render() {
    if ( !this.rendered) {
      if ( !BootstrapNotify)
        // lazily load the module
        BootstrapNotify = require('bootstrap-notify')
      this.viewimpl = this._renderNotification()
    }
    this.rendered = true
    return this;
  }
}

module.exports = NotificationView