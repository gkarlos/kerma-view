
/**
 * @module NotificationService
 * @category services
 * 
 */

/**
 * @memberof module:NotificationService
 */
class NotificationService {
  constructor(app) {
    this.app = app
    this.notify = require('bootstrap-notify')
  }

  enable() {

  }

  disable() {

  }

  notify(msg, type, opts) {
    if ( type === 'success')
      this.success(msg, opts)
    else if (type === 'info')
      this.info(msg, opts)
    else if (type === 'warning')
      this.warning(msg, opts)
    else if (type === 'error')
      this.error(msg, opts)
    else
      throw new Error(`Invalid notification type '${type}'`)
  }

  success(msg, opts) {
    return $.notify(
    {
      message: msg,
      icon: "glyphicon glyphicon-star"
    },
    {
      type: 'danger',
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

  info(msg) {
    return $.notify(
    {
      icon: 'fa fa-info-circle',
      newest_on_top: true,
      allow_dismiss: true,
      message: msg 
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

  warning() {

  }

  error() {

  }
}

module.exports = NotificationService