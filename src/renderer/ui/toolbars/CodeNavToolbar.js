const Component = require('../component')
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
  }

  render() {
    $(`
    <div class="btn-group btn-group-sm" role="group" aria-label="First group" id="start-stop-container">
      <button type="button" class="btn btn-secondary disabled" id="stop-button"><i class="fas fa-stop"></i></button>
      <button type="button" class="btn btn-info" id="start-button"><i class="fas fa-play"></i> Start</button>
      <div class="btn-group btn-group" role="group" aria-label="Second group">
        <button type="button" class="btn btn-secondary"><i class="fas fa-redo"></i></button>
        <button type="button" class="btn btn-secondary"><i class="fas fa-angle-double-down"></i></button>
        <button type="button" class="btn btn-secondary"><i class="fas fa-angle-double-down"></i></button>
        <button type="button" class="btn btn-secondary"><i class="fas fa-angle-double-right"></i></button>
        <button type="button" class="btn btn-secondary"><i class="fas fa-chevron-circle-down"></i></button>
        <button type="button" class="btn btn-secondary"><i class="fas fa-chevron-circle-right"></i></button>
      </div>
    </div>
    `).appendTo(this.container)

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