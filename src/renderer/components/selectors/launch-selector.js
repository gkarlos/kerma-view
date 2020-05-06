/**--renderer/components/selectrons/launch-selector.js--------------/
*
* Part of the kerma project
* 
*------------------------------------------------------------------/
* 
* @file renderer/components/selectrons/launch-selector.js
* @author gkarlos 
* @module renderer/components/selectrons/launch-selector
* @description 
*   Defines the kernel-launch selector component at the top 
*   of the editor
*  
*-----------------------------------------------------------------*/

require('selectize')

const {InternalError} = require('../../../util/error')

const mock = require('../../../mock/cuda-source')

const LOCATION = '#select-repo2'

function renderSelected( launch, escape) {
  return `<span class="launch-selection-selected-item">
            <span class="launch-selection-selected-item-title"> @line </span> 
            <span class="launch-selection-selected-item-value">${launch.source.range[0]}</span> -
            <span class="launch-selection-selected-item-more">${escape(launch.source.params)}</span>
          </span>`
}

function renderOption( launch, escape) {
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

module.exports = app => {
  if ( !app)
    throw new InternalError('launch-selector module requires an app reference and none was passed')
  
  let ui = app.ui

  ui.selector.launch.instance = $(LOCATION).selectize({
    valueField: 'id',
    maxItems: 1,
    create: false,
    render: {
      item: renderSelected,
      option: renderOption
    }
  })

  if ( !ui.selector.launch.instance[0])
    throw new InternalError(`Failed to create launch-selector at DOM location '${LOCATION}'`)

  ui.selector.launch.selectize = ui.selector.launch.instance[0].selectize
  ui.selector.launch.selectize.disable()

  // ui.selector.launch.selectize.on('initialize', () => {
  //   console.log("initialize")
    
  //   ui.selector.launch.selectize.disable()
  // })

  // console.log(ui.selector.launch.instance)
  // console.log($(LOCATION))

  // let launchSelector = ui.selector.launch.selectize

  // /* Disable until a kernel is selected */
  // launchSelector.disable()
  
  ui.on('kernel-selected', id => {
    ui.selector.launch.selectize.enable()
    mock.kernels[id].launches.forEach( launch => ui.selector.launch.selectize.addOption(launch) )
  })
}