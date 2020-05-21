const Component = require('renderer/ui/component/Component')

class NotificationButton extends Component {

  static enabledTooltip = "Disable notifications"
  static disabledTooltip = "Enable notifications"

  constructor(id, container, app) {
    super(`NotificationButton[${id}]`)
    this.id = id
    this.container = container
    this.app = app
    this.node = null;
    this.enabled = true;
    this.tooltip = NotificationButton.enabledTooltip
    this.onClickCallbacks = []
  }

  enable() {
    this.enabled = true
    this.tooltip = NotificationButton.enabledTooltip

    if( this.rendered) {
      this.node.empty()
      this.node.attr('data-original-title', this.tooltip)
               .tooltip('show')
      $(`<i class="fas fa-bell fa-fw center-vertically"></i>`).appendTo(this.node)
    }
  }

  disable() {
    this.enabled = false 
    this.tooltip = NotificationButton.disabledTooltip

    if ( this.rendered) {
      this.node.empty()
      this.node.attr('data-original-title', this.tooltip)
               .tooltip('show')
      $(`<i class="far fa-bell-slash fa-fw center-vertically"></i>`).appendTo(this.node)
    }
  }

  render() {
    if ( !this.rendered) {
      this.node = $(`
        <div id='${this.id}' data-toggle='tooltip' title='${this.tooltip}'>
          ${this.enabled
            ? '<i class="fas fa-bell fa-fw center-vertically"></i>'
            : '<i class="fas fa-bell fa-fw center-vertically"></i>'
          }
        </div>
     `).css('font-size', '20px')
       .css("opacity", "0.6")
       .css('font-size', '18px')
       .css('cursor', 'pointer')

      this.node.tooltip()

      this.onClick(() => {
        if ( this.enabled)
          this.disable()
        else
          this.enable()
      })


      this.onClickCallbacks.forEach(callback => this.node.on('click', callback))
    }

    if ( this.enabled)
      this.node.appendTo(this.container)

    this.rendered = true;
    return this;
  }

  onClick(callback) {
    if ( this.rendered)
      this.node.on('click', callback)
    else
      this.onClickCallbacks.push(callback)
  }
}

module.exports = NotificationButton