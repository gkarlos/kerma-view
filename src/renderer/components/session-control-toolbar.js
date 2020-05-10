const Component = require('./component')

class RestartSessionButton extends Component {
  constructor(id, container) {
    super()
    this.id = id
    this.name = `RestartSessionButton[${this.id}]`
    this.container = container
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
    super()
    this.id = id
    this.name = `SessionControlToolbar[${this.id}]`
    this.container = container
  }
  


  render() {
    if ( this.rendered )
      return console.log(`[warn] multiple render() calls for ${this.name}. This is a no-op`)
    
    this.node = $(`<div id="${this.id}"></div>`).css('display', "inline")

    this.node.appendTo(this.container)
    
    new RestartSessionButton("top-restart-session-button", `#${this.id}`).render()

    this.rendered = true
    return this
  }
}

module.exports = (app) => {
  let sessionControlToolbar = app.ui.registerComponent(new SessionControlToolbar("session-control-toolbar", "#top-toolbar-right"))
  sessionControlToolbar.render()
  app.ui.emit('component-ready', sessionControlToolbar)
}