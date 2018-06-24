var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("StateData.csv", function(err, StateData) {
  if (err) throw err;

  StateData.forEach(function(data) {
    data.uninsured = +data.uninsured;
    data.ExcellentHealth = +data.ExcellentHealth;
  });

  var xLinearScale = d3.scaleLinear()
    .domain([0, 30])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([0, 30])
    .range([height, 0]);

  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .classed("y-axis", true)
    .attr("transform", `translate(0, ${width})`)
    .call(leftAxis);

 
  var circlesGroup = chartGroup.selectAll("circle")
  .data(StateData)
  .enter()
  .append("circle")  
  .attr("cx", d => xLinearScale(d.uninsured))
  .attr("cy", d => yLinearScale(d.ExcellentHealth))
  .attr("r", "15")
  .attr("fill", "dodgerblue")

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.abbr}<br>% Uninsured: ${d.uninsured}<br>% Excellent Health: ${d.ExcellentHealth}`);
    });

  chartGroup.call(toolTip);

  circlesGroup.on("click", function(data) {
    toolTip.show(data);
  })

  .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Uninsured %");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("Excellent Health %");
});