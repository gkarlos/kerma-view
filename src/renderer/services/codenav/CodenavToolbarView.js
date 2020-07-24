const Component = require('@renderer/ui/component/Component')
const App = require('@renderer/app')


// const LOCATION_PROGRAM_TOOLBAR = `#${App.ui.toolbar.main.id}`

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
    let LOCATION_EDITOR_TOOLBAR = `#${App.ui.toolbar.editor.id}`
    let LOCATION_TOP_TOOLBAR = `#${App.ui.layout.header.left.id}`

    super('codenav-toolbar', LOCATION_TOP_TOOLBAR)
    App.ui.toolbar.codenav = this
  }

  /** @returns {Boolean} */
  isRendered() { return this.#rendered }
  
  /** */
  _createStartStopButtons(container) {
    // this.startStopGroup 
    //   = $(`<div class="btn-group-xs" role="group" id="codenav-toolbar-button-group"></div>`).appendTo(container)
    this.start   
      = $(`<button type="button" class="btn kv-btn" id="codenav-btn-start" title="Start">
            <i class="fas fa-play"></i>
            <span>Start</span>
           </button>`).appendTo(container )

    this.stop    
      = $(`<button type="button" class="btn kv-btn" id="codenav-btn-stop" title="Stop">
            <i class="fas fa-stop"></i>
           </button>`).appendTo(container )
  }

  /** */
  _createRestartButton(container) {
    this.restart = $(`<button type="button" class="btn kv-btn" id="codenav-btn-restart" title="Restart"><i class="fas fa-retweet"></i></i></button>`).appendTo(container)
  }

  /** */
  _createNavButtons(container) {
    this.prevStmt = $(`
      <button type="button" class="btn kv-btn" id="codenav-btn-prev-stmt" title="Prev Statement">
        <i class="fas fa-arrow-up"></i>
      </button>`).appendTo(container)

    this.nextStmt = $(`
      <button type="button" class="btn kv-btn" id="codenav-btn-next-stmt" title="Next Statement">
        <i class="fas fa-arrow-down"></i>
      </button>`).appendTo(container)

    this.prevMemop = $(`
      <button type="button" class="btn kv-btn" id="codenav-btn-prev-rdwr" title="Prev RD/WR">
        <i class="fas fa-step-backward"></i>
      </button>`).appendTo(container)
    
    this.nextMemop = $(`
      <button type="button" class="btn kv-btn" id="codenav-btn-next-rdwr" title="Next RD/WR">
        <i class="fas fa-step-forward"></i>
      </button>`).appendTo(container)
  }

  /** 
   * @returns CodenavToolbarView 
   */
  render() {
    if( this.isRendered())
      return this;

    let Separator = require('@renderer/ui/MenuSeparator')

    this.separator1 = $(`
      <div id="codenav-toolbar-separator" role="group" class="border-left d-sm-none d-md-block"></div>
    `).appendTo(this.container)
    
    this.node = $(`<div id='${this.id}'></div>`).appendTo(this.container)

    // let buttonGroup = $(`<div class="btn-group btn-group-sm" role="group" id="codenav-toolbar-button-group"></div>`).appendTo(this.node)

    this._createStartStopButtons(this.node)
    this._createRestartButton(this.node)

    // this.separator1 = $(`
    //   <div id="codenav-toolbar-separator" role="group" class="border-left d-sm-none d-md-block"></div>
    // `).appendTo(this.node)

    this._createNavButtons(this.node)

    
    
    

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