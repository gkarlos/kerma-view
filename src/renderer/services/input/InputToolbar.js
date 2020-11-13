const Component = require('@renderer/ui/component/Component')
const Events    = require('@renderer/events')
const {dialog}  = require('electron').remote
const {InternalError} = require('@common/util/error')
const App = require('@renderer/app')
const EventEmitter = require('events').EventEmitter;
const path = require('path')

/**
 * @memberof module:input
 */
class InputToolbar extends Component {

  static ID = "file-select-group"
  static LOCATION = "#header-left"

  #Emitter;

  constructor() {
    super(InputToolbar.ID, InputToolbar.LOCATION)
    this.node = null;
    this.enabled = true
    this.name = `InputFileDialog[${this.id}]`
    this.rendered = false

    // this.examples = null;\
    this.pathBrowseButton = null;
    this.pathExamplesButton = null;
    this.pathSelectButton = null;

    this.pathInput = null;
    this.argInput = null;


    this.ok = null;

    this.pathInputPrompt = "Input (.cu) file..."
    this.argInputPrompt = "Arguments..."

    // this.browseButtonId = `${this.id}-browse-button`

    this.browseInputId = `${this.id}-browse-input`
    this.browseDialogCurrentlyOpen = false

    this.okButtonId = `${this.id}-ok-button`
    this.selectedFile = null
    this.okButtonContent = "<i class=\"fas fa-check-circle\"></i>"
    this.okButtonContentLoading = "<span class=\"spinner-border spinner-border-sm\" role=\"status\" aria-hidden=\"true\"></span>"

    this.pathSelectButtonLoading = false

    this.#Emitter = new EventEmitter();
    App.ui.toolbar.editor = this
  }

  /** */
  pathSelectButtonLoadingStart() {
    this.pathSelectButtonLoading = true
    this.pathSelectButton.html(this.okButtonContentLoading);
    this.disablePathSelectButton();
  }

  /** */
  pathSelectButtonLoadingStop() {
    this.pathSelectButton.html(this.okButtonContent);
    // this.enableOkButton()
    this.pathSelectButtonLoading = false
  }

  /** */
  selectFile(path) {
    this.selectedFile = path
    this.pathInput.val(this.selectedFile)
    this.enableOkButton()
  }

  /** */
  __renderParts() {
    this.node   = $(`<div class="input-group input-group-sm" id="${this.id}"></div>`).appendTo(this.container)

    this.pathButtonsWrapper
      = $(`<div class="input-group-prepend btn-group btn-group-toggle" id="path-buttons-wrapper"></div>`).appendTo(this.node)

    this.pathBrowseButton = $(`
      <button class="btn kv-btn" type="button" id="path-browse-button">
        <i class="far fa-folder-open"></i>
      </button>
    `).appendTo(this.pathButtonsWrapper)
            .css("margin-bottom", "2px")
            .css("border-top-left-radius", "3px")
            .css("border-bottom-left-radius", "3px")

    this.pathExamplesButtonWrapper = $(`
      <div class="btn-group" title="Open an example">
      </div>
    `).appendTo(this.pathButtonsWrapper)
      .css("margin-bottom", "2px")

    this.pathExamplesButton = $(`
      <button class="btn kv-btn" type="button" id="path-examples-button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <i class="far fa-lightbulb"></i>
      </button>`).css("border-radius", "0px").appendTo(this.pathExamplesButtonWrapper);

    this.examplesDropdown = $(`
      <div class="dropdown-menu" aria-labelledby="path-examples-button">
      </div>`).appendTo(this.pathExamplesButton)

    for ( let suite in App.Examples) {
      this.examplesDropdown.append(
        $(`<h5 class="dropdown-header">${suite}</h5>`));

      for ( let example in App.Examples[suite]) {
        let exampleEntry = $(`<a class="dropdown-item" href="#">${example}</a>`).on("click", () => {
          this.setPath(path.resolve(App.Examples[suite][example].path))
          this.setArg(App.Examples[suite][example].args)
        })
        this.examplesDropdown.append(exampleEntry)
      }
    }


    // this.mode = new InputModeSelection('input-mode', '#input-browse-mode-prepend', App).render()

    this.pathInput  = $(`
      <input type="text" class="form-control" id="path-input" placeholder="${this.pathInputPrompt}" aria-label="" aria-describedby="">
    `).appendTo(this.node)

    this.pathSelectButtonWrapper = $(`<div class="input-group-append" id="path-select-button-wrapper"></div>`).appendTo(this.node)
    this.pathSelectButton = $(`
      <button class="btn kv-btn " type="button" id="path-select-button">${this.okButtonContent}</button>
      </div>`).appendTo(this.pathSelectButtonWrapper)
              .css("margin-bottom", "2px")
              .css("border-top-right-radius", "3px")
              .css("border-bottom-right-radius", "3px")

    this.argPre = $(`<div class="input-group-prepend" id="arg-input-pre"></div>`)
      .appendTo(this.node)
      .css("margin-bottom", "2px")
      .css("margin-left", "2px")

    $(`<div class="input-group-text"><i class="fas fa-terminal"></i></div>`)
      .appendTo(this.argPre)
      .css("border-top-left-radius", "3px")
      .css("border-bottom-left-radius", "3px")

    this.argInput  = $(`
      <input type="text" class="form-control" id="arg-input" placeholder="${this.argInputPrompt}" aria-label="" aria-describedby="">
    `).appendTo(this.node)
      .css("border-top-right-radius", "3px")
      .css("border-bottom-right-radius", "3px")

    this.node.css("margin-right", "3px")
             .css("float", "left")
             .css("width", "100%")
  }

  /** */
  disablePathBrowseButton() { this.pathBrowseButton && this.pathBrowseButton.prop('disabled', true) }

  /** */
  enablePathBrowseButton() { this.pathBrowseButton && this.pathBrowseButton.prop('disabled', false) }

  disablePathExamplesButton() { this.pathExamplesButton && this.pathExamplesButton.prop('disabled', true) }

  enablePathExamplesButton() { this.pathExamplesButton && this.pathExamplesButton.prop('disabled', false) }

  /** */
  disablePathInput() { this.pathInput.prop('disabled', true)  }

  /** */
  enablePathInput() { this.pathInput.prop('disabled', false) }

  /** */
  disablePathSelectButton() { this.pathSelectButton.prop('disabled', true).css("cursor", "not-allowed") }

  /** */
  enablePathSelectButton() { this.pathSelectButton.prop('disabled', false).css("cursor", "pointer") }

  /** */
  getPathInput() { return this.pathInput; }

  /** */
  getPathBrowseButton() { return this.pathBrowseButton; }

  /** */
  getPathSelectButton() { return this.pathSelectButton; }

  /** */
  disableArgInput() { this.argInput.prop('disabled', true); }

  /** */
  enableArgInput() { this.argInput.prop('disabled', false); }


  /** */
  disable() {
    // console.log("disabling")
    this.enabled = false
    this.disablePathBrowseButton()
    this.disablePathInput()
    this.disablePathSelectButton()
    return this
  }

  /** */
  enable() {
    // console.log("enabling")
    this.enabled = true
    this.enablePathBrowseButton()
    this.enablePathExamplesButton()
    this.enablePathInput()
    return this
  }

  /** */
  reset() {
    this.resetPathInput()
    this.resetArgInput()
    this.enable()
  }

  setPath(val) {
    this.pathInput.val(val)
    this.pathInput.prop('title', val);
    this.enablePathSelectButton()
  }

  setArg(val) {
    this.argInput.val(val);
    this.argInput.prop('title', val);
  }

  resetArgInput() {
    this.argInput.val("")
  }

  resetPathInput() {
    this.enablePathInput();
    this.pathInput.val(this.pathInputPrompt);
    this.pathSelectButtonLoadingStop();
  }

  enablePath() {
    this.enablePathBrowseButton();
    this.enablePathInput();
  }

  disablePath() {
    this.disablePathBrowseButton()
    this.disablePathExamplesButton()
    this.pathSelectButtonLoadingStop();
    this.disablePathInput()
  }

  disableArg() {
    this.disableArgInput();
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

    this.pathInput.on("change keydown paste input", () => {
      if ( self.pathInput.val().length > 0)
        self.enablePathSelectButton();
      else
        self.disablePathSelectButton();
    })

    // open file dialog when clicking "browse"
    this.pathBrowseButton.on("click", e => {
      if ( !self.browseDialogCurrentlyOpen) {
        dialog
          .showOpenDialog({
            properties: ['openFile']
          })
          .then(res => {
            if ( res.filePaths.length) {
              self.setPath(res.filePaths[0])
            }
            self.browseDialogCurrentlyOpen = false
          })
        self.browseDialogCurrentlyOpen = true
      }
    })

    this.pathSelectButton.on('click', e => {
      this.disablePathInput();
      this.pathSelectButtonLoadingStart()
      this.#Emitter.emit("fileSelect", this.pathInput.val());
    })

    // App.on(Events.EDITOR_INPUT_LOADED, () => {
    //   this.pathSelectButtonLoadingStop()
    //   this.disableOkButton()
    //   // this.mode.disable()
    //   this.node.attr("title", this.selectedFile)
    //            .tooltip( {placement : 'bottom', container: "body"})
    //   $(`#${this.okButtonId}`).css("cursor", "pointer")
    // })

    this.disable()
    this.rendered = true
    // App.emit(Events.UI_COMPONENT_READY, this)
    return this;
  }


  getPath() {
    return this.pathInput.val()
  }

  getArgs() {
    return this.argInput.val()
  }

  on(event, cb) { this.#Emitter.on(event, cb); }

  useDefaultControls() {
    // this.mode.useDefaultControls()
    // this.mode.addOption("Cuda", "CU")
    //                .addOption("OpenCL", "CL")
    //                .selectOption('Cuda')
  }
}

module.exports = InputToolbar