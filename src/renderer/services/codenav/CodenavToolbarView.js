const Component = require('@renderer/ui/component/Component')
const App = require('@renderer/app')

class CodenavToolbarView extends Component {
  /** @type {Boolean} */
  #rendered = false

  constructor() {
    console.log(App.ui.toolbar.editor)
    super('codenav-toolbar', `#${App.ui.toolbar.editor.id}`)
    App.ui.toolbar.codenav = this
  }

  /** @returns {Boolean} */
  isRendered() { return this.#rendered }

  /** 
   * @returns CodenavToolbarView 
   */
  render() {
    console.log("rendering")
    if( this.isRendered())
      return this;

    
    this.node = $(`<div id='${this.id}'></div>`).appendTo(this.container)

    this.navButtons = $(`
      <div class="btn-group btn-group" role="group" aria-label="Second group">
        <button type="button" class="btn btn btn-secondary"><i class="fas fa-redo"></i></button>
        <button type="button" class="btn btn btn-secondary"><i class="fas fa-angle-double-down"></i></button>
        <button type="button" class="btn btn btn-secondary"><i class="fas fa-angle-double-down"></i></button>
        <button type="button" class="btn btn btn-secondary"><i class="fas fa-angle-double-right"></i></button>
        <button type="button" class="btn btn btn-secondary"><i class="fas fa-chevron-circle-down"></i></button>
        <button type="button" class="btn btn btn-secondary"><i class="fas fa-chevron-circle-right"></i></button>
      </div>`).appendTo(this.node)
            .css('float', 'right')
            .css('margin-top', '1px')
            // .css('margin-right', '1px')
            // .css('margin', '5px')

    this.stopRefreshButtons = $(`
      <div class="btn-group btn-group" role="group" aria-label="First group" id="start-stop-container">
        <button type="button" class="btn btn btn-info ml-auto" id="start-button"><i class="fas fa-play"></i> Start</button>
        <button type="button" class="btn btn-secondary" id="stop-button"><i class="fas fa-retweet"></i></i></button>
        <button type="button" class="btn btn-secondary" id="stop-button"><i class="fas fa-stop"></i></button>
      </div>`).appendTo(this.node)
              .css('float', 'right')
              .css('margin-right', '2px')
              .css('margin-top', '1px')

    this.rendered = true

    return this
  }
}

module.exports = CodenavToolbarView