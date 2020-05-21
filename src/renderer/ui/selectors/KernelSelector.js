/**-renderer/components/selectors/KernelSelector.js-----------------/
*
* Part of the kerma project
* 
*-------------------------------------------------------------------/
* 
* @file renderer/components/selectors/KernelSelector.js
* @author gkarlos 
*  
*------------------------------------------------------------------*/

'use-strict'

const {InternalError} = require('../../../util/error')
const Events = require('../../events')
require('selectize')

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

const Selector = require('./Selector')

/**
 * @memberof module:renderer/components/selectors
 */
class KernelSelector extends Selector {
  constructor(id, container, app) {
    super(id, container, app)
    this.name = `KernelSelector[${id}]`;
  }

  render() {
    // this.app.registerComponent(this)
    this.node = $(`
      <div class="editor-toolbar-group d-flex" id="kernel-selection-group">
        <div class="input-group-prepend pre" id="kernel-list-dropdown-pre">
          <div class="input-group-text" id="kernel-list-dropdown-pre-text">Kernel</div>
        </div>
        <div class="control-group align-middle dropdown" id="kernel-list-dropdown" >
          <select id="${this.id}" class="repositories input-group-sm"></select>
        </div>
      </div>
    `).appendTo(this.container)
    
    this.selectize = $(`#${this.id}`).selectize({
      valueField: 'id',
      maxItems: 1,
      create: false,
      render : {
        item : renderSelected,
        option : renderOption
      }
    })[0].selectize

    if ( !this.selectize) throw new InternalError(`Failed to create KernelSelector '${this.id}'`)
    
    if ( !this.enabled) this.selectize.disable()

    this.rendered = true
    return this
  }

  useDefaultControls() {
    let mock = require('../../../mock/cuda-source')

    this.disable()

      //highlight the kernels in the editor
    this.selectize.on('change', id => {
      this.app.ui.editor.instance.revealLinesInCenter( mock.kernels[id].source.range[0], mock.kernels[id].source.range[2])
      this.app.emit(Events.INPUT_KERNEL_SELECTED, id)
    })
      
    this.app.on(Events.EDITOR_INPUT_LOADED, () => {
      this.enable()
      mock.kernels.forEach(kernel => this.addOption(kernel)) 
    })
  }
}


module.exports = KernelSelector