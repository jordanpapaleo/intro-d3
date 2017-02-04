// SETUP
// ----------------------------
// margin convention
const margin = { top: 10, bottom: 30, left: 35, right: 10 }

// this sets the aspect ratio when using responsivy
const width = 400 - margin.left - margin.right
const height = 600 - margin.top - margin.bottom

const fullWidth = width + margin.left + margin.right
const fullHeight = height + margin.top + margin.bottom

const svg = d3.select('.chart')
  .append('svg')
    .attr('width', fullWidth)
    .attr('height', fullHeight)
    .call(responsivefy)
    .attr('viewBox', `0 0 ${fullWidth} ${fullHeight}`)  // this is the frame in the svg can be viewed.  Tcis can crop and scale up the svg
    // .attr('viewBox', `0 0 ${fullWidth / 2} ${fullHeight / 2}`) zoom in on the chart
    // .attr('viewBox', `0 0 ${fullWidth * 2} ${fullHeight * 2}`) zoom out
  .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
// ----------------------------
// [END] SETUP

d3.json('./stock-data.json', function (err, data) {
  const parseTime = d3.timeParse('%Y/%m/%d') // the format of the data returned

  // Map Dates
  // ----------------------------
  data.forEach(company => {
    company.values.forEach(d => {
      d.date = parseTime(d.date)
      d.close = +d.close // makes sure its a number
    })
  })

  // X SCALE and AXIS
  // ----------------------------
  const xScale = d3.scaleTime()
    .domain([
      d3.min(data, co => d3.min(co.values, d => d.date)),
      d3.max(data, co => d3.max(co.values, d => d.date))
    ])
    .range([0, width])
  const xAxis = d3.axisBottom(xScale).ticks(5)
  svg
    .append('g')
      .attr('transform', `translate(0, ${height})`)
    .call(xAxis)

  // Y SCALE and AXIS
  // ----------------------------
  const yScale = d3.scaleTime()
    .domain([
      d3.min(data, co => d3.min(co.values, d => d.close)),
      d3.max(data, co => d3.max(co.values, d => d.close))
    ])
    .range([height, 0])

  const yAxis = d3.axisLeft(yScale)
  svg
    .append('g')
    .call(yAxis)

  // Area
  // ----------------------------
  var area = d3.area()
    .x(d => xScale(d.date))
    .y0(yScale(yScale.domain()[0])) // bottom of the shape
    .y1(d => yScale(d.close)) // top of the shape
    .curve(d3.curveCatmullRom.alpha(0.5));

  svg
    .selectAll('.area')
    .data(data)
    .enter()
    .append('path')
    .attr('class', 'area')
    .attr('d', d => area(d.values))
    .style('stroke', 'none')
    // .style('stroke', (d, i) => ['#FF9900', '#3369E8'][i])
    .style('stroke-width', 2)
    .style('fill', (d, i) => ['#FF9900', '#3369E8'][i])
    .style('fill-opacity', 0.5)
  // Line
  // ----------------------------
  const line = d3.line()
    .x(d => xScale(d.date))
    .y(d => yScale(d.close))
    .curve(d3.curveCatmullRom.alpha(0.5)) // Applies a curve to the corners

  svg.selectAll('.line')
    .data(data)
    .enter()
    .append('path')
      .attr('class', 'line')
      .attr('d', d => line(d.values))
      .style('stroke', (d, i) => ['#FF9900', '#3369E8'][i])
      .style('stroke-width', 2)
      .style('fill', 'none')
})

/*
DEBUGGING

Inspect the elements
$0.__data__.*
d3.selectAll in th console
*/

/*
ANIMATIONS

d3.select('.some-class')
  .transistion()
  .duration(500)
  .delay(750)
  .ease(d3.easeBounceOut)
  .style('width', 500)
  .style('height', 500)

// Chaining
d3.select('.some-class')
  .transistion()
    .duration(500)
    .delay(750)
    .ease(d3.easeBounceOut)
    .style('width', 500)
  .transistion()
    .duration(500)
    .ease(d3.easeBounceOut)
    .style('height', 500)

const t = d3.transition()
  .delay(1000)
  .duration(1000)

d3.select('.some-class')
  .transistion(t)
  .style('color', 'orange')
d3.select('.some-other-class')
  .transistion(t)
  .style('color', 'blue')
*/


function responsivefy (svg) {
  // by Brendan Sudol http://brendansudol.com/writing/responsive-d3
  // get container + svg aspect ratio
  const container = d3.select(svg.node().parentNode)  // returns the raw dom node's prarent
  const width = parseInt(svg.style('width'))
  const height = parseInt(svg.style('height'))
  const aspect = width / height

  // add viewBox and preserveAspectRatio properties,
  // and call resize so that svg resizes on inital page load
  svg.attr('viewBox', `0 0 ${width} ${height}`)
    .attr('perserveAspectRatio', 'xMinYMid')
    .call(resize)

  // to register multiple listeners for same event type,
  // you need to add namespace, i.e., 'click.foo'
  // necessary if you call invoke this function for multiple svgs
  // api docs: https://github.com/mbostock/d3/wiki/Selections#on
  d3.select(window).on(`resize.${container.attr('id')}`, resize);

  // get width of container and resize svg to fit it
  function resize() {
      const targetWidth = parseInt(container.style('width'));
      svg.attr('width', targetWidth);
      svg.attr('height', Math.round(targetWidth / aspect));
  }
}
