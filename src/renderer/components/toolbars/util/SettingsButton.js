const Component = require('renderer/components/component')

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
        <h4><i class="fas fa-cog"></i></h4>
      </div>
    `).css("cursor", "pointer")
      .css("margin-right", "10px")
      .css("opacity", "0.6")
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