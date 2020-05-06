const fs        = require('../../../util/fs')
const DUMMYDATA = require('../../../dummy-data')

module.exports = (app) => {
  const AMDLoader  = require('../../../../node_modules/monaco-editor/min/vs/loader')
  const AMDRequire = AMDLoader.require;
  const AMDDefine  = AMDRequire.define;

  const ui = app.ui
  let monaco = null;

  AMDRequire.config({
    baseUrl: fs.uriFromPath(__dirname),
    paths : { 
      'vs' : '../../../../node_modules/monaco-editor/min/vs'
    }
  });

  function createEditor(monaco) {
    return monaco.editor.create(document.getElementById(app.ui.editor.location), {
      language : 'cpp',
      glyphMargin: true,
      automaticLayout: true,
      contextmenu: true
    });
  }

  /*
   * Asynchronously load the editor and emit a completion("editor-loaded") event
   */
  AMDRequire(['vs/editor/editor.main'], (monaco) => {
    ui.editor.instance = createEditor(monaco)
    ui.emit('editor:loaded', monaco)
  });
  
  ui.on('editor:loaded', status => console.log(`Monaco Loaded with status: ${status.message}`))

  /*
   * Monaco finished loading
   */
  ui.on('editor:loaded', (ref) => {
    let monaco = ref
    let editor = ui.editor.instance

    ui.editor.monaco = monaco

    console.log("Loading input to the editor")
    fs.readFile(app.input.path, 'utf-8', (err, data) => {
      app.input.content = data
      editor.setValue(data);
      ui.emit('editor-input-loaded')
    })
  })

  ui.on('ui:resize', () => ui.editor.instance && app.ui.editor.instance.layout())

  /*
   * Monaco finished loading the input file
   */
  ui.on('editor-input-loaded', () => {
    if ( DUMMYDATA.kernels.length == 0)
      return;
    
    let editor = ui.editor.instance;
    let monaco = ui.editor.monaco;
    let decorations = []

    DUMMYDATA.kernels.forEach(kernel => {
      decorations.push({
        range: new monaco.Range(...(kernel.source.range)),
        options: {
          isWholeLine : true, 
          linesDecorationsClassName: 'editor-kernel-line-decoration',
          className : 'editor-kernel-line-highlight'
        }
      })
    })

    editor.deltaDecorations([], decorations)
  })

  /**
   * Force resize monaco with window resize
   */
  window.addEventListener('resize', () => {
    if ( ui.editor.instance)
      ui.editor.instance.layout()
  })

  window.$(`#${app.ui.editor.location}`).on('click', () => {
    console.log('resize')
    if ( ui.editor.instance)
      ui.editor.instance.layout()
  })
}