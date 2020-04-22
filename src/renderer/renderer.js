const {Editor, MonacoEditor} = require('./editor')

console.log("In the renderer")

window.$ = window.jQuery = require('jquery');

let editor;

console.log("Setting the value")

$(function(){
  // editor = ace.edit('editor')
  // $('#editor').text('int main(int x){}')

  editor = new Editor('kernel-editor');
  editor.setContent("\
__global__ void vectoradd(int *a, int *b, int *c)\n\
{\n\
  // this function will change to garbage in 5s\n\
  c[threadIdx.x] = a[threadIdx.x] + b[threadIdx.x]\n\
}\n")
  editor.load()


  setTimeout(() => {
    editor.setContent("asdasdasdasd")
  }, 5000);


  let editor2 = new MonacoEditor();
  console.log(editor2.editor)

}())