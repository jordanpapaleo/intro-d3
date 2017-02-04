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

d3.json('./health-data.json', function (err, data) {
  // Y SCALE and AXIS
  // ----------------------------
  const yScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.expectancy))
    .range([height, 0])
    .nice() // makes the axis end on amore round of a number
  const yAxis = d3.axisLeft(yScale)
  svg.call(yAxis)

  // X SCALE and AXIS
  // ----------------------------
  const xScale = d3.scaleLinear ()
    .domain(d3.extent(data, d => d.cost))
    .range([0, width])
    .nice()
  const xAxis = d3.axisBottom(xScale)
  svg
    .append('g')
      .attr('transform', `translate(0, ${height})`)
    .call(xAxis)

  // Circle
  // ----------------------------
  const rScale = d3.scaleSqrt()
    .domain([0, d3.max(data, d => d.population)])
    .range([0, 40])

  // Scatterplot
  // ----------------------------
  var circles = svg
    .selectAll('.ball')
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'ball')
    .attr('transform', d => {
      return `translate(${xScale(d.cost)}, ${yScale(d.expectancy)})`
    })

  circles
    .append('circle')
    .attr('cx', 0) // circle center x
    .attr('cy', 0) // circle center y
    .attr('r', d => rScale(d.population)) // radius
    .style('fill', 'steelblue')
    .style('fill-opacity', 0.5)

  circles
    .append('text')
    .style('text-anchor', 'middle')
    .style('fill', 'black')
    .attr('y', 4)
    .text(d => d.code)
})



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
