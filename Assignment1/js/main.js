var width = 1300,
  height = 500,
  svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var margin = { top: 30, right: 30, bottom: 30, left: 40 },
  iwidth = width - margin.left - margin.right,
  iheight = height - margin.top - margin.bottom;

var gDrawing = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var x = d3.scaleTime().range([0, iwidth]);
var y = d3.scaleLinear().range([iheight, 0]);

function update(myData) {
  // Data parsing, in case you need it
  console.log("I am inside of the function");
  const parseDate = d3.timeParse("%Y-%m-%d");
  myData.forEach(function (d) {
  	// console.log(d.Date_Read);  	
  	// console.log();
    d.Date_Read = parseDate(d.Date_Read);     
  });

  // TODO Update scale domains based on your data variables
  x.domain(d3.extent(myData, function(d) { return d.Date_Read; })); 
  y.domain([0, 3]);

  gDrawing
    .append("g")
    .attr("transform", `translate(0,${iheight})`)
    .call(d3.axisBottom(x))
    .append("text")
    .style("fill", "black")
    .style("font-size", "12pt")
    .text("xAxis")
    .attr("transform", `translate(${iwidth}, ${-20})`);

  gDrawing
    .append("g")
    .call(d3.axisLeft(y).ticks(3))    
    .append("text")
    .style("fill", "black")
    .style("font-size", "12pt")
    .text("yAxis")
    .attr("transform", `translate(${50}, 0)`);

 // var marks = gDrawing.selectAll(".mark").data(myData);
  var marks = gDrawing.selectAll("path.pt").data(myData);
  // Update
 // marks;
  //TODO change the attribs/style of your updating mark

  // Newly created elements
  // marks.enter()
  //      .append("circle") 
  //      .attr("class", "mark")
  //      .attr("cx", x( function (d){ return d.Date_Read; }))
  //      .attr("cy", y( function (d){ return d.Number_of_Pages; }))
  //      .attr("r", 10); 
    marks.enter()
       .append("path") 
       .attr("class", "pt")
       .attr("d",  d3.symbol().type(d3.symbolCircle))
       .attr("transform", function(d) {
    return "translate(" + x(d.Date_Read) + "," + y(1) + ")";})
       .attr("fill", "steelblue")
       .attr("stroke", "black"); 


       // TODO change for the mark you want to use e.g. rect, path, etc
  //TODO change the attribs/style of your updating mark

  // Elements to remove
 // marks.exit().remove();
}

d3.csv("./data/GoodReads_PreProcessed_Books.csv", update);