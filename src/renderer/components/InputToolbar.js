/**
 * @file input-file-dialog.js
 */
const Component = require('./component')
const Events = require('../events')
const {dialog} = require('electron').remote
const {InternalError} = require('../../util/error')

class InputTypeSelectionItem extends Component {
  constructor(container, app) {
    super(`InputTypeSelectionItem.@${container}`)
    this.container = container
    this.app = app
    this.shortValue = null
    this.value = null
    this.enabled = true
  }

  setValue(value, shortValue=null) {
    this.value = value
    if (shortValue) this.shortValue = shortValue
    if ( this.rendered) 
      this.node.text(value)
    return this
  }

  enable() {
    this.enabled = true
    if ( this.rendered)
      this.node.removeClass("disabled")
  }

  disable() {
    this.enabled = false
    if ( this.rendered)
      this.node.addClass("disabled")
  }

  /** private */
  __style() {
    // this.node.hover(() => $(this).css("background-color", "#138496"))
    this.node.css("cursor", "pointer")
    this.node.mouseover(() => $(this.node).css("background-color","#17a2b8"))
             .mouseout(() => $(this.node).css("background-color","transparent"))
  }

  render() {
    this.node = $(`<li class="dropdown-item input-type-option" href="#"></li>`)
      .text(this.value)
      .appendTo(this.container)
    this.__style()
      // .on('mouseover', () => this.node.css("background-color", "#138496"))
      // .on('mouseoute')
    this.enabled && this.enable()
    this.node.on('click', () => {
      this.app.ui.emit(Events.INPUT_TYPE_SELECTED, this)
      console.log("clicked")
    })

    this.rendered = true;
    return this;
  }

  useDefaultControls() {
    
  }
}

class InputTypeSelection extends Component {
  constructor(container, app) {
    super()
    this.container = container
    this.app = app
    this.options = []
    this.node = {
      button : null,
      dropdown : null,
      rendered : false,
    } 
    this.selected = null
    this.enabled = true
    this.usingDefaultControls = false
  }

  /** @private */
  __renderOptions() {
    if ( !this.node.rendered)
      throw new InternalError("InputTypeSelection.__renderOptions: this.node.rendered == false")
    this.options.forEach( opt => opt.render() && opt.useDefaultControls())
  }

  addOption(value, shortValue=null) {
    let opt = new InputTypeSelectionItem(this.node.dropdown, this.app).setValue(value, shortValue);
    this.options.push(opt)
    if ( this.rendered) {
      opt.render()
      opt.useDefaultControls()
    }
    return this;
  }

  selectOption(value) {
    let found = false;
    for ( let i = 0; i < this.options.length; ++i) {
      if ( this.options[i].value === value) {
        found = true
        this.selected = this.options[i]
        break;
      }
    }

    if ( !found)
      throw new InternalError(`Could not find option ${value}`)

    this.app.ui.emit(Events.INPUT_TYPE_SELECTED, this.selected)
  }

  enable() {
    this.enabled = true
    if ( this.rendered)
      this.node.button.removeClass("disabled")
  }

  disable() {
    this.enabled = false
    if ( this.rendered)
      this.node.button.addClass("disabled")
  }

  render() {
    console.log(this.container)

    console.log(this.node)

    this.node.button = $(`
      <button type="button" class="btn btn-secondary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      </button>`).appendTo(this.container)

    console.log(this.node.button.text())

    this.node.dropdown = $(`
      <ul class="dropdown-menu" id="type-selection-dropdown">
      </ul>
    `).appendTo(this.container)
    
    this.options.forEach(opt => opt.render())

    // $(`#${this.container} .dropdown-menu`)
    this.rendered = true;
    return this
  }

  useDefaultControls() {
    this.options.forEach( opt => opt.useDefaultControls())
    this.app.ui.on(Events.INPUT_TYPE_SELECTED, (opt) => {
      console.log("YES")
      this.node.button.html(`<span>${opt.shortValue} </span>`)
    })
  }
}

/**
 * @class
 */
class InputToolbar extends Component {
  constructor( id, container, app) {
    super()
    this.id = id;
    this.container = container;
    this.prompt = "Select a *.cu file..."
    this.app = app
    this.node = null;  
    this.enabled = true
    this.name = `InputFileDialog[${id}]`

    this.browse = null;
    this.typeSelect = null;
    this.input = null;
    this.ok = null;
    
    this.browseButtonId = `${id}-browse-button`
    this.browseTypeButtonId = `${id}-browse-type-button`
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
    this.typeSelect.disable()
    this.disableBrowseInput()
    this.disableOkButton()
  }

  enable() {
    this.enabled = true
    this.typeSelect.enable()
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

  __renderParts() {
    this.node   = $(`<div class="input-group input-group-sm" id="${this.id}"></div>`).appendTo(this.container)

    this.browse = $(`
      <div class="input-group-prepend" id="input-browse-type-prepend">
        <button class="btn btn-secondary" type="button" id="${this.browseButtonId}">Browse&hellip;</button>
      </div>`).appendTo(this.node)

    this.typeSelect = new InputTypeSelection('#input-browse-type-prepend', this.app).render()

    this.input  = $(`
      <input type="text" class="form-control" id="${this.browseInputId}" placeholder="${this.prompt}" aria-label="" aria-describedby="">
    `).appendTo(this.node)

    this.ok     = $(`        
      <div class="input-group-append" id="">
        <button class="btn btn-info" type="button" id="${this.okButtonId}">${this.okButtonContent}</button>
      </div>`).appendTo(this.node)
    
    this.node.css("margin-left", "10px")
             .css("margin-right", "3px")
             .css("float", "left")
             .css("width", "50%")
    
    this.rendered = true
  }

  /**
   * @fires Events.UI_COMPONENT_READY
   */
  render() {
    if ( this.rendered ) {
      console.log(`[warn] multiple render() calls for ${this.name}. This is a no-op`)
      return this;
    }

    this.__renderParts()

    let ui = this.app.ui

    // open file dialog when clicking "browse"
    this.browseButton.addEventListener('click', e => {
      // this.app.ui.ready && 
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
      this.typeSelect.disable()
      this.node.attr("title", this.selectedFile)
               .tooltip( {placement : 'bottom', container: "body"})
      $(`#${this.okButtonId}`).css("cursor", "pointer")
    }) 

    this.disable()

    // ready
    this.app.ui.emit(Events.UI_COMPONENT_READY, this)
    return this;
  }

  useDefaultControls() {
    this.typeSelect.useDefaultControls()
    this.typeSelect.addOption("Cuda", "CU")
                   .addOption("OpenCL", "CL")
                   .selectOption('Cuda')
    console.log(this.typeSelect.options)
    console.log(this.typeSelect)
  }
}

// function defaultCreate(app) {
//   let ifdialog = new InputFileDialog( "file-select-group", "#top-toolbar-right", "Select a *.cu file...", app)
  
//   ifdialog.render()
//   ifdialog.disable() // disable file selection until the editor is ready
  
//   return ifdialog
// }


module.exports = InputToolbar