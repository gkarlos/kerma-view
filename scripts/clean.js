var rimraf = require('rimraf')
var color = require('cli-color')

rimraf.sync('../docs/dev')
console.log(color.bold.cyan("**INFO**") + " Removed docs (./docs/dev)")