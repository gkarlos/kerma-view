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
const Events = require('../../events')

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

const Component = require('../component')

class KernelSelector extends Component {
  constructor(id, container, app) {
    super()
    this.id = id;
    this.container = container;
    this.app = app;
    this.name = `KernelSelector[${id}]`;
    this.options = [];
    this.selected = null;
    this.selectize = null;
    this.enabled = true
  }

  /**
   * Add a list of kernels to this selector
   * 
   * @param {*} kernels 
   */
  addOptions(kernels) { kernels.forEach(kernel => this.addOption(kernel)) }

  addOption(kernel) {
    if (kernel)
      this.options.push(kernel)
    if ( this.rendered)
      this.selectize.addOption(kernel)
  }

  disable() {
    this.enabled = false
    this.rendered && this.selectize.disable()
    return this
  }

  enable() {
    this.enabled = true
    this.rendered && this.selectize.enable()
    return this
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
}

/**
 * Create a KernelSelector and define the default behavior
 * 
 * @param {*} app A reference to the app
 */
function defaultCreate(id, container, app) {
  if ( !app)
    throw new InternalError('KernelSelector.defaultCreate requires an app reference and none was passed')

  let kernelSelector = new KernelSelector(id, container, app).render().disable()

  let ui = app.ui

  ui.on(Events.UI_READY, () => {
    //highlight the kernels in the editor
    kernelSelector.selectize.on('change', id => {
      app.ui.editor.instance.revealLinesInCenter( mock.kernels[id].source.range[0], mock.kernels[id].source.range[2])
      app.ui.emit(Events.INPUT_KERNEL_SELECTED, id)
    })
    
    ui.on(Events.EDITOR_INPUT_LOADED, () => {
      kernelSelector.enable()
      require('../../../mock/cuda-source').kernels.forEach(kernel => {
        ui.toolbar.main.kernelSelector.addOption(kernel)
      }) 
    })
  })

  return kernelSelector
}

module.exports = {
  KernelSelector,
  defaultCreate
}