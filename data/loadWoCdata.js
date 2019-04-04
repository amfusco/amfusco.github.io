var svgWidth = 800;
var svgHeight = 500;
var color = d3.scaleOrdinal(d3.schemeCategory10);

//Draw the Bar Chart
function barChart(womenOfColorRows) {
 
  var years = womenOfColorRows.flatMap(function (row) {
    var ranges = row['Dates of Service'].split(';'); 

    return ranges.flatMap(function(range) { 
      var rangeAsArray = range.trim().split('-');      
      return rangeAsArray.map(function(year) {         
        if (year.trim().toLowerCase() === 'present') {
          return 2019;
        } else {
          return parseInt(year); 
        }
      });
    });

  });
  womenOfColorRows.forEach(function (row) {
    var ranges = row['Dates of Service'].split(';'); 

    var inOfficePeriods = ranges.map(function(range) { 
      var rangeAsArray = range.trim().split('-');      
      return rangeAsArray.map(function(year) {         
        if (year.trim().toLowerCase() === 'present') {
          return 2019;
        } else {
          return parseInt(year); 
        }
      });
    });

    var totalYearsInOffice = 0; 
    inOfficePeriods.forEach(function(period) {   
      var lengthOfPeriod = period[1] - period[0]; 
      totalYearsInOffice = totalYearsInOffice + lengthOfPeriod; 
    });

    // if (row["Name"] === "Ayanna Pressley") debugger;

    row['Total Years in Office'] = totalYearsInOffice; 
  });
  var svg = d3.selectAll('.bar-chart')
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  var minYear = d3.min(years)

  var maxYear = d3.max(years)
  
  var xScale = d3.scaleLinear()
    .domain([minYear, maxYear])
    .range([0, svgWidth - 15]);

  var bars = svg.selectAll('rect')
    .data(womenOfColorRows);

  bars.enter().append("rect")
    .attr("height", 5)
    .attr("width", function(d) {
      
      return xScale(minYear + (d["Total Years in Office"]));
    })
    .attr('y', function(d, i) {
      return i * 10;
    })
    .attr('x', function(d, i) {
      return xScale(parseInt(d["Dates of Service"]))
    })
    .attr("fill", function(d) {
        return color(d["Ethnicity"]);
    })
    
    .on("mousemove", function(d) {
      var mouse = d3.mouse(document.body);
      d3.select("#tooltip")
          .style("display", "inline-block")
          .style("postion", "relative")
          .html("<div class='tooltip-title'>" + d["ASSOCIATION"] + "<br>" + " Association Type:  " + d["ASSOCIATION TYPE"] + "<br>" + " Founding Year:  " + d["FOUNDING YEAR"] + "<br>" + " Ending Year:  " + d["ENDING YEAR"] + "</br>" + "</div>")
          .style("left", mouse[0] + 20 + "px")
          .style("top", mouse[1] - 50 + "px");
    })
    .on("mouseout", function(d) {
      d3.select("#tooltip")
          .style("display", "none")
    })
    


  var xAxis = d3.axisBottom(xScale)
      .tickFormat(d3.format("d"));
      d3.select("#xAxis").call(xAxis);
}

//Load the data
d3.csv("data/women_of_color_congress.csv", function(error, csvData) {
  barChart(csvData);
});