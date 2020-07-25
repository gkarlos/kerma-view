const Component = require('@renderer/ui/component/Component')
const Events    = require('@renderer/events')
const {dialog}  = require('electron').remote
const {InternalError} = require('@common/util/error')
const App = require('@renderer/app')

// /**
//  * @memberof module:toolbars
//  */
// class InputModeSelectionItem extends Component {
//   constructor(id, container) { 
//     super(id, container)
//     this.containerSelector = `#${this.container.id}`
//     this.shortValue = null
//     this.value = null
//     this.enabled = true
//   }

//   setValue(value, shortValue=null) {
//     this.value = value
//     if (shortValue) this.shortValue = shortValue
//     if ( this.rendered) 
//       this.node.text(value)
//     return this
//   }

//   enable() {
//     this.enabled = true
//     if ( this.rendered)
//       this.node.removeClass("disabled")
//   }

//   disable() {
//     this.enabled = false
//     if ( this.rendered)
//       this.node.addClass("disabled")
//   }

//   /** private */
//   __style() {
//     // this.node.hover(() => $(this).css("background-color", "#138496"))
//     this.node.css("cursor", "pointer")
//     this.node.mouseover(() => $(this.node).css("background-color","#17a2b8"))
//              .mouseout(() => $(this.node).css("background-color","transparent"))
//   }

//   render() {
//     this.node = $(`<li class="dropdown-item input-type-option" href="#"></li>`)
//       .text(this.value)
//       .appendTo(this.container.node)
//     this.__style()
//       // .on('mouseover', () => this.node.css("background-color", "#138496"))
//       // .on('mouseoute')
//     this.enabled && this.enable()
//     this.node.on('click', () => {
//       App.emit(Events.INPUT_TYPE_SELECTED, this)
//     })

//     this.rendered = true;
//     return this;
//   }

//   useDefaultControls() {
    
//   }
// }

// /**
//  * @memberof module:input-toolbar
//  */
// class InputModeSelection extends Component {
//   constructor(id, container) {
//     super(id,container)
//     this.options = []
//     this.node = {
//       button : null,
//       dropdown : null,
//       rendered : false,
//     } 
//     this.selected = null
//     this.enabled = true
//     this.usingDefaultControls = false
//   }

//   /** @private */
//   __renderOptions() {
//     if ( !this.node.rendered)
//       throw new InternalError("InputTypeSelection.__renderOptions: this.node.rendered == false")
//     this.options.forEach( opt => opt.render() && opt.useDefaultControls())
//   }

//   addOption(value, shortValue=null) {
//     let opt = new InputModeSelectionItem(this.node.dropdown, App).setValue(value, shortValue);
//     this.options.push(opt)
//     if ( this.rendered) {
//       opt.render()
//       opt.useDefaultControls()
//     }
//     return this;
//   }

//   selectOption(value) {
//     let found = false;
//     for ( let i = 0; i < this.options.length; ++i) {
//       if ( this.options[i].value === value) {
//         found = true
//         this.selected = this.options[i]
//         break;
//       }
//     }

//     if ( !found)
//       throw new InternalError(`Could not find option ${value}`)

//     App.emit(Events.INPUT_TYPE_SELECTED, this.selected)
//   }

//   enable() {
//     this.enabled = true
//     if ( this.rendered)
//       this.node.button.removeClass("disabled")
//   }

//   disable() {
//     this.enabled = false
//     if ( this.rendered)
//       this.node.button.addClass("disabled")
//   }

//   render() {
//     this.node.button = $(`
//       <button id="${this.id} type="button" class="btn btn-secondary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
//       </button>`).appendTo(this.container.node)

//     this.node.dropdown = $(`
//       <ul class="dropdown-menu" id="type-selection-dropdown">
//       </ul>
//     `).appendTo(this.container)
    
//     this.options.forEach(opt => opt.render())

//     // $(`#${this.container} .dropdown-menu`)
//     this.rendered = true;
//     return this
//   }

//   useDefaultControls() {
//     this.options.forEach( opt => opt.useDefaultControls())
//     App.on(Events.INPUT_TYPE_SELECTED, (opt) => {
//       this.node.button.html(`<span>${opt.shortValue} </span>`)
//     })
//   }
// }

/**
 * @memberof module:input-toolbar
 */
class InputToolbar extends Component {

  static ID = "file-select-group"
  static LOCATION = "#header-left"

  constructor() {
    super(InputToolbar.ID, InputToolbar.LOCATION)
    this.prompt = "Select a *.cu file..."
    this.node = null;  
    this.enabled = true
    this.name = `InputFileDialog[${this.id}]`

    this.browse = null;
    this.typeSelect = null;
    this.input = null;
    this.ok = null;
    
    this.browseButtonId = `${this.id}-browse-button`
    this.browseTypeButtonId = `${this.id}-browse-type-button`
    this.browseInputId = `${this.id}-browse-input`
    this.browseDialogCurrentlyOpen = false
    this.okButtonId = `${this.id}-ok-button`
    this.selectedFile = null
    this.okButtonContent = "<i class=\"fas fa-check-circle\"></i>"
    this.okButtonContentLoading = "<span class=\"spinner-border spinner-border-sm\" role=\"status\" aria-hidden=\"true\"></span>"
    this.okButtonLoading = false
    App.ui.registerComponent(this)
  }

  disable() {
    this.enabled = false
    this.disableBrowseButton()
    // this.mode.disable()
    this.disableBrowseInput()
    this.disableOkButton()
  }

  enable() {
    this.enabled = true
    // this.mode.enable()
    this.enableBrowseButton()
    this.enableBrowseInput()
  }

  disableBrowseButton() {
    $(`#${this.browseButtonId}`).prop('disabled', true)
  }

  enableBrowseButton() {
    // $(`#${this.browseButtonId}`).removeClass('btn-outline-secondary').addClass('btn-secondary').prop('disabled', false)
    $(`#${this.browseButtonId}`).prop('disabled', false)
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
    this.okButton.innerHTML = this.okButtonContentLoading
    this.disableOkButton()
  }

  okButtonLoadingStop() {
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

    this.killSession = $(`
      <button class="btn kv-btn" id="${this.id}" data-toggle="tooltip" data-placement="bottom" title="Kill Session">
        <i class="fas fa-trash-restore"></i>
      </button>
    `).appendTo(this.node).css("margin-bottom", "2px").css("margin-right", "2px")

    this.node.tooltip()
  
    this.browseWrapper = $(`<div class="input-group-prepend" id="input-browse-mode-prepend"></div>`).appendTo(this.node)
    this.browse = $(`
      <button class="btn kv-btn" type="button" id="${this.browseButtonId}">
        <i class="far fa-folder-open"></i>
      </button>
    `).appendTo(this.browseWrapper)
            .css("margin-bottom", "2px")
            .css("border-top-left-radius", "3px")
            .css("border-bottom-left-radius", "3px")
    // this.mode = new InputModeSelection('input-mode', '#input-browse-mode-prepend', App).render()

    this.input  = $(`
      <input type="text" class="form-control" id="${this.browseInputId}" placeholder="${this.prompt}" aria-label="" aria-describedby="">
    `).appendTo(this.node)

    this.okWrapper = $(`<div class="input-group-append" id=""></div>`).appendTo(this.node)
    this.ok = $(`        
      <button class="btn kv-btn " type="button" id="${this.okButtonId}">${this.okButtonContent}</button>
      </div>`).appendTo(this.okWrapper)
              .css("margin-bottom", "2px")
    
    this.node.css("margin-right", "3px")
             .css("float", "left")
             .css("width", "50%")
    
    this.rendered = true
  }

  reset() {
    //TODO implement me
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

    let ui = App.ui
    let self = this

    // open file dialog when clicking "browse"
    this.browseButton.addEventListener('click', e => {
      // App.ui.ready && 
      if ( !self.browseDialogCurrentlyOpen) {
        dialog
          .showOpenDialog({ 
            properties: ['openFile']
          })
          .then(res => {
            if ( res.filePaths.length) {
              this.selectFile(res.filePaths[0])
              this.enableOkButton()
            }
            self.browseDialogCurrentlyOpen = false
          })
        self.browseDialogCurrentlyOpen = true
      } 
    })

    this.okButton.addEventListener('click', e => {
      this.disableBrowseButton()
      this.disableBrowseInput()
      this.okButtonLoadingStart()
      App.emit(Events.INPUT_FILE_SELECTED, this.selectedFile)
    })

    App.on(Events.EDITOR_LOADED, () => this.enable())

    App.on(Events.EDITOR_INPUT_LOADED, () => {
      this.okButtonLoadingStop()
      this.disableOkButton()
      // this.mode.disable()
      this.node.attr("title", this.selectedFile)
               .tooltip( {placement : 'bottom', container: "body"})
      $(`#${this.okButtonId}`).css("cursor", "pointer")
    }) 

    this.disable()

    // ready
    App.emit(Events.UI_COMPONENT_READY, this)
    return this;
  }

  useDefaultControls() {
    // this.mode.useDefaultControls()
    // this.mode.addOption("Cuda", "CU")
    //                .addOption("OpenCL", "CL")
    //                .selectOption('Cuda')
  }
}

// function defaultCreate(app) {
//   let ifdialog = new InputFileDialog( "file-select-group", "#top-toolbar-right", "Select a *.cu file...", app)
  
//   ifdialog.render()
//   ifdialog.disable() // disable file selection until the editor is ready
  
//   return ifdialog
// }


module.exports = InputToolbar