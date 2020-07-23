const Component = require('@renderer/ui/component/Component')
const App = require('@renderer/app')

class CodenavToolbarView extends Component {
  /** @type {Boolean} */
  #rendered = false

  /** @type {JQuery} */
  #start
  /** @type {JQuery} */
  #stop
  /** @type {JQuery} */
  #restart


  constructor() {
    super('codenav-toolbar', `#${App.ui.toolbar.editor.id}`)
    App.ui.toolbar.codenav = this
  }

  /** @returns {Boolean} */
  isRendered() { return this.#rendered }
  
  /** */
  _createStartButton(container) {
    this.start   = $(`<button type="button" class="btn btn btn-sm btn-info ml-auto" id="start-button"><i class="fas fa-play"></i> Start</button>`).appendTo(container)
  }

  /** */
  _createRestartButton(container) {
    this.restart = $(`<button type="button" class="btn btn-sm btn-secondary" id="stop-button"><i class="fas fa-retweet"></i></i></button>`).appendTo(container)
  }

  /** */
  _createStopButton(container) {
    this.stop    = $(`<button type="button" class="btn btn-sm btn-secondary" id="stop-button"><i class="fas fa-stop"></i></button>`).appendTo(container)
  }

  /** 
   * @returns CodenavToolbarView 
   */
  render() {
    if( this.isRendered())
      return this;

    
    this.node = $(`<div id='${this.id}'></div>`).appendTo(this.container)

    // let buttonGroup = $(`<div class="btn-group btn-group-sm" role="group" id="codenav-toolbar-button-group"></div>`).appendTo(this.node)

    this._createStartButton(this.node)
    this._createRestartButton(this.node)
    this._createStopButton(this.node)
    

    // this.navButtons = $(`
    //   <div class="btn-group btn-group" role="group" aria-label="Second group">
    //     <button type="button" class="btn btn btn-secondary"><i class="fas fa-redo"></i></button>
    //     <button type="button" class="btn btn btn-secondary"><i class="fas fa-angle-double-down"></i></button>
    //     <button type="button" class="btn btn btn-secondary"><i class="fas fa-angle-double-down"></i></button>
    //     <button type="button" class="btn btn btn-secondary"><i class="fas fa-angle-double-right"></i></button>
    //     <button type="button" class="btn btn btn-secondary"><i class="fas fa-chevron-circle-down"></i></button>
    //     <button type="button" class="btn btn btn-secondary"><i class="fas fa-chevron-circle-right"></i></button>
    //   </div>`).appendTo(this.node)
    //         .css('float', 'right')
    //         .css('margin-top', '1px')
    //         // .css('margin-right', '1px')
    //         // .css('margin', '5px')

    // this.stopRefreshButtons = $(`
    //   <div class="btn-group btn-group" role="group" aria-label="First group" id="start-stop-container">
    //     <button type="button" class="btn btn btn-info ml-auto" id="start-button"><i class="fas fa-play"></i> Start</button>
    //     <button type="button" class="btn btn-secondary" id="stop-button"><i class="fas fa-retweet"></i></i></button>
    //     <button type="button" class="btn btn-secondary" id="stop-button"><i class="fas fa-stop"></i></button>
    //   </div>`).appendTo(this.node)
    //           .css('float', 'right')
    //           .css('margin-right', '2px')
    //           .css('margin-top', '1px')

    this.rendered = true

    return this
  }
}

module.exports = CodenavToolbarView