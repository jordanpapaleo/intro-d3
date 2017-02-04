// document.body.innerHTML = d3.version
/*
// maps an input to an output value
const linearScale = d3.scaleLinear()
  .domain([0, 100])
  .range([0, 1]) // maps values to the maximum value
  .clamp(true) // clamps the maximum and minimum values
*/
// Proportionaly maps using range
// console.log(linearScale(0)) // 0
// console.log(linearScale(50)) // 0.5
// console.log(linearScale(100)) // 1
//
// console.log(linearScale.invert(300))

// Convert Dates/times to numbers
// TIMESCALE
const timescale = d3.scaleTime()
  .domain([new Date(2017, 0, 1), new Date()])
  .range([0, 100])

// console.log(timescale(new Date()))
// console.log('Middle point', timescale.invert(50)) // will give the exact midpoint for a date domain. 50 is half way from 0 -> 100

// Linear scale / Continuous scale
const quantizeScale = d3.scaleQuantize()
  .domain([0, 100])
  .range(['red', 'orange', 'yellow', 'green'])

// console.log(quantizeScale(22)) // red
// console.log(quantizeScale(49)) // orange
// console.log(quantizeScale(70)) // yellow
// console.log(quantizeScale(99)) // green

/*
- Looks at cardinlaity or number of items in the output range
- breaks the domain into that many uniformed sized pieces
- 0 -> 100 gets broken into 4 pieces
- first quarter maps to red, last quarter maps to green
*/

// console.log(quantizeScale.invertExtent('red')) // Will show the values that the color will map to

// -------------------
// Non numeric value
const ordinalScale = d3.scaleOrdinal()
  .domain(['poor', 'ok', 'better', 'great'])
  .range(['red', 'orange', 'yellow', 'green'])

// console.log(ordinalScale('poor')) // red
// console.log(ordinalScale('ok')) // orange
// console.log(ordinalScale('better')) // yellow
// console.log(ordinalScale('great')) // green
// console.log(ordinalScale.invertinvertExtent('red')) This in an error... no invertExtent on an ordinalScale

// d3.csv('data.csv', (data) => {
//   console.log('CSV', data)
// })

d3.json('data.json', (data) => {
  console.log('JSON', data)

  const min = d3.min(data, d => d.age)
  console.log('min', min)

  const max = d3.max(data, d => d.age)
  console.log('max', max)

  const extent = d3.extent(data, d => d.age)
  console.log('extent', extent)

  const linearScale = d3.scaleLinear()
    .domain(extent)
    .range([0, 600])

    console.log(linearScale(24)) // Maps to a pixel value of 264

  var ages = d3.set(data, d => d.age)
  console.log(ages.values()) // Returns the unique values
})
