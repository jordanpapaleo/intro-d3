const data = [
  { score: 63, subject: 'Math' },
  { score: 82, subject: 'Geography' },
  { score: 74, subject: 'Spelling' },
  { score: 97, subject: 'Reading' },
  { score: 52, subject: 'Science' },
  { score: 52, subject: 'Chemistry' },
  { score: 52, subject: 'Phisycs' },
]

// SETUP
// ----------------------------
// margin convention
const margin = { top: 10, bottom: 50, left: 35, right: 0 }

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


// Y SCALE and AXIS
// ----------------------------
const yScale = d3.scaleLinear()
  .domain([0, 100])
  .range([height, 0])
const yAxis = d3.axisLeft(yScale)
  // .ticks(5, '%') // a suggestion on how many ticks
  // .ticks(5, '.1s') // decimal places
  // .tickValues([8, 19, 43, 77]) // provides exact values for a scale
svg.call(yAxis)
// ----------------------------
// [END] Y SCALE and AXIS


// X SCALE and AXIS
// ----------------------------
// Time
// const xScale = d3.scaleTime()
//   .domain([new Date(2017, 0, 1), new Date()])
//   .range([0, width])
const xScale = d3.scaleBand()
  // .align(0)
  .padding(0.2) // scaleBand specific  0 - 1
  // .paddingInner()
  // .paddingOuter()
  .domain(data.map(d => d.subject))
  .range([0, width])
const xAxis = d3.axisBottom(xScale)
  .ticks(5)
  // .ticks(d3.timeDay.every(7))
  // .ticks(d3.timeHour.every(7))
  // .ticks(d3.timeMinute.every(7))
  .tickSize(10)
  // .tickSizeInner(10)
  // .tickSizeOuter(20)
  .tickPadding(5)
svg
  .append('g')
    .attr('transform', `translate(0, ${height})`)
  .call(xAxis)
  .selectAll('text')
  .style('text-anchor', 'end')
  .attr('transform', 'rotate(-45)')
  // ----------------------------
  // [END] X SCALE

// BAR CHART
// ----------------------------
svg.selectAll('rect')
  .data(data)
  .enter()
  .append('rect')
  .attr('x', d => xScale(d.subject))
  .attr('y', d => yScale(d.score))
  .attr('width', d => xScale.bandwidth())
  .attr('height', d => height - yScale(d.score))
  .style('fill', 'steelblue')
// ----------------------------
// BAR CHART



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
