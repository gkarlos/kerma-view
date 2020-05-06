const app              = require('electron').remote.app
const {InternalError}  = require('../../util/error')
const d3               = require('d3')
const CalendarHeatmap  = require('calendar-heatmap-mini')
const {isString}       = require('../../util/traits')
const _ = require('lodash');

function validShape(shape) {
  if ( !shape || shape.length == 0 || shape.length > 3)
    return false
  if ( shape.length > 1 && shape[1] == 0)
    return false
  if ( shape.length > 2 && shape[2] == 0)
    return false
  return true
}

let countDimensions = (shape) => 1 + (shape[1] > 1) + (shape[2] > 1)

/**
 * Check if a location exists in the DOM
 * 
 * @param   {String} location A DOMString
 * @returns {@link location} if the location exists
 *          {@link null} if {@link location} is not a String
 * @throws InternalError if {@link location} is not null but the location
 *         is not a valid DOM element
 */
function checkLocation(location) {
  if ( !isString(location))
    return null;
  let loc = document.querySelector(location)
  if ( typeof(loc) == 'undefined')
    throw new InternalError(`MemoryRenderer: Could not find location '${location}'`)
  return location
}

function getContainerWidth (container) {
  var width = d3.select(container)
    // get the width of div element
    .style('width')
    // take of 'px'
    .slice(0, -2)
  // return as an integer
  return Math.round(Number(width))
}

/**
 * This class is responsible for displaying a Memory object
 * It constructs a heatmap-like element at a given location
 */
class MemoryRenderer {

  settings_ = {
    container : null,
    width : 140,
    height : 120,
  }

  memory = null

  constructor( memory, options) {
    this.memory = memory
    this.settings_.container = options? options.container : null
  }

  get settings() { return this.settings_ }

  get container() { return this.settings_.container }
  
  set container(location) { this.settings_.container = checkLocation(location); }

  render(location=null) {
    if ( location)
      this.settings_.container = checkLocation(location);
    if ( !this.settings_.container)
      throw new InternalError('MemoryRenderer: No container specified')
    var data = new Array();
    var xpos = 1; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
    var ypos = 1;
    var width = 15;
    var height = 15;
    var click = 0;

    function gridData() {  
      // iterate for rows	
      for (var row = 0; row < 10; row++) {
        data.push( new Array() );
        
        // iterate for cells/columns inside rows
        for (var column = 0; column < 64; column++) {
          data[row].push({
            x: xpos,
            y: ypos,
            width: width,
            height: height,
            click: click
          })
          // increment the x position. I.e. move it over by 50 (width variable)
          xpos += width;
        }
        // reset the x position after a row is complete
        xpos = 1;
        // increment the y position for the next row. Move it down 50 (height variable)
        ypos += height;	
      }
      return data;
    }

    var gridData = gridData();	

    var grid = d3.select("#heatmap-example")
      .append("svg")
      .attr("width", getContainerWidth("#heatmap-example"))
      .attr("height", height * 10 + 5)
      // .style("preserveAspectRatio", "xMidYMid meet")
      
    var row = grid.selectAll(".row")
      .data(gridData)
      .enter().append("g")
      .attr("class", "row");
      
    var column = row.selectAll(".square")
      .data(function(d) { return d; })
      .enter().append("rect")
      .attr("class","square")
      .attr("x", function(d) { return d.x; })
      .attr("y", function(d) { return d.y; })
      .attr("width", function(d) { return d.width; })
      .attr("height", function(d) { return d.height; })
      .style("fill", "#fff")
      .style("stroke", "#222")
      .style('padding', '2px')
      .style('overflow-y', 'scroll')
      .on('click', function(d) {
           d.click ++;
         if ((d.click)%4 == 0 ) { d3.select(this).style("fill","#fff"); }
         if ((d.click)%4 == 1 ) { d3.select(this).style("fill","#2C93E8"); }
         if ((d.click)%4 == 2 ) { d3.select(this).style("fill","#F56C4E"); }
         if ((d.click)%4 == 3 ) { d3.select(this).style("fill","#838690"); }
        });
  }
}

/**
 * Represends a Memory range
 */
class Memory {
  
  /**
   * Delegate rendering
   */
  renderer = null;

  constructor(name, type, shape=[1,1,1]) {
    if ( !validShape(shape) )
      throw new InternalError("Invalid shape @ Memory.constructor: '" + shape + "'")
    
    this.name_ = name
    this.shape_ = [shape[0] || 1, shape[1] || 1, shape[2] || 1]
    this.dim_ = { 
      x : this.shape[0], // || 1,
      y : this.shape[1], //|| 1,
      z : this.shape[2], //|| 1,
      count : countDimensions(shape)
    }

    console.log(this.shape)

    this.renderer = new MemoryRenderer(this);
  }

  get dim() { return this.dim_ }

  get id() { return `v-${this.dim_.count}-${this.name}-${this.dim.x}-${this.dim.y}-${this.dim.x}`}

  get name() { return this.name_ }
  
  set name(name) { this.name = name }
  
  get shape() { return this.shape_ }

  set shape(shape) {
    if ( !validShape(shape) )
      throw new InternalError("Invalid shape @ (set) Memory.dim: '" + shape + "'")
    this.dim_.x = shape[0]
    this.dim_.y = shape[1]
    this.dim_.z = shape[2]
    this.dim_.count = countDimensions(shape)
  }

  
  isScalar() { return this.dim_.x === 1 && this.dim_.y === 1 && this.dim_.z === 1; }


  render(container=null) {

    // let li = d3.create('li')
    //   .attr('class', 'cuda-vector')
    //   .attr('id', this.id)
    
    // d3.select(container).node().append(li.node())

    // this.renderer.render(`#${this.id}`)
    this.renderer.render('#heatmap-example')
  }

  // render2() {
  //   var margin = {top:40, right:50, bottom:70, left:50};
  //   var w = 
  // }
}

module.exports = {
  Memory
}