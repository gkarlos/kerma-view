/**-renderer/components/selectrons/kernel-selector.js--------------/
*
* Part of the kerma project
* 
*------------------------------------------------------------------/
* 
* @file renderer/components/selectrons/kernel-selector.js
* @author gkarlos 
* @module renderer/components/selectrons/kernel-selector
* @description 
*   Defines the kernel selector component at the top of the editor
*  
*-----------------------------------------------------------------*/

require('selectize')

const {InternalError} = require('../../../util/error')

const mock = require('../../../mock/cuda-source')


const LOCATION = '#select-repo'

function renderSelected(kernel, escape) {
  return `<span class="kernel-selection-selected-item">
           ${kernel.source.name} 
         </span>`
}

function renderOption(kernel, escape) {
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


module.exports = app => {
  if ( !app)
    throw InternalError('kernel-selector module requires an app reference and none was passed')
  
  let ui = app.ui

  ui.selector.kernel.instance = $(LOCATION).selectize({
    valueField: 'id',
    maxItems: 1,
    create: false,
    render : {
      item : renderSelected,
      option : renderOption
    }
  })
  
  if ( !ui.selector.kernel.instance[0])
    throw new InternalError(`Failed to create kernel-selector at DOM location '${LOCATION}'`)

  ui.selector.kernel.selectize = ui.selector.kernel.instance[0].selectize

  ui.selector.kernel.selectize.on('change', id => {
    // Maybe this line should be under editor.js as response to ui.on('kernel-selected)
    ui.editor.instance.revealLinesInCenter( mock.kernels[id].source.range[0], mock.kernels[id].source.range[2])
    ui.emit('kernel-selected', id)
  })
}