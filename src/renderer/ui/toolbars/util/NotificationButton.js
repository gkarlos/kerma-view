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
  }

  enable() {
    this.enabled = true
    if( this.rendered) {
      
    }
  }

  disable() {
    this.enabled = false 
    if ( this.rendered) {

    }
  }

  render() {
    if ( !this.rendered) {
      this.node = $(`
        <div id='${this.id}' data-toggle='tooltip' title='${this.tooltip}'>
          <i class="far fa-bell center-vertically"></i>
        </div>
     `).css('font-size', '20px')
      //  .css("margin-right", "10px")
       .css("opacity", "0.6")
       .css('font-size', '18px')
    }

    if ( this.enabled) {
      this.node.appendTo(this.container)
    }

    

    this.rendered = true;
    return this;
  }
}

module.exports = NotificationButton