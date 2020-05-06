const {InternalError} = require('../../util/error')
const path  = require('path')
const fs    = require('../../util/fs')
const locks = require('locks')

///
/// Monaco AMD loading stuff
///



// workaround monaco-css not understanding the environment
console.log(self)
self.module = undefined;
///
///

const syncLoadLock = locks.createMutex();


function configureMonaco(wrapper) {
  let editor = wrapper.instance
  editor.setValue(wrapper.value)
}

var ok = false

// value: [
//   'function x() {',
//   '\tconsole.log("Hello world!");',
//   '}'
// ].join('\n'),

function loadMonacoSync(wrapper) {
  throw new InternalError("Sync load for Monaco Editor is not implemented yet")
}

/**
 * Async load the Monaco editor
 * @param {} wrapper 
 */
function loadMonacoAsync(wrapper) {
  console.log("loading async")
  amdRequire(['vs/editor/editor.main'], function() {
    wrapper.instance = monaco.editor.create(document.getElementById(wrapper.location));
    wrapper.isloaded = true
    configureMonaco(wrapper)
  });
}

class MonacoEditorWrapper {
  constructor(location, value) {
    console.log("MonacoEditorWrapper.constructor")
    this.location = location;
    this.value = value;
    this.name = "monaco"
    this.instance = null;
    this.isloaded = false;
  }

  load(sync=false) {
    return sync? loadMonacoSync(this)
               : loadMonacoAsync(this)

    // loadMonaco(this, editorInstance => {
    //   console.log("loadMonaco.callback")
    //   this.instance = editorInstance;
    //   this.isloaded = true;
    //   configureMonaco(this)
    // })

    // console.log("syncing")
    
    // console.log("done")
  }

  get loaded() { return this.isloaded }

  //   console.log(this.loaded)
  //   console.log(this.editorInstance)

  //   setTimeout(() => {
  //     console.log(this.loaded)
  //     console.log(this.editorInstance)  
  //   }, 3000)
  // }
}



module.exports = {
  MonacoEditorWrapper
}