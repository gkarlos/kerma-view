const Component               = require('@renderer/ui/component/Component')
const Memory                  = require('@renderer/models/memory').Memory
const MemoryVisualizerToolbar = require('./MemoryVisualizerToolbar')
const {InternalError}         = require('@common/util/error')

/**
 * @memberof module:memory-ui
 * @description 
 *   Visualizes a memory object
 *   ### Important
 *    Even though the API accepts 3D indexing, 3D arrays are currently not generally supported 
 */
class MemoryVisualizer extends Component {
  static defaultClassName = 'memory-visualizer'

  /**
   * 
   * @param {Memory} memory The memory to visualize
   * @param {String} id An id for the DOM element
   * @param {String} container A selector string for the container of this MemoryVisualizer
   */
  constructor(memory, id, container) {
    if ( !memory)
      throw new InternalError("MemoryVisualizer.contructor() requried argument memory is missing")
    if ( !memory instanceof Memory)
      throw new InternalError("MemoryVisualizer.constructor() first argument must be an instance of Memory")
    super(id, container)
    this.name = `MemoryVisualizer[${id}]`
    this.memory_ = memory
    this.reads_ = []
    this.writes_ = []
    this.node = null
    this.toolbar = new MemoryVisualizerToolbar(`${id}-toolbar`, `#${id}`, this)
    
    this.style = {

    }

    this.rendered = false
  }

  get id() { return this.id_ }
  get container() { return this.container_ }
  get memory() { return this.memory_ }
  get reads() { return this.reads_ }
  get writes() { return this.writes_ }


  render() {
    this.node = $(`
      <div id="${this.id}" class="${MemoryVisualizer.defaultClassName} list-group-item">
      </div>
    `).appendTo(this.container)
    
    this.toolbar.render()

    $(`
      <div>
        Cells
      </div>
    `).appendTo(this.node)

    this.rendered = true;
    return this.node
    // d3.select(this.container).append('svg')
  }

  readIndex(x=1, y=1, z=1) {
    if (z > 1) 
      throw new InternalError()
  }

  writeIndex(x=1, y=1, z=1) {

  }

  /**
   * Mark a contiguous range as read, starting from the 3-D index specified by {@link start}
   * up to the 3-D index specified by {@link stop}
   * 
   * Normal C/C++-like, 0-based, non-inclusive indexing rules apply
   * 
   * If no {@link stop} is provided every index after {@link start} will be marked
   * 
   * Ommited dimensions are implicitly counted as 0
   * 
   * 
   * @example
   * readRange({x: 0, y: 2}, {x: 2, y: 2}) // will mark 2nd element of 1st row up to 3rd element of 3rd row
   * readRange({x: 0}, {x: 2}) // will mark the first two rows
   * readRange({x: 2, y: 3}) // will mark from row 3 col 4 until the end
   * readRange({x: 0}) // will mark everything
   * readRange() // equivalent to readRange({x: 0}), will mark everything
   * 
   * @param {Object} [start] The starting index
   * @param {Integer} [start.x]  Value for the x dimension 
   * @param {Integer} [start.y] Value for the y dimension
   * @param {Integer} [start.z] Value for the z dimension
   * @param {Object} [stop] The ending index (non-inclusive)
   * @param {Integer} [stop.x] Value for the x dimension 
   * @param {Integer} [stop.y] Value for the y dimension 
   * @param {Integer} [stop.z] Value for the z dimension 
   */
  readRange(start,stop) {
    
  }

  writeRange(start,stop) {

  }

  disableLocation(x=1, y=1, z=1) {

  }

  disableRange(xStart, xStop, yStart, yStop, zStart, zStop) {

  }

  useDefaultControls() {

  }
}

module.exports = MemoryVisualizer