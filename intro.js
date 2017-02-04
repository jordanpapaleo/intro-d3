var scores = [
  { name: 'Alice', score: 96 },
  { name: 'Billy', score: 83 },
  { name: 'Cindy', score: 91 },
  { name: 'David', score: 79 },
  { name: 'Emily', score: 72 }
]

// Data Joins: Selection types
// only data = enterSelection
// data and elements = updateSelection
// only elements = exitSelection

// items that have data and dom
/*const update = d3.select('.chart')
  .selectAll('div')
  .data(scores, function (d) {
    return d ? d.name : this.innerText
  })
  .style('color', 'blue')

// Items that have data but do not have a dom el
const enter = update.enter()
  .append('div') // create and append a div for everythiuny in our data without a dom EL
  .text(d => d.name) // populates the div with a name
  .style('color', 'green')

// items on the dom that do not have data
update.exit().remove()

update.merge(enter)
  .classed('some-class', false) // bool: present of class
  .style('background-color', 'lightgreen')
  .style('border', '1px solid black')
  .style('height', '50px')
  .style('text-transform', 'uppercase')
  .style('width', d => `${d.score}px`)*/

// returns selection by default
function scaleBar (selection, scale) {
  return selection.style('transform', `scaleX(${scale})`)
}

function fade (selection, opacity) {
  return selection.style('fill-opacity', opacity)
}

function setFill (selection, color) {
  return selection.style('fill', color)
}

var svg = d3.select('.chart')
  .append('svg')
    .attr('width', 425)
    .attr('height', 625)

// margin convention
svg.append('rect')
  .attr('width', 425)
  .attr('height', 625)
  .call(setFill, 'lightblue')

// SVG Example
var bar = d3.select('.chart')
  .append('svg')
  .selectAll('g')
  .data(scores)
  .enter()
    .append('g')
    .attr('transform', (d, i) => `translate(0, ${i * 33})`)

bar
  .append('rect')
  .style('width', d => d.score)
  .style('fill', 'lightgreen')
  .style('stroke', 'green')
  .style('stroke-width', '1')
  .style('height', '33px')
  .style('text-transform', 'uppercase')
  .on('mouseover', function (d, i, elements) {
    // this is the dom element, if you used an arrow function your scope would not be the el
    // This style stuff in this example could be done with css psuedo classes

    d3.selectAll(elements)
      .filter(':not(:hover)')
      .call(fade, .3)

    d3.select(this)
      .call(scaleBar, 2)
      .call(setFill, 'lightblue')
      .classed('bar-hover', true)
  })
  .on('mouseout', function (d, i, elements) {
    d3.selectAll(elements)
      .call(fade, 1)

    d3.select(this)
      .call(scaleBar, 1)
      .call(setFill, 'lightgreen')
      .classed('bar-hover', false)
  })

bar
  .append('text')
  .attr('y', 20)
  .text(d => d.name)
