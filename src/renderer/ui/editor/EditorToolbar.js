
const Component      = require('@renderer/ui/component/Component')
const EditorTabs     = require('@renderer/ui/editor/EditorTabs')
const CodeNavToolbar = require('@renderer/ui/toolbars/CodeNavToolbar')
const Events         = require('@renderer/events')
const App            = require('@renderer/app')

/**
 * @memberof module:editor
 */
class EditorToolbar extends Component {
  constructor(id, container) {
    super(id, container)
    this.node = null
    this.tabs = new EditorTabs('editor-tabs', `#${this.id}`, App, true)
    this.codenav = new CodeNavToolbar('codenav-toolbar', `#${this.id}`, App, true)
  }

  render() {
    if ( ! this.rendered ) {
      this.node = $(`<div id=${this.id} class="nav"></div>`).appendTo(this.container)
                    .css('display', 'flex')
                    // .css('position', 'absolute')
                    // .css('right', '0px')

      this.tabs.render()
      this.codenav.render()

      this.rendered = true
      App.emit(Events.UI_COMPONENT_READY, this)
    } 
    return this;
  }

  useDefaultControls() {
    this.tabs.useDefaultControls()
    this.codenav.useDefaultControls()
  }
}

module.exports = EditorToolbar