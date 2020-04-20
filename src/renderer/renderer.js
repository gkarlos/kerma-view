const {Editor} = require('./editor')

console.log("In the renderer")

window.$ = window.jQuery = require('jquery');

const ace = require("../../node_modules/ace-builds/src-noconflict/ace")

let editor;

console.log("Setting the value")

$(() => {
  // editor = ace.edit('editor')
  // $('#editor').text('int main(int x){}')

  editor = new Editor('editor');
})