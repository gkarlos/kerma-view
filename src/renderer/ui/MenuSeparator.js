/**
 * @module MenuSeparator
 * @category ui
 */

const Component = require('./component/Component')

class MenuSeparator extends Component {
  constructor(id, container) {
    super(id, container)
  }

  render() {
    this.node = $(`
      <div id='${this.id}' class="border-left d-sm-none d-md-block " style="width: 0px;"></div>
    `).appendTo(this.container)
      .css('margin-left', '10px')
      .css('margin-right', '5px')
      .css('margin-top', '2px')

    this.rendered = true;
    return this;
  }
}


module.exports = MenuSeparator