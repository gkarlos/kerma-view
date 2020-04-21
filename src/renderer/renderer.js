const {Editor} = require('./editor')

console.log("In the renderer")

window.$ = window.jQuery = require('jquery');

let editor;

console.log("Setting the value")

$(function(){
  // editor = ace.edit('editor')
  // $('#editor').text('int main(int x){}')

  editor = new Editor('kernel-editor');
  editor.load()

  setTimeout(() => {
    editor.setText("asdasdasdasd")
  }, 5000);

}())