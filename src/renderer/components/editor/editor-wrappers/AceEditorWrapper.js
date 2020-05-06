
const {InternalError} = require('../../util/error')
const ace = require('ace-builds/src/ace')
require('ace-builds/src/mode-c_cpp');
require('ace-builds/src/theme-monokai');

function configureAce(wrapper) {
  let editor = wrapper.instance
  editor.getSession().setOption('useWorker', false)
  editor.getSession().setMode('ace/mode/c_cpp')
  editor.setTheme('ace/theme/monokai')
  editor.setValue(wrapper.value)
  editor.setReadOnly(true);
  editor.focus();
  editor.setAutoScrollEditorIntoView(true);
}

class AceEditorWrapper {

  constructor(location, value="") {
    this.location = location;
    this.name = "ace"
    this.instance = null

    this.value_ = false;
    this.isloaded_ = false;
  }

  load(sync=false) {
    if ( sync) {
      this.instance = ace.edit(this.location)
      configureAce(this)
      this.loaded = true
    } else {
      throw new InternalError("Async load for Ace Editor is not implemented")
    }
  }

  get loaded() { return this.isloaded; }

  set value(s) { 
    this.value = s;
  } 
}

module.exports = AceEditorWrapper

