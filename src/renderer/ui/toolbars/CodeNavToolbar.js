const Component = require('../component/Component')
const Events = require('../../events')

class CodeNavToolbar extends Component {
  constructor(id, container, app, subcomponent=false) {
    super()
    this.id = id,
    this.container = container,
    this.app = app
    this.name = `CodeNavToolbar[${this.id}]`
    this.rendered = false
    this.subcomponent = subcomponent
    this.separator = null;
  }

  render() {
    this.node = $(`<div class='' id='${this.id}-wrapper'></div>`)
        .appendTo(this.container)
        .css('position', 'absolute')
        .css('right', '2px')
        .css('width', '50%')
        .css('float', 'right')

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
          
    // this.startButton = $(`<button type="button" class="btn btn btn-info ml-auto" id="start-button"><i class="fas fa-play"></i> Start</button>`)
    //       .appendTo(this.node)
    //       .css('margin-right', '2px')
    //       .css('margin-top', '1px')
    //       .css('margin-bottom', '3px')
    //       .css('float', 'right')
              



    this.rendered = true

    if ( !this.subcomponent)
      this.app.emit(Events.UI_COMPONENT_READY, this)
  }

  useDefaultControls() {

  }

  // static defaultCreate(id, container, app) {
  //   let codeNavToolbar = new CodeNavToolbar(id, container, app).render()
  //   return codeNavToolbar;
  // }
}

module.exports = CodeNavToolbar