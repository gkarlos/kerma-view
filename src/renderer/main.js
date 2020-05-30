'use-strict'
require('v8-compile-cache')
require('module-alias/register')

const path = require('path')
require('app-module-path').addPath(path.join(__dirname, "../"))

const App = require('@renderer/app')

App.main()