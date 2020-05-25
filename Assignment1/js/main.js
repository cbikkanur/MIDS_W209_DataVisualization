var width = 1350,
  height = 450,
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
  const parseDate = d3.timeParse("%Y-%m-%d");
  myData.forEach(function (d) {  	
    d.Date_Read = parseDate(d.Date_Read);     
  });

  var data = [];
  for (i = 0; i < myData.length; i++){  	
  	if (myData[i].Exclusive_Shelf === "read"){  
  	console.log(i, myData[i].Exclusive_Shelf, myData[i].Date_Read);    
        var temp = {"Date": myData[i].Date_Read,
                    "Books": 1};
        data.push(temp)
  	}
  }
  console.log(data);

  data_monthly = [];
   for (i = 0; i < data.length; i++){ 

   console.log(data[i].Date);
   console.log(data[i].Date.getMonth()); 	
   console.log( data[i].Date.getYear()); 
   console.log( data[i].Date.getDate());  

  }


 
  // TODO Update scale domains based on your data variables
  x.domain(d3.extent(myData, function(d) { return d.Date_Read; })); 
  y.domain([0, 3]);

  gDrawing
    .append("g")
    .attr("transform", `translate(0,${iheight})`)
    .call(d3.axisBottom(x))
    .append("text")
    .style("fill", "black")
    .style("font-size", "14pt")
    .text("Time")
    .attr("transform", `translate(${iwidth}, ${-20})`);

  gDrawing
    .append("g")
    .call(d3.axisLeft(y).ticks(3))    
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)   
    .attr("dy", "0.91em")
    .attr("fill", "#000")
    .text("Number of Books")
    .style("font-size", "12pt");


 // var marks = gDrawing.selectAll(".mark").data(myData);
  var marks = gDrawing.selectAll("path.pt").data(myData);
  // Update
 marks;
  //TODO change the attribs/style of your updating mark

  // Newly created elements 
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
 marks.exit().remove();
}

d3.csv("./data/GoodReads_PreProcessed_Books.csv", update);