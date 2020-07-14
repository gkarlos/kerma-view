const Component = require('../component/Component')
const Events = require('../../events')
const App = require('@renderer/app')

/**
 * @memberof module:toolbars
 */
class SessionRestartButton extends Component {
  constructor(id, container) {
    super(id, container)
    this.name = `RestartSessionButton[${this.id}]`
  }

  render() {
    if ( this.rendered )
      return console.log(`[warn] multiple render() calls for ${this.name}. This is a no-op`)
    
    this.node = $(`
      <button class="btn btn-sm btn-secondary" id="${this.id}" data-toggle="tooltip" data-placement="bottom" title="Start a new session">
        <i class="fas fa-trash-restore"></i>
      </button>
    `)

    this.node.tooltip()
    this.node.appendTo(this.container)
    this.rendered = true
    return this
  }
}

class SessionControlToolbar extends Component {
  constructor(id, container) {
    super(id, container)
    this.name = `SessionControlToolbar[${this.id}]`
    this.sessionRestartButton = new SessionRestartButton("top-restart-session-button", `#${this.id}`, App)
  }
  


  render() {
    if ( this.rendered )
      return console.log(`[warn] multiple render() calls for ${this.name}. This is a no-op`)
    
    this.node = $(`<div id="${this.id}"></div>`).css('display', "inline").appendTo(this.container)

    this.sessionRestartButton.render()

    // TODO add more button
    
    this.rendered = true
    App.emit(Events.UI_COMPONENT_READY, this)
    return this
  }

  useDefaultControls() {
    
  }
}

// function defaultCreate(app) {
//   let sessionControlToolbar = new SessionControlToolbar("session-control-toolbar", "#top-toolbar-right", app).render()
//   // TODO app.ui.on(Events.UI_READY, ... )
//   return sessionControlToolbar
// }

module.exports = SessionControlToolbar

// {
//   SessionControlToolbar,
//   SessionRestartButton,
//   defaultCreate
// }