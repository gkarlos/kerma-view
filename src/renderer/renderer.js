const app              = require('electron').remote.app
const remote           = require('electron').remote;  
const settings         = remote.getGlobal('settings')
const mock             = require('../mock/cuda-source')
const {Memory}         = require('./components/memory')

/** Some Globals  */
const $ = window.$ = window.jQuery = require('jquery');
require('popper.js')
require('bootstrap')

// const session = app.session


// ui.on('ui:reload', () => require("./components/editor/editor")(app))

$(() => {

  const ui = app.ui = require('./ui/ui')(app)

  ui.init()

  require("./components/editor/editor")(app)
  require("./components/selectors/kernel-selector")(app)
  require("./components/selectors/launch-selector")(app)

  // TODO https://developer.snapappointments.com/bootstrap-select/

  


  require("./components/input-file-dialog")(app)
  require('./components/info-button')(app)
  


  /**
   * Once the source is loaded into the editor, load the dummy data to the list
   * For real data this should be triggered _after_ kermad has perfomed the initial
   * analysis to identify the kernels and their invocations
   */
  ui.on('editor-input-loaded', () => {
    mock.kernels.forEach(kernel => {
      console.log(kernel)
      ui.selector.kernel.selectize.addOption(kernel)
    }) 
  })

  $('#button-analyze').on('click', () => {
    if ( !$('#button-analyze').hasClass('btn-disabled')) {
      console.log('yes')
      $('#button-analyze-play-icon').hide()
      $('#button-analyze-loading-icon').css('display', 'inline-block');
      $('#button-analyze-text').html('Analyzing...')
      setTimeout( () => { 
        $('#button-analyze-play-icon').show()
        $('#button-analyze-loading-icon').hide()
        $('#button-analyze-text').html('Analyze')
        $('#button-analyze').removeClass('btn-success')
        $('#button-analyze').addClass('btn-disabled')
      }, 2000 )
    }
  })

  $("#top-refresh-button").tooltip({placement : 'top'});

  let m = new Memory("myArray", "int")

  $('#button-add-memory').on('click', () => {
    const {Memory} = require('./components/memory')
    let m = new Memory("myArray", "int", [1024])
    console.log(m)
    m.render('#heatmap-example')
  })

  $('#top-refresh-button').on('click', () => {
    ui.reload()
  })

  function loadConsole() {
    app.session.console.loaded = true
  }

  $('#console-toggle-button').on('click', async () => {
    console.log(app.session.console)
    if ( !app.session.console.loaded) 
      require('./components/console')(app)
    session.console.visible = !session.console.visible
    $('#console-area').toggleClass('show')
    app.session.console.instance.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
  })
  
  /** 
   * At this point the editor is loaded we we can probably just
   * use the global.editor reference to refer to monaco. However,
   * this is technically a RACE and should in general be avoided.
   * The best solution is probably to load everything else before
   * we start using the global.editor reference and first check if 
   * undefined. If so report an error and exit. In a desktop app 
   * setting like this, this is probably even reasonanble to assume.
   */
  console.log(global.editor)
})