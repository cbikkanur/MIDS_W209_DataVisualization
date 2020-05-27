var width = 1700,
  height = 450,
  svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var margin = { top: 30, right: 30, bottom: 30, left: 40 },
  iwidth = width - margin.left - margin.right - 350,
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
 // console.log(myData);
  var data = [];
  for (i = 0; i < myData.length; i++){  	
  	if (myData[i].Exclusive_Shelf === "read"){  
  	//console.log(i, myData[i].Exclusive_Shelf, myData[i].Date_Read);    
        var temp = {"Date_Read": myData[i].Date_Read,
                    "Title": myData[i].Title,
                    "Author": myData[i].Author,
                    "Average_Rating": myData[i].Average_Rating,
                    "Number_of_Pages": myData[i].Number_of_Pages      
                };				
        data.push(temp)
  	}
  }
  console.log(data);

  // data_monthly = [];
  //  for (i = 0; i < data.length; i++){ 

  //  // console.log(data[i].Date);
  //  // console.log(data[i].Date.getMonth()); 	
  //  // console.log( data[i].Date.getYear()); 
  //  // console.log( data[i].Date.getDate());  

  // }


 
  // TODO Update scale domains based on your data variables
  x.domain(d3.extent(data, function(d) { return d.Date_Read; })); 
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

 // var t = "I am big string 12";
 // console.log(t.length);
 // var marks = gDrawing.selectAll(".mark").data(myData);
  var marks = gDrawing.selectAll("path.pt").data(data);
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
       .attr("stroke", "black")    
       .on("mouseout",function(d, i) {
 					hoverGroup.style("visibility","hidden");
 				    hoverImageBox.style("visibility","hidden");
 				    hoverImage.style("visibility","hidden");})
	   .on("mouseover",function(d, i) {
  				hoverText1.text("Title:  			 " + d.Title );
  				hoverText2.text("Author:             " + d.Author);
  				hoverText3.text("Read Date:          " + d.Date_Read.toLocaleDateString());
  				hoverText4.text("Goodreads' Rating:  " + d.Average_Rating );
  				hoverText5.text("Number of Pages:    " + Math.floor(d.Number_of_Pages ));
  				hoverGroup.style("visibility","visible");
	            hoverImageBox.style("visibility","visible"); 
	            hoverImage.style("visibility","visible"); }) ; 

var longestBookName = d3.max(data, function (d){ return d.Title.length;});


var hoverGroup = gDrawing.append("g").style("visibility","hidden");

        hoverGroup.append("rect")
				  .attr("x",350)
				  .attr("y",0)
				  .attr("width",600)
				  .attr("height",130)
			 	  .attr("fill","lightgrey")
			 	  .attr("stroke", "5px");

var hoverText1 = hoverGroup.append("text").attr("x",360).attr("y",20).style("fill", "red").style("font-weight", "bold");
var hoverText2 = hoverGroup.append("text").attr("x",360).attr("y",45).style("fill", "royalblue");
var hoverText3 = hoverGroup.append("text").attr("x",360).attr("y",70).style("fill", "royalblue");
var hoverText4 = hoverGroup.append("text").attr("x",360).attr("y",95).style("fill", "royalblue");
var hoverText5 = hoverGroup.append("text").attr("x",360).attr("y",120).style("fill", "royalblue");


var hoverImageBox = gDrawing.append("g").style("visibility","hidden");

        hoverImageBox.append("rect")
				  .attr("x",1350)
				  .attr("y",0)
				  .attr("width",300)
				  .attr("height",400)
			 	  .attr("fill","powderblue")
			 	  .attr("stroke", "5px");

var hoverImage = hoverImageBox.append("image")
                              .attr("xlink:href", "https://drive.google.com/open?id=1Uey63XOMQG-wI5Ij87nMCfjQ3m4cvTOO")// "file:///C:/Users/chand/OneDrive/Desktop/W209/MIDS_W209_DataVisualization/Assignment1/js/Becoming.jpg")
                              .attr("x", 1360)
                              .attr("y", 0)
                              .attr("width", 250)
                              .attr("height", 300);


       // TODO change for the mark you want to use e.g. rect, path, etc
  //TODO change the attribs/style of your updating mark

  // Elements to remove
 marks.exit().remove();
}

d3.csv("./data/GoodReads_PreProcessed_Books.csv", update);