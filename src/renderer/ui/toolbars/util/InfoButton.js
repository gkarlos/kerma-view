const Component = require('@renderer/ui/component/Component')
const Events = require('@renderer/events')
const openAboutWindow = require('electron-about-window').default
const path = require('path')
const {InternalError} = require('@common/util/error')

/**
 * @memberof module:toolbars
 */
class InfoButton extends Component {
  constructor(id, container) {
    super(id, container)
    this.node = null
    this.name = `InfoButton[${this.id}]`
    this.rendered = false
    this.tooltip = "About"
  }

  render() {
    this.node = $(`
      <div id='${this.id}' data-toggle='tooltip' title='${this.tooltip}'>
        <i class="fas fa-info-circle center-vertically"></i>
      </div>
    `).appendTo(this.container)
      .css("cursor", "pointer")
      .css("margin-right", "5px")
      .css("opacity", "0.6")
      .css('font-size', '18px')
      .hover( function() { $( this ).fadeTo( 'fast', '1'); }, 
              function() { $( this ).fadeTo( 'fast', '.6'); })
      .tooltip()
      // .css("float", "right")

    this.rendered = true
    // this.app.emit(Events.UI_COMPONENT_READY, this)
    return this
  }

  useDefaultControls() {
    if ( !this.rendered)
      throw new InternalError("Component must be rendered before calling useDefaultControls()")

    this.node.on('click', () => {
      openAboutWindow({
        product_name: "KermaView",
        icon_path: this.app.icon,
        package_json_dir: this.app.root
      })
    })
  }
}

// function defaultCreate(app) {
//   if ( !app)
//     throw new InternalError('InfoButton.defaultCreate requires an app reference and none was passed')

//   let infoButton = new InfoButton("info-button", "#top-toolbar-right", app).render()

//   app.ui.on(Events.UI_READY, () => {

//   })
// }

module.exports = InfoButton