var GANTT_BAR_HEIGHT=5; 
var color = d3.scaleOrdinal(d3.schemeCategory10);

//Draw the Bar Chart
function barChart(womenOfColorRows) {
  var svgHeight = womenOfColorRows.length * GANTT_BAR_HEIGHT;
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
    .attr("height", svgHeight + 30);

  var minYear = d3.min(years)

  var maxYear = d3.max(years)
  
  var xScale = d3.scaleLinear()
    .domain([minYear, maxYear])
    .range([0, svgWidth - 15]);

  // Adding a tooltip `<div>` element the same way we do it in the other script.
  // We're giving it a class of "tooltip" so that the styles we have from the
  // old script (specifically the `.tooltip {...` stuff) apply to this one, too,
  // since they worked well enough last time. It also allows us to have some
  // style consistency across the page. You don't want anything and everything
  // to look different; it's nice to have a "style guide" so it's not so gaudy.
  // We're also setting the `opacity` to 0 (fully transparent) so that it
  // doesn't show up off the bat. We only want it to show up when the user
  // hovers over a `<rect>` element.
  var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  var bars = svg.selectAll('rect')
    .data(womenOfColorRows);

  bars.enter().append("rect")
    .attr("height", GANTT_BAR_HEIGHT)
    .attr("width", function(d) {
      
      return xScale(minYear + (d["Total Years in Office"]));
    })
    .attr('y', function(d, i) {
      return i * GANTT_BAR_HEIGHT;
    })
    .attr('x', function(d, i) {
      return xScale(parseInt(d["Dates of Service"]))
    })
    .attr("fill", function(d) {
        return color(d["Ethnicity"]);
    })
    
    // Remember that this `.on('mousemove', function(d) {...` is going to fire
    // any time you move your mouse over each `<rect>` element that we're
    // chaining these methods on.
    // `d` is gonna be each row of women_of_color_congress.csv (you could just
    // as easily replace all occurrences of `d` with `row` or `congressWoman` or
    // some better variable name, but I'm going to leave it this way for
    // consistency with the rest of this chain of functions)
    .on("mousemove", function(d) {
      // This will output the html for showing the name (in bold), then the info
      // for that congresswoman; e.g.,
      //
      //   Foo McGoo: (Democrat, HI) 1991-present
      //
      // ...so we'll use this for our tooltip. If you want to modify the tooltip
      // to contain other info, do so here.
      var tooltipHtml = "<b>" + d["Name"] + "</b>: (" + d["Party"] + ", " + d["State"] + ") " + d["Dates of Service"];

      // This tells the tooltip to become 90% opaque over the course of 100
      // milliseconds. Remember that the `.on('mouseout', ...` listener below
      // all of this stuff tells it to become 0% opaque (a.k.a. completely
      // transparent) whenever you move your mouse off of the `<rect>`, so
      // we're making it "appear".
      tooltip.transition()
        .duration(100)
        .style("opacity", 0.9);

      // Here we're grabbing a reference to the mouse/cursor so that we can
      // determine where exactly you're hovering at any given moment. That way
      // we can make the tooltip "follow" your mouse as it moves over a single
      // rectangle, rather than making the tooltip pop up in the same spot and
      // stay put.
      var mouse = d3.mouse(document.body);

      // Now we're feeding the tooltip element the HTML text we defined earlier
      // in the variable `tooltipHtml`, which will be different for every row
      // this function is called with (the `d` variable), such that every time
      // that variable is set, it's set with a new person's information. So,
      // that becomes the interior HTML content of our tooltip element, and it
      // displays in the newly-appeared tooltip next to our mouse. It's next to
      // our mouse because on the following lines we set it to the current
      // coordinates of the mouse. For example, if the cursor is at (156, 34) we
      // set the tooltip's distance from the `left` side to be "156px", and the
      // distance from the `right` side to be "34px". We also set the element
      // to not wrap the lines if the lines get too long... that way all the
      // info appears in one line, unbroken. All of these steps could be in a
      // different order, just so you know. Doesn't have to occur in this order.
      tooltip
        .html(tooltipHtml) // Step 1: Set the HTML on the inside of the tooltip to the HTML we defined earlier in `tooltipHtml`
        .style("white-space", "nowrap") // Step 2: Make sure the text doesn't wrap, because that's ugly
        .style("left", mouse[0] + "px") // Step 3: Set the tooltip's distance from the left side to be the same as your cursor's distance from the left side
        .style("top", mouse[1] + "px"); // Step 4: Set the tooltip's distance from the right side to be the same as your cursor's distance from the right side
    })
    .on("mouseout", function(d) {
      // Here we tell the tooltip to become completely transparent over the
      // course of 100 milliseconds after your mouse leaves the `<rect>` element
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