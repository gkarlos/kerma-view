
const Component  = require('renderer/ui/component/Component')
const EditorTabs = require('renderer/ui/editor/EditorTabs')
const CodeNavToolbar = require('renderer/ui/toolbars/CodeNavToolbar')
const Events     = require('renderer/events')

class EditorToolbar extends Component {
  constructor(id, container, app) {
    super(`EditorToolbar[${id}]`)
    this.id = id
    this.container = container
    this.app = app
    this.node = null
    this.tabs = new EditorTabs('editor-tabs', `#${this.id}`, this.app, true)
    this.codenav = new CodeNavToolbar('codenav-toolbar', `#${this.id}`, this.app, true)
  }

  render() {
    if ( ! this.rendered ) {
      this.node = $(`<div id=${this.id} class="nav"></div>`).appendTo(this.container)
                    .css('display', 'flex')

      this.tabs.render()
      this.codenav.render()

      this.rendered = true
      this.app.emit(Events.UI_COMPONENT_READY, this)
    } 
    return this;
  }

  useDefaultControls() {
    this.tabs.useDefaultControls()
    this.codenav.useDefaultControls()
  }
}

module.exports = EditorToolbar