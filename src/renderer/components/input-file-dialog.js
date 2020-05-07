const Component = require('./component')

class InputFileDialog extends Component {
  constructor( id, container, prompt) {
    super()
    this.id = id;
    this.container = container;
    this.node = null;  
    this.prompt = prompt || ""
    this.enabled = true
    this.name = `InputFileDialog[id: ${id}]`
    this.browseButtonId = `${id}-browse-button`
    this.browseInputId = `${id}-browse-input`
    this.okButtonId = `${id}-ok-button`
    this.selectedFile = null
    this.okButtonContent = "<i class=\"fas fa-check-circle\"></i>"
    this.okButtonContentLoading = "<span class=\"spinner-border spinner-border-sm\" role=\"status\" aria-hidden=\"true\"></span>"
    this.okButtonLoading = false
  }

  disable() {
    this.enabled = false
    this.disableBrowseButton()
    this.disableBrowseInput()
    this.disableOkButton()
  }

  enable() {
    this.enabled = true
    this.enableBrowseButton()
    this.enableBrowseInput()
  }

  disableBrowseButton() {
    $(`#${this.browseButtonId}`).removeClass('btn-secondary').addClass('btn-outline-secondary').prop('disabled', true)
  }

  enableBrowseButton() {
    $(`#${this.browseButtonId}`).removeClass('btn-outline-secondary').addClass('btn-secondary').prop('disabled', false)
  }

  disableBrowseInput() {
    $(`#${this.browseInputId}`).prop('disabled', true)
  }

  enableBrowseInput() {
    $(`#${this.browseInputId}`).prop('disabled', false)
  }

  disableOkButton() {
    // $(`#${this.id}-ok-button`).removeClass('btn-info').addClass('btn-secondary')
    $(`#${this.okButtonId}`).prop('disabled', true).css("cursor", "not-allowed")
  }

  enableOkButton() {
    // $(`#${this.id}-ok-button`).removeClass('btn-secondary').addClass('btn-info')
    $(`#${this.okButtonId}`).prop('disabled', false).css("cursor", "pointer")
  }

  get browseInput() {
    return !this.rendered? null: document.getElementById(this.browseInputId)
  }

  get browseButton() {
    return !this.rendered? null : document.getElementById(this.browseButtonId)
  }

  get okButton() {
    return !this.rendered? null : document.getElementById(this.okButtonId)
  }

  okButtonLoadingStart() {
    this.okButtonLoading = true
    console.log("LOADING START")
    this.okButton.innerHTML = this.okButtonContentLoading
    this.disableOkButton()
  }

  okButtonLoadingStop() {
    this.okButton.innerHTML = this.okButtonContent
    this.enableOkButton()
    this.okButtonLoading = false
  }

  render() {
    if ( this.rendered ) {
      console.log(`[warn] multiple render() calls for ${this.name}. This is a no-op`)
    } else {
      this.node = $(`
        <div class="input-group input-group-sm" id="${this.id}">
          <div class="input-group-prepend">
            <button class="btn" type="button" id="${this.browseButtonId}">Browse&hellip;</button>
          </div>
          <input type="text" class="form-control" id="${this.browseInputId}" placeholder="${this.prompt}" aria-label="" aria-describedby="">
          <div class="input-group-append" id="">
            <button class="btn btn-info" type="button" id="${this.okButtonId}">${this.okButtonContent}</button>
          </div>
        </div>`
      )
      
      this.node.css("margin-left", "10px")
              .css("float", "left")
              .css("width", "50%")

      this.node.appendTo(this.container)
      this.rendered = true;
    }

    return this;
  }

  selectFile(path) {
    this.selectedFile = path
    this.browseInput.value = this.selectedFile
    this.enableOkButton()
  }
}


module.exports = (app) => {
  const {dialog} = require('electron').remote

  let ui = app.ui

  let ifdialog = ui.registerComponent(new InputFileDialog( "file-select-group", 
                                                           "#top-toolbar-right", 
                                                           "Select a *.cu file..."))

  ifdialog.render()
  ifdialog.disable() // disable file selection until the editor is ready

  ifdialog.browseButton.addEventListener('click', (e) => {
    dialog.showOpenDialog({
      properties: ['openFile']
    }).then(res => {
      if ( res.filePaths.length) {
        ifdialog.selectFile(res.filePaths[0])
      }
    })
  })

  ifdialog.okButton.addEventListener('click', (e) => {
    ifdialog.disableBrowseInput()
    ifdialog.okButtonLoadingStart()
    ui.emit('input:selected', ifdialog.selectedFile)
  })

  ui.on('editor:loaded', () => {
    ifdialog.enable()
  })

  ui.on('editor:input-loaded', () => {
    console.log("releasing ok button")
    ifdialog.okButtonLoadingStop()
  })

  ui.emit('component-ready', ifdialog)
}