var rimraf = require('rimraf')
var color = require('cli-color')

rimraf.sync('../docs/dev')
console.log(color.bold.cyan("**INFO**") + " Removed docs (./docs/dev)")

rimraf.sync('../node_modules')
console.log(color.bold.cyan("**INFO**") + " Removed node_modules (./node_modules)")