/**--renderer/components/selectors/KernelLaunchSelector.js----------/
*
* Part of the kerma project
* 
*-------------------------------------------------------------------/
* 
*
*  
*------------------------------------------------------------------*/


const {InternalError} = require('@common/util/error')
const mock = require('@mock/cuda-source')
const Events = require('@renderer/events')
require('selectize')


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

const Selector = require('./Selector')

/**
 * @memberof module:selectors
 */
class KernelLaunchSelector extends Selector {
  constructor(id, container, app) {
    super(id, container, app)
    this.name = `KernelLaunchSelector[${this.id}]`
  }

  render() {
    this.node = $(`
      <div class="editor-toolbar-group" id="launch-selection-group">
        <div class="input-group-prepend pre" id="launch-list-dropdown-pre">
          <div class="input-group-text" id="launch-list-dropdown-pre-text">Launch</div>
        </div>
        <div class="control-group align-middle dropdown" id="launch-list-dropdown" >
          <select id="${this.id}" class="repositories"></select>
        </div>
      </div>
    `).appendTo(this.container)

    this.selectize = $(`#${this.id}`).selectize({
      valueField: 'id',
      maxItems: 1,
      create: false,
      render: {
        item: renderSelected,
        option: renderOption
      }
    })[0].selectize

    if ( !this.selectize) throw new InternalError(`Failed to create KernelLaunchSelector '${this.id}'`)
    
    if ( !this.enabled) this.selectize.disable()

    this.rendered = true
    return this
  }

  useDefaultControls() {
    let mock = require('../../../mock/cuda-source')

    this.disable()

    this.app.on(Events.INPUT_KERNEL_SELECTED, id => {
      this.enable()
      mock.kernels[id].launches.forEach( launch => this.addOption(launch) )
    })
  }

  // static defaultCreate(id, container, app) {
  //   if ( !app)
  //     throw new InternalError('KernelLaunchSelector.defaultCreate requires an app reference and none was passed')

  //   let kernelLaunchSelector = new KernelLaunchSelector(id, container, app).render().disable()

  //   let mock = require('../../../mock/cuda-source')
    
  //   let ui = app.ui

  //   ui.on(Events.INPUT_KERNEL_SELECTED, id => {
  //     kernelLaunchSelector.enable()
  //     mock.kernels[id].launches.forEach( launch => kernelLaunchSelector.addOption(launch) )
  //   })
  // }
}

module.exports = KernelLaunchSelector
  //{

  // if ( !app)
  //   throw new InternalError('launch-selector module requires an app reference and none was passed')
  
  // let ui = app.ui

  // ui.selector.launch.instance = $(`LOCATION`).selectize({
  //   valueField: 'id',
  //   maxItems: 1,
  //   create: false,
  //   render: {
  //     item: renderSelected,
  //     option: renderOption
  //   }
  // })

  // if ( !ui.selector.launch.instance[0])
  //   throw new InternalError(`Failed to create launch-selector at DOM location '${LOCATION}'`)

  // ui.selector.launch.selectize = ui.selector.launch.instance[0].selectize
  // ui.selector.launch.selectize.disable()

  // // ui.selector.launch.selectize.on('initialize', () => {
  // //   console.log("initialize")
    
  // //   ui.selector.launch.selectize.disable()
  // // })

  // // console.log(ui.selector.launch.instance)
  // // console.log($(LOCATION))

  // // let launchSelector = ui.selector.launch.selectize

  // // /* Disable until a kernel is selected */
  // // launchSelector.disable()
  
  // ui.on('kernel-selected', id => {
  //   ui.selector.launch.selectize.enable()
  //   mock.kernels[id].launches.forEach( launch => ui.selector.launch.selectize.addOption(launch) )
  // })
// }