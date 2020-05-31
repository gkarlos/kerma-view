const Component = require('@renderer/ui/component/Component')

class SettingsButton extends Component {
  constructor(id, container, app) {
    super(`SettingsButton[${id}]`)
    this.container = container
    this.app = app
    this.id = id
    this.tooltip = "Settings"
  }

  render() {
    this.node = $(`
      <div id='${this.id}' data-toggle='tooltip' title='${this.tooltip}'>
        <i class="fas fa-cog center-vertically"></i>
      </div>
    `).css("cursor", "pointer")
      .css("margin-right", "5px")
      .css("opacity", "0.6")
      .css('font-size', '18px')
      .hover( function() { $( this ).fadeTo( 'fast', '1'); }, 
              function() { $( this ).fadeTo( 'fast', '.6'); })
      .tooltip()
      // .css("flex-")
    this.node.appendTo(this.container)
    this.rendered = true
    return this;
  }

  useDefaultControls() {

  }
}

module.exports = SettingsButton