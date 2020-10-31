/** 
 * (Pre)-Main entry point for the application. Its job is to 
 * perform some global configuration and invoke {@link module:renderer/app~App.main}
 * @module main
 * @category Renderer
 * @subcategory main
 */

'use-strict'
require('v8-compile-cache')
require('module-alias/register')
// require('jquery.resize')
require('./extensions/jquery')

const App = require('@renderer/app')
App.main()