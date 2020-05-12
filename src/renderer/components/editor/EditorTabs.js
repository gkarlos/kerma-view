/**
 * 
 */

const Component = require('../component')
const InternalError = require('../../../util/error')
const Events = require('../../events')

function searchTabs(tabs, title) {
  for ( let i = 0; i < tabs.length; ++i)
    if ( tabs[i].title === title)
      return true
  return false
}

/**
 * @class
 * @memberof module:renderer/components/editor
 */
class EditorTabs extends Component {
  constructor(id, container, app) {
    super()
    this.id = id
    this.container = container
    this.tabs = []
    this.size = 0;
    this.selected = null
    this.app = app
    this.node = $(`<ul id="${this.id}" role="tablist"> </ul>`).addClass("nav").addClass("nav-tabs")
  }

  /**
   * Add a new tab with a given title to the tab list
   * 
   * @param {string} title 
   * @throws {InternalError} if a tab with that title already exists
   */
  addNew(title) {
    if ( searchTabs(this.tabs, title))
      throw new InternalError(`EditorTabs.addNew: Attempted to insert duplicate tab '${title}'`)
    
    let newTab = { 
      title: title, 
      node: $(`              
        <li class="nav-item" id="tab-${title}">
          <a class="nav-link" href="#" role="tab">${title}</a>
        </li>
      `)
    }

    this.tabs.push(newTab)
    this.node.append(newTab.node)

    newTab.node.on('click', () => {
      this.select(newTab.title)
      console.log(`[info] User selected editor tab: ${newTab.title}`)
      this.app.ui.emit(Events.EDITOR_TAB_SELECTED, title)
    })
    return this;
  }

  /**
   * Select one of the available tabs
   * 
   * @param {string} title
   * @throws {InternalError} if no tab with that title exists 
   */
  select(title) {
    for ( let i = 0; i < this.tabs.length; ++i) {
      if ( this.tabs[i].title === title) {
        if ( this.selected)
          this.selected.node.children('a').removeClass("active")
        this.tabs[i].node.children('a').addClass('active')
        this.selected = this.tabs[i] 
        return this;
      }
    }
    throw new InternalError(`EditorTabs.select: Attempted to select non-existent tab '${title}'`)
  }

  render() {
    if ( this.rendered )
      return console.log(`[warn] multiple render() calls for ${this.name}. This is a no-op`)
    this.node.appendTo(this.container)
    this.rendered = true;
    return this;
  }
}

module.exports = EditorTabs