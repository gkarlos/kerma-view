require('selectize')

const dummydata = require("../../dummy-data")

module.exports = (app) => {
  let ui = app.ui
  let monaco = ui.monaco

  ui.selector.kernel.instance = $('#select-repo').selectize({
    valueField: 'id',
    searchField: 'name',
    maxItems: 1,
    create: false,
    render: {
        item : function(kernel, escape) {
          console.log(kernel)
          return `<span class="kernel-selection-selected-item">${kernel.source.name}</span>`
        },
        option: function(kernel, escape) {
          return `<div>
                    <div class="first-row">
                      <table>
                      <tr>
                        <td><span class="kernel-selection-kernel-name badge alert-info">${kernel.source.name}</span></td>
                        <td><span class="kernel-selection-kernel-signature">${kernel.source.signature}</span></td>

                      </tr>
                      </table>
                    </div>
                    <div class="second-row">
                      <span class="kernel-selection-second-row-title">src</span>
                      <span class="kernel-selection-second-row-value">${kernel.source.filename}</span>
                      <span class="kernel-selection-second-row-title">line</span>
                      <span class="kernel-selection-second-row-value">${kernel.source.range[0]}</span>
                    </div>
                  </div>`
        }
    }
  })

  ui.selector.launch.instance = $('#select-repo2').selectize({
    valueField: 'id',
    create: false,
    labelField: 'label',
    maxItems: 1,
    render: {
        item: function(launch, escape) {
          return `<span class="launch-selection-selected-item">
                    <span class="launch-selection-selected-item-title"> @line </span> 
                    <span class="launch-selection-selected-item-value">${launch.source.range[0]}</span> -
                    <span class="launch-selection-selected-item-more">${escape(launch.source.params)}</span>
                  </span>`
        },
        option: function(launch, escape) {
          return `<div class="list-item">
                    <div class="first-row">
                      <table>
                      <tr>
                        <td><span class="launch-selection-launch-params"></i>${escape(launch.source.params)}</span></td>
                        <td><span class="launch-selection-launch-arguments">${launch.source.arguments}</span></td>
                      </tr>
                      </table>
                    </div>
                    <div class="second-row">
                      <span class="launch-selection-second-row-title">caller</span>
                      <span class="launch-caller" title="caller" >${launch.caller.source.name}</span>
                      <span class="launch-selection-second-row-title">line</span>
                      <span class="kernel-source" title="src" >${launch.source.range[0]}</span>
                    </div>
                  </div>`
      }
    }
  })

  ui.selector.kernel.selectize = ui.selector.kernel.instance[0].selectize
  ui.selector.launch.selectize = ui.selector.launch.instance[0].selectize

  let kernelSelector = ui.selector.kernel.selectize
  let launchSelector = ui.selector.launch.selectize

  /* Disable until a kernel is selected */
  launchSelector.disable()

  /**
   * Once the source is loaded into the editor, load the dummy data to the list
   * For real data this should be triggered _after_ kermad has perfomed the initial
   * analysis to identify the kernels and their invocations
   */
  ui.on('editor-input-loaded', () => {
    dummydata.kernels.forEach(kernel => ui.selector.kernel.selectize.addOption(kernel)) 
  })

  /**
   * Kernel selected
   */
  kernelSelector.on('change', (value) => {
    launchSelector.enable()

    // Fill in the launches
    dummydata.kernels[value].launches.forEach( launch => {
      launchSelector.addOption(launch)
    });

    // Focus the kernel on the editor
    ui.editor.instance.revealLinesInCenter( dummydata.kernels[value].source.range[0],
                                            dummydata.kernels[value].source.range[2])
    
  })
}