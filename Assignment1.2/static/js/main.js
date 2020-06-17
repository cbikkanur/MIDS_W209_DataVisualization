var width = 1400,
  height = 425,
  svg = d3
    .select("#chart1")
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


/////////////////////////////// Bar Chart ///////////////////////////////////


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

  
  ////////////////////////////////////// Viz1: Interactive Chart //////////////////////////////////
  x.domain(d3.extent(data, function(d) { return d.Date_Read; })); 
  y.domain([0, d3.max(data, function(d) { return parseInt(d.Number_of_Pages); })]);

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
    .call(d3.axisLeft(y))//.ticks(5))    
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)   
    .attr("dy", "0.91em")
    .attr("fill", "#000")
    .text("# of Pages")
    .style("font-size", "12pt");

  var marks = gDrawing.selectAll("path.pt").data(data);
  // Update
 marks;
  //TODO change the attribs/style of your updating mark

  // Newly created elements 
    marks.enter()
       .append("path") 
       .attr("class", "pt")
       .attr("d",  d3.symbol().type(d3.symbolCircle))
       .attr("d", d3.symbol().size(100))// function(d){return d.Average_Rating * 25}))
       .attr("transform", function(d) {
              return "translate(" + x(d.Date_Read) + "," + y(d.Number_of_Pages) + ")";})
       .attr("fill", "steelblue")
       .attr("stroke", "black")    
       .on("mouseout",function(d, i) { 
                    d3.select(this).transition()
                                   .duration(500)
                                   .attr("fill", "steelblue")
	                               .attr("d", d3.symbol().size(100));      	            
 					hoverGroup.style("visibility","hidden");
 				    hoverImageBox.style("visibility","hidden");
 				    hoverImage.style("visibility","hidden");})
	   .on("mouseover",function(d, i) {	 
	            d3.select(this).attr("fill", "red")
	                           .attr("d", d3.symbol().size(300));

  				hoverText1.text("Title:  			 " + d.Title );
  				hoverText2.text("Author:             " + d.Author);
  				hoverText3.text("Read Date:          " + d.Date_Read.toLocaleDateString());
  				hoverText4.text("Goodreads' Rating:  " + d.Average_Rating );
  				hoverText5.text("Number of Pages:    " + Math.floor(d.Number_of_Pages ));
  				hoverGroup.style("visibility","visible");
	            hoverImageBox.style("visibility","visible"); 
	            hoverImage.attr("xlink:href", "../../static/pictures/" + imageData[d.Title] + ".jpg" ); 
	            // hoverImage.attr("xlink:href","pictures/Becoming.jpg"); 
	            hoverImage.style("visibility","visible"); });
	            


var longestBookName = d3.max(data, function (d){ return d.Title.length;});


var hoverGroup = gDrawing.append("g").style("visibility","hidden");

        hoverGroup.append("rect")
				  .attr("x",175)
				  .attr("y",0)
				  .attr("width",600)
				  .attr("height",130)
			 	  .attr("fill","teal")
			 	  .attr("stroke", "5px");

var hoverText1 = hoverGroup.append("text").attr("x",180).attr("y",20).style("fill", "white").style("font-weight", "bold");
var hoverText2 = hoverGroup.append("text").attr("x",180).attr("y",45).style("fill", "white");
var hoverText3 = hoverGroup.append("text").attr("x",180).attr("y",70).style("fill", "white");
var hoverText4 = hoverGroup.append("text").attr("x",180).attr("y",95).style("fill", "white");
var hoverText5 = hoverGroup.append("text").attr("x",180).attr("y",120).style("fill", "white");


var hoverImageBox = gDrawing.append("g").style("visibility","hidden");

        hoverImageBox.append("rect")
				  .attr("x",1350)
				  .attr("y",0)
				  .attr("width",280)
				  .attr("height",410)
			 	  .attr("fill","white")
			 	  .attr("stroke", "5px");

var hoverImage =  hoverImageBox.append("image")                               
                              .attr("x", 950)
                              .attr("y", 12)
                              .attr("width", 400)
                              .attr("height", 350);


       // TODO change for the mark you want to use e.g. rect, path, etc
  //TODO change the attribs/style of your updating mark

  // Elements to remove
 marks.exit().remove();
//////////////////////////////////////// Viz2: Monthly Chart ///////////////////////////////////////

  svg3 = d3.select("#chart2")
           .append("svg")
           .attr("width", width)
           .attr("height", height);

var gDrawing2 = svg3.append("g")
                    .attr("transform", `translate(${margin.left}, ${margin.top})`);

data_monthly = [];
var temp_year = data[0].Date_Read.getYear();
var temp_month = data[0].Date_Read.getMonth();
var temp_count = 0;

for (i = 0; i < data.length; i++) { 
    //console.log("iteration: " , i, data[i].Date_Read.getMonth() ,  data[i].Date_Read.getYear()) ;  
	if (temp_year === data[i].Date_Read.getYear() && temp_month === data[i].Date_Read.getMonth()){
		temp_count += 1;
		temp_month = data[i].Date_Read.getMonth();
		temp_year = data[i].Date_Read.getYear();		
	}else {
		data_monthly.push({"date": new Date(temp_year + 1900, temp_month, 1), "count": temp_count});				
		temp_month = data[i].Date_Read.getMonth();
		temp_year = data[i].Date_Read.getYear();
		var temp_count = 1;
	}

}
data_monthly.push({"date": new Date(temp_year + 1900, temp_month, 1), "count": temp_count});
// console.log(data_monthly);


var x3 = d3.scaleTime().range([0, iwidth]);
var y3 = d3.scaleLinear().range([iheight, 0]);

x3.domain(d3.extent(data_monthly, function(d) { return d.date; })); 
y3.domain([0, d3.max(data_monthly, function(d) { return parseInt(d.count); })]);
// console.log(y3(0), y3(1), y3(2), y3(3), iheight);

gDrawing2
    .append("g")
    .attr("transform", `translate(0,${iheight})`)
    .call(d3.axisBottom(x3))
    .append("text")
    .style("fill", "black")
    .style("font-size", "14pt")
    .text("Time")
    .attr("transform", `translate(${iwidth + 40}, ${-20})`);

  gDrawing2
    .append("g")    
    .call(d3.axisLeft(y3).ticks(3))    
    .append("text")
    .attr("transform", "rotate(-90)")     
    .attr("dy", "0.91em")
    .attr("fill", "#000")
    .text("# Books/Month")
    .style("font-size", "12pt");
    //.attr("transform", `translate(${0}, ${-20})`);

gDrawing2.selectAll("rect")
    .data(data_monthly)
    .enter()
    .append("rect")
    .attr("x", function (d, i){ return x3(d.date) ; } )
    .attr("y", function (d) { return y3(d.count); } )
    .attr("height", function (d) { return iheight - y3(d.count); } )
    .attr("width", 15 )
    .style("fill", "forestgreen") //.style("fill", "teal") //#69b3a2
    .style("opacity", 0.75)   
    .on("mouseover", function() {    	   
			d3.select(this)
			  .style("fill", "red");
			   })
     .on("mouseout", function() {
				   d3.select(this)
				   		.transition()
				   		.duration(200)
						.style("fill", "forestgreen");
			   })
      .append("title")
      .text(function(d) { 
          return d.date.toLocaleString('default', { month: 'long' })//getMonth();   
      }); 
   
//////////////////////////////////////// Viz3: Sort Chart ///////////////////////////////////////////


var width4 = 1400,
    height4 = 500,
    svg4 = d3.select("#chart3")
           .append("svg")
           .attr("width", width4)
           .attr("height", height4);

var margin4 = { top: 30, right: 30, bottom: 30, left: 40 },
    iwidth4 = width4 - margin4.left - margin4.right,
    iheight4 = height4 - margin4.top - margin4.bottom;

var bars4 = svg4.append("g")
               .attr("transform", `translate(${margin4.left}, ${margin4.top})`);


var books_data = [];
  for (i = 0; i < data.length; i++) { 
            books_data.push(data[i].Title) ;
            }

  console.log(books_data)                      

  var x4 = d3.scaleBand() // from https://www.d3-graph-gallery.com/graph/custom_axis.html
             .domain(books_data)       
             .range([0, 1300])                       
             .padding([0.8]);

  var y4_num_pages = d3.scaleLinear()
                       .range([iheight4, 0])
                       .domain([0, d3.max(data, function(d) { return parseInt(d.Number_of_Pages); })]);


bars4.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function (d, i){ console.log(i);
    	                        console.log(x4(data[i].Title));
    	                        return x4(data[i].Title) - 10 ; } )
    .attr("y", function (d) { return  y4_num_pages(d.Number_of_Pages); } )
    .attr("height", function (d) { return y4_num_pages(0) - y4_num_pages(d.Number_of_Pages); } )
    .attr("width",  4 * x4.bandwidth() )
    .style("fill", "darkgreen") //.style("fill", "teal") //#69b3a2
    .style("opacity", 0.65)
    .on("mouseover", function() {    	   
			d3.select(this)
			  .style("fill", "red");
			   })
    .on("mouseout", function() {
				   d3.select(this)
				   		.transition()
				   		.duration(450)
						.style("fill", "darkgreen");
			   })
     .append("title")
     .text(function(d) { 
          return d.Title;   
      });


bars4.append("g")    
    .call(d3.axisLeft(y4_num_pages).ticks(4))    
    .append("text")
    .attr("transform", "rotate(-90)")     
    .attr("dy", "0.91em")
    .attr("fill", "#000")
    .text("# of Pages")
    .style("font-size", "12pt");

bars4.append("g")
    .attr("transform", `translate(0,${iheight4})`)
    .call(d3.axisBottom(x4).tickFormat(""))
    .append("text")
    .style("fill", "black")
    .style("font-size", "12pt")
    .text("Books")
    .attr("transform", `translate(${iwidth4 - 10}, ${-20})`);



//////////////////////////////////////// Viz4: Category Chart ///////////////////////////////////////

var width2 = 850,
  height2 = 500,
  barWidth = 100,
  svg2 = d3
    .select("#chart4")
    .append("svg")
    .attr("width", width2)
    .attr("height", height2);

var margin2 = { top: 30, right: 30, bottom: 30, left: 40 },
  iwidth2 = width2 - margin2.left - margin2.right,
  iheight2 = height2 - margin2.top - margin2.bottom;

var bars = svg2
  .append("g")
  .attr("transform", `translate(${margin2.left}, ${margin2.top})`);


 data_read_cat_list = [  {"category": "Read", "number": 0},  {"category": "Reading", "number": 0},  {"category": "To_Read", "number": 0} ];

    for (i = 0; i < myData.length; i++){  	
  	 if (myData[i].Exclusive_Shelf === "read"){  
  	    data_read_cat_list[0].number += 1;
  	 }else if (myData[i].Exclusive_Shelf === "currently-reading"){  
  	      data_read_cat_list[1].number += 1;
  	 }else if (myData[i].Exclusive_Shelf === "to-read"){  
  	      data_read_cat_list[2].number += 1;
  	}

  }
 
  var x2 = d3.scaleBand() // from https://www.d3-graph-gallery.com/graph/custom_axis.html
    .domain(["Read", "Currently Reading", "To Read"])       
    .range([0, 780])                       
    .padding([0.8]);

  var y2 = d3.scaleLinear()
             .range([0, iheight2])
             .domain([0, d3.max(data_read_cat_list, function(d) { return parseInt(d.number); })]);



cat = ["Read", "Currently Reading", "To Read"];

bars.selectAll("rect")
    .data(data_read_cat_list)
    .enter()
    .append("rect")
    .attr("x", function (d, i){ return x2(cat[i]) - 20; } )
    .attr("y", function (d) { return iheight2 -  y2(d.number); } )
    .attr("height", function (d) { return y2(d.number); } )
    .attr("width", 2 * x2.bandwidth() )
    .style("fill", "lightseagreen") //.style("fill", "teal") //#69b3a2
    .style("opacity", 0.95)
    .on("mouseover", function() {    	   
			d3.select(this)
			  .style("fill", "red");
			   })
    .on("mouseout", function() {
				   d3.select(this)
				   		.transition()
				   		.duration(450)
						.style("fill", "lightseagreen");
			   })
     .append("title")
     .text(function(d) { 
          return d.number;   
      });

bars.selectAll("g")
    .data(data_read_cat_list)
    .enter()
    .append("g")  
    .attr("transform", `translate(0,0)`)
    .append("text")
    .text(function (d) { return d.number; } )
    .attr("x", function (d, i){ return x2(cat[i]) + 12 ; } )
    .attr("y", function (d) { return iheight2 -  y2(d.number) + 25; } )
    .style("fill", "black")
    .style("font-weight", "bold")
    .style("font-size", "16px");


 bars
    .append("g")
    .attr("transform", `translate(0,${iheight2})`)
    .call(d3.axisBottom(x2))
    .append("text")
    .style("fill", "black")
    .style("font-size", "12pt")
    .text("Category")
    .attr("transform", `translate(${iwidth2 - 10}, ${-20})`);

 // bars
 //    .append("g")
 //    .call(d3.axisLeft(y2))//.ticks(5))    
 //    .append("text")
 //    .attr("transform", "rotate(-90)")
 //    .attr("y", 6)   
 //    .attr("dy", "0.91em")
 //    .attr("fill", "#000")
 //    .text("# of Books")
 //    .style("font-size", "12pt");


}







d3.csv("../../static/data/GoodReads_PreProcessed_Books.csv", update);

var imageData = {
"Rich Dad, Poor Dad" : "RichDadPoorDad",
"I Will Teach You to Be Rich": "IWillTeachYouToBeRich",
"How to Win Friends and Influence People": "HowToWinFriendsAndInfluencePeople",
"Think and Grow Rich": "ThinkAndGrowRich",
"The 7 Habits of Highly Effective People": "The7HabitsOfHighlyEffectivePeople",
"The Richest Man in Babylon": "TheRichestManInBabylon",
"How to Stop Worrying and Start Living": "HowToStopWorryingAndStartLiving",
"The Intelligent Investor": "TheIntelligentInvestor",
"The Alchemist": "TheAlchemist",
"The Millionaire Next Door": "TheMillionaireNextDoor",
"The Millionaire Mind": "TheMillionaireMind",
"Men Are from Mars, Women Are from Venus": "MenAreFromMarsWomenAreFromVenus",
"Elon Musk: Tesla, SpaceX, and the Quest for a Fantastic Future": "ElonMusk",
"The Power of Now: A Guide to Spiritual Enlightenment": "ThePowerOfNow",
"Extreme Ownership: How U.S. Navy SEALs Lead and Win": "ExtremeOwnership",
"The 4-Hour Workweek": "The4HourWorkWeek",
"Discipline Equals Freedom: Field Manual": "DisciplineEqualsfreedom",
"The Quick and Easy Way to effective speaking": "TheQuickAndEasyWayToEffectiveSpeaking",
"Can't Hurt Me: Master Your Mind and Defy the Odds": "CantHurtMe",
"Man's Search for Meaning": "MansSearchForMeaning",
"Educated": "Educated",
"Becoming": "Becoming",
"Astrophysics for People in a Hurry": "AstroPhysicsForPeopleInAHurry",
"The Compound Effect": "TheCompoundEffect",
"The Magic of Thinking Big": "TheMagicOfThinkingBig",
"Zero to One: Notes on Startups, or How to Build the Future": "ZeroToOne",
"The Art of War": "TheArtOfWar",
"Directional Thinking: 10 Steps to Positive Thinking": "DirectionalThinking",
"Living with a SEAL: 31 Days Training with the Toughest Man on the Planet": "LivingWithASeal",
"The Power of Habit: Why We Do What We Do in Life and Business": "ThePowerOfHabit",
"Never Split the Difference": "NeverSplitTheDifference",
"The Total Money Makeover: A Proven Plan for Financial Fitness": "TotalMoneyMakeover",
"The Willpower Instinct: How Self-Control Works, Why It Matters": "TheWillPowerInstinct",
"The Power of a Praying Husband": "ThePowerOfAPrayingHusband",
"The Little Prince": "TheLittlePrince",
"The Republic": "TheRepublic",
"How to Lie with Statistics": "HowToLieWithStatistics",
"A New Earth: Awakening to Your Life's Purpose": "ANewEarth",
"Outliers: The Story of Success": "Outliers",
"Bhagavad-Gita As It Is": "Bhagavad_gita",
"Autobiography of a Yogi": "Autobiography_of_a_yogi"
};