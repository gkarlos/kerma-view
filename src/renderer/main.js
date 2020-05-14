/**--util/cl.js-----------------------------------------------------/
 *
 * Part of the kerma project
 * 
 *------------------------------------------------------------------/
 * 
 * @file renderer/main.js
 * @author gkarlos
 * @module renderer/main
 * @description 
 *   Main entry of the renderer process
 * 
 *   The following steps are performed:
 * 
 *   - {@link app.ui} is initialized and components are loaded
 *  
 *//*---------------------------------------------------------------*/
 'use-strict'

const app              = require('electron').remote.app
const remote           = require('electron').remote;  
const settings         = remote.getGlobal('settings')
const mock             = require('../mock/cuda-source')
const {Memory}         = require('./components/memory')





// require('bootstrap')

// const session = app.session

/**
 * A reference to `app.ui`
 */
app.ui = require('./ui/ui')(app)

// ui.on('ui:reload', () => require("./components/editor/editor")(app))



// require("./components/selectors/kernel-selector")(app)
// require("./components/selectors/launch-selector")(app)
// require("./components/editor/editor")(app)
// // TODO https://developer.snapappointments.com/bootstrap-select

function createNewSession() {
  app.session = app.sessionManager.createNew()
  ui.emit('session:new')
}

$(() => {
  // ui.init()
  /**
   * Once the source is loaded into the editor, load the dummy data to the list
   * For real data this should be triggered _after_ kermad has perfomed the initial
   * analysis to identify the kernels and their invocations
   */

  // $('#button-analyze').on('click', () => {
  //   if ( !$('#button-analyze').hasClass('btn-disabled')) {
  //     console.log('yes')
  //     $('#button-analyze-play-icon').hide()
  //     $('#button-analyze-loading-icon').css('display', 'inline-block');
  //     $('#button-analyze-text').html('Analyzing...')
  //     setTimeout( () => { 
  //       $('#button-analyze-play-icon').show()
  //       $('#button-analyze-loading-icon').hide()
  //       $('#button-analyze-text').html('Analyze')
  //       $('#button-analyze').removeClass('btn-success')
  //       $('#button-analyze').addClass('btn-disabled')
  //     }, 2000 )
  //   }
  // })

  // let m = new Memory("myArray", "int")

  // 

  // $("#top-refresh-button").tooltip({placement : 'bottom'});
  // $('#top-refresh-button').on('click', () => {
  //   ui.reload()
  // })
  
  // ui.on('session:killed', () => {
  //   if ( app.session)
  //     console.log(`[info] session: killed: ${app.session.id}`)
  // })

  // ui.on('session:new', () => {
  //   console.log(`[info] session: new: ${app.session.id}`)
  // })

  // $("#top-restart-session-button").tooltip({placement: 'bottom'})
  // $("#top-restart-session-button").on("click", () => {
  //   ui.emit('session:killed')
  //   createNewSession()
  // })



  // function loadConsole() {
  //   app.session.console.loaded = true
  // }

  // $('#console-toggle-button').on('click', async () => {
  //   console.log(app.session.console)
  //   if ( !app.session.console.loaded) 
  //     require('./components/console')(app)
  //   session.console.visible = !session.console.visible
  //   $('#console-area').toggleClass('show')
  //   app.session.console.instance.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
  // })
  
  // /** 
  //  * At this point the editor is loaded we we can probably just
  //  * use the global.editor reference to refer to monaco. However,
  //  * this is technically a RACE and should in general be avoided.
  //  * The best solution is probably to load everything else before
  //  * we start using the global.editor reference and first check if 
  //  * undefined. If so report an error and exit. In a desktop app 
  //  * setting like this, this is probably even reasonanble to assume.
  //  */
  // console.log(global.editor)

  // createNewSession()
})