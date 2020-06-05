/**
 * Enum for the allowed notification types
 * @static
 * @readonly
 * @memberof module:notification
 * @enum {String}
 */
const NotificationType = {
  /** A Success notification */Success : 'success', 
  /** An Info notification   */Info    : 'info',
  /** A Warning notification */Warning : 'warning',
  /** An Error notificaiton  */Error   : 'error',
  /** Default notification   */Default : 'notify'
}

module.exports = NotificationType