var GANTT_BAR_HEIGHT=4; 
var color = d3.scaleOrdinal(d3.schemeCategory10);

//Draw the Bar Chart
function barChart(womenOfColorRows) {
  var svgHeight = womenOfColorRows.length * GANTT_BAR_HEIGHT * 1.5;
  //var svgHeight = 500;
  var svgWidth = 800;

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


  //var legendSVG = d3.select('.legend')
    // .attr("width", 900)
    // .attr("height", 150)
    // .style("display", "inline-block")
    // .style("border", '1px solid rgba(0,0,0,0.125)');


  // const ethnicities = womenOfColorRows.map(({ Ethnicity }) => Ethnicity);
  // const foo = ethnicities.reduce((memo, ethnicity) => {
  //   return memo.includes(ethnicity) ? memo : [...memo, ethnicity]
  // }, []);

  //var categories = d3.nest()
  //  .key(function(d) {
  //    return d["Ethnicity"]
   // })  
  //  .entries(womenOfColorRows);

  //var categoryNames = legendSVG.select("#categories").selectAll("text").data(categories);

 // categoryNames.enter().append("text")
  //  .text(function(d) {
  //    return d.key;
 //   })
  //  .attr('y', function(d, i) {
  //    return (i * 20) + 20;
  //  })
  //  .attr('dy', 12)
  //  .attr('x', 120);

//  var swatch = legendSVG.selectAll('rect')
 //   .data(categories);

//  swatch.enter().append("rect")
  //  .attr("height", 12)
  //  .attr("width", 12)
  //  .attr('y', function (d, i) {
  //    return (i * 20) + 20;
  //  })
  //  .attr('x', 100)
  //  .attr("fill", function(d) {
  //    return color(d.key);
  //  });

  womenOfColorRows.forEach(function (row, index) {
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
    row['number'] = index; 
    row['ranges'] = inOfficePeriods;
  });

  womenOfColorRows.forEach(function (row, index){
    if (row.ranges.length > 1){
      var secondRange = row.ranges.pop(); 
      row['range'] = row['ranges'][0];
      var newRow = {}; 
      newRow['Dates of Service'] = row['Dates of Service'];
      newRow['Ethnicity'] = row['Ethnicity'];
      newRow['Name'] = row['Name'];
      newRow['Party'] = row['Party'];
      newRow['State'] = row['State'];
      newRow['Total Years in Office'] = row['Total Years in Office'];
      newRow['number'] = row['number'];
      newRow['range'] = secondRange;
      womenOfColorRows.push(newRow);
    } else{
      row['range'] = row['ranges'][0];
    }
  })
  womenOfColorRows.sort(function(a, b){
    return a.number - b.number;
  })
  
  var svg = d3.selectAll('.bar-chart')
    .attr("width", svgWidth)
    .attr("height", svgHeight + 30)

  var minYear = d3.min(years)

  var maxYear = d3.max(years)
  
  var xScale = d3.scaleLinear()
    .domain([minYear, maxYear])
    .range([0, svgWidth - 15]);


  var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  var bars = svg.selectAll('rect')
    .data(womenOfColorRows);

  bars.enter().append("rect")
    .attr("height", GANTT_BAR_HEIGHT)
    .attr("width", function(d) {
      return xScale(minYear + (d.range[1] - d.range[0]));
    })
    .attr('y', function(d, i) {
      return d.number * GANTT_BAR_HEIGHT * 1.5;
    })
    .attr('x', function(d, i) {
      return xScale(d.range[0])
    })
    .attr("fill", function(d) {
        return color(d["Ethnicity"].trim());
    })
    .on("mousemove", function(d) {    
      var tooltipHtml = "<b>" + d["Name"] + "</b> (" + d["Party"] + ", " + d["State"] + "; " + d["Ethnicity"] + ") " + d["Dates of Service"];

      tooltip.transition()
        .duration(100)
        .style("opacity", 1);

      
      var mouse = d3.mouse(document.body);

      
      tooltip
        .html(tooltipHtml) 
        .style("white-space", "nowrap") 
        .style("left", mouse[0] + "px") 
        .style("top", mouse[1] + "px"); 
    })
    .on("mouseout", function(d) {
     
      tooltip.transition()
        .duration(100)
        .style("opacity", 0);
    });
    

  var xAxis = d3.axisBottom(xScale)
      .tickFormat(d3.format("d"));

  d3.select("#x-axis").call(xAxis)
    .attr("transform", "translate(0," + (svgHeight + 10) + ")");
}

//Load the data
d3.csv("data/women_of_color_congress.csv", function(error, csvData) {
  barChart(csvData);
});