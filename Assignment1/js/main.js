var width = 1400,
  height = 425,
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
 // console.log(data);

  // data_monthly = [];
  //  for (i = 0; i < data.length; i++){ 

  //  // console.log(data[i].Date);
  //  // console.log(data[i].Date.getMonth()); 	
  //  // console.log( data[i].Date.getYear()); 
  //  // console.log( data[i].Date.getDate());  

  // }


 
  // TODO Update scale domains based on your data variables
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
    .text("Number of Pages")
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
       .attr("d", d3.symbol().size(function(d){return d.Average_Rating * 25}))
       .attr("transform", function(d) {
              return "translate(" + x(d.Date_Read) + "," + y(d.Number_of_Pages) + ")";})
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
	            hoverImage.attr("xlink:href", "pictures/" + imageData[d.Title] + ".jpg" ); 
	            // hoverImage.attr("xlink:href","pictures/Becoming.jpg"); 
	            hoverImage.style("visibility","visible"); });
	            


var longestBookName = d3.max(data, function (d){ return d.Title.length;});


var hoverGroup = gDrawing.append("g").style("visibility","hidden");

        hoverGroup.append("rect")
				  .attr("x",175)
				  .attr("y",0)
				  .attr("width",600)
				  .attr("height",130)
			 	  .attr("fill","powderblue")
			 	  .attr("stroke", "5px");

var hoverText1 = hoverGroup.append("text").attr("x",180).attr("y",20).style("fill", "royalblue").style("font-weight", "bold");
var hoverText2 = hoverGroup.append("text").attr("x",180).attr("y",45).style("fill", "royalblue");
var hoverText3 = hoverGroup.append("text").attr("x",180).attr("y",70).style("fill", "royalblue");
var hoverText4 = hoverGroup.append("text").attr("x",180).attr("y",95).style("fill", "royalblue");
var hoverText5 = hoverGroup.append("text").attr("x",180).attr("y",120).style("fill", "royalblue");


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
}

d3.csv("./data/GoodReads_PreProcessed_Books.csv", update);

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