/**
 * @file input-file-dialog.js
 */
const Component = require('./component')
const Events = require('../events')
const {dialog} = require('electron').remote

/**
 * @class
 */
class InputFileDialog extends Component {
  constructor( id, container, prompt, app) {
    super()
    this.id = id;
    this.container = container;
    this.prompt = prompt || ""
    this.app = app
    this.node = null;  
    this.enabled = true
    this.name = `InputFileDialog[${id}]`
    this.browseButtonId = `${id}-browse-button`
    this.browseInputId = `${id}-browse-input`
    this.okButtonId = `${id}-ok-button`
    this.selectedFile = null
    this.okButtonContent = "<i class=\"fas fa-check-circle\"></i>"
    this.okButtonContentLoading = "<span class=\"spinner-border spinner-border-sm\" role=\"status\" aria-hidden=\"true\"></span>"
    this.okButtonLoading = false
    this.app.ui.registerComponent(this)
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
    $(`#${this.browseButtonId}`).prop('disabled', true)
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
    console.log("loading start")
    this.okButtonLoading = true
    this.okButton.innerHTML = this.okButtonContentLoading
    this.disableOkButton()
  }

  okButtonLoadingStop() {
    console.log("loading stop")
    this.okButton.innerHTML = this.okButtonContent
    // this.enableOkButton()
    this.okButtonLoading = false
  }

  selectFile(path) {
    this.selectedFile = path
    this.browseInput.value = this.selectedFile
    this.enableOkButton()
  }

  /**
   * @fires Events.UI_COMPONENT_READY
   */
  render() {
    if ( this.rendered ) {
      console.log(`[warn] multiple render() calls for ${this.name}. This is a no-op`)
      return this;
    }

    this.node = $(`
      <div class="input-group input-group-sm" id="${this.id}">
        <div class="input-group-prepend">
          <button class="btn btn-secondary" type="button" id="${this.browseButtonId}">Browse&hellip;</button>
        </div>
        <input type="text" class="form-control" id="${this.browseInputId}" placeholder="${this.prompt}" aria-label="" aria-describedby="">
        <div class="input-group-append" id="">
          <button class="btn btn-info" type="button" id="${this.okButtonId}">${this.okButtonContent}</button>
        </div>
      </div>`
    )
    
    this.node.css("margin-left", "10px")
             .css("margin-right", "3px")
             .css("float", "left")
             .css("width", "50%")

    this.node.appendTo(this.container)
    this.rendered = true

    let ui = this.app.ui

    // open file dialog when clicking "browse"
    this.browseButton.addEventListener('click', e => {
      this.app.ui.ready && 
      dialog
        .showOpenDialog({ 
          properties: ['openFile']
        })
        .then(res => {
          if ( res.filePaths.length) {
            this.selectFile(res.filePaths[0])
            this.enableOkButton()
          }
        })
    })

    this.okButton.addEventListener('click', e => {
      this.disableBrowseButton()
      this.disableBrowseInput()
      this.okButtonLoadingStart()
      ui.emit(Events.INPUT_FILE_SELECTED, this.selectedFile)
    })

    ui.on(Events.EDITOR_LOADED, () => this.enable())

    ui.on(Events.EDITOR_INPUT_LOADED, () => {
      console.log("editor loaded file XX")
      this.okButtonLoadingStop()
      this.disableOkButton()
      this.node.attr("title", this.selectedFile)
               .tooltip( {placement : 'bottom', container: "body", id: "yeyeye"})
    }) 

    // ready
    this.app.ui.emit(Events.UI_COMPONENT_READY, this)
    return this;
  }
}

function defaultCreate(app) {
  let ifdialog = new InputFileDialog( "file-select-group", "#top-toolbar-right", "Select a *.cu file...", app)
  
  ifdialog.render()
  ifdialog.disable() // disable file selection until the editor is ready
  
  return ifdialog
}


module.exports = {
  InputFileDialog,
  defaultCreate
}