const Component = require('./component')

class InputFileDialog extends Component {
  constructor( id, container, prompt) {
    super()
    this.id = id;
    this.container = container;
    this.node = null;  
    this.prompt = prompt || ""
    this.enabled = true
    this.name = "InputFileDialog"
  }

  disable() {
    this.enabled = false
    this.node && $(`#${this.id}-browse-button`).removeClass('btn-secondary').addClass('btn-outline-secondary').prop('disabled', true)
              && $(`#${this.id}-browse-input`).prop('disabled', true)
              && $(`#${this.id}-ok-button`).removeClass('btn-info').addClass('btn-secondary')
              && $(`#${this.id}-ok-button`).prop('disabled', true)
  }

  enable() {
    this.enabled = true
    this.node && $(`#${this.id}-browse-button`).removeClass('btn-outline-secondary').addClass('btn-secondary').prop('disabled', false)
              && $(`#${this.id}-browse-input`).prop('disabled', false)
              && $(`#${this.id}-ok-button`).removeClass('btn-secondary').addClass('btn-info')
              && $(`#${this.id}-ok-button`).prop('disabled', false)
  }

  render() {
    this.node = $(`
      <div class="input-group input-group-sm" id="${this.id}">
        <div class="input-group-prepend">
          <button class="btn" type="button" id="${this.id}-browse-button">Browse&hellip;</button>
        </div>
        <input type="text" class="form-control" id="${this.id}-browse-input" placeholder="${this.prompt}" aria-label="" aria-describedby="">
        <div class="input-group-append" id="">
          <button class="btn btn-info" type="button" id="${this.id}-ok-button"><i class="fas fa-check-circle"></i></button>
        </div>
      </div>`
    )
    
    this.node.css("margin-left", "10px")
             .css("float", "left")
             .css("width", "50%")

    this.node.appendTo(this.container)
    return this;
  }
}


module.exports = (app) => {
  let ui = app.ui

  let ifdialog = ui.registerComponent(new InputFileDialog( "file-select-group", 
                                                           "#top-toolbar-right", 
                                                           "Select a *.cu file..."))

  ifdialog.render()
  ifdialog.disable() // disable file selection until the editor is ready
  
  ui.emit('component-ready', ifdialog)

  ui.on('editor:loaded', () => {
    ifdialog.enable()
  })
}