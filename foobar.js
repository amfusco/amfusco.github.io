function initBarChart(dataArray) {
    const chart = d3.select('svg.some-chart');
  
    const rects = chart
      .selectAll('rect')
      .data(dataArray)
      .attr('x', function(data, index) { return (index * 50) + 'px'; })
      .style('width', function(cost) { return cost + 'px'; })
      .style('height', function(cost) { return cost + 'px'; });
  
    rects
      .enter()
      .append('rect')
      .attr('x', function(data, index) { return (index * 50) + 'px'; })
      .style('width', function(cost) { return cost + 'px'; })
      .style('height', function(cost) { return cost + 'px'; });
  
    rects
      .exit()
      .remove()
  }
  
  document.getElementById('data-1').addEventListener('click', function() {
    initBarChart([10, 25, 40, 100]);
  });
  
  document.getElementById('data-2').addEventListener('click', function() {
    initBarChart([15, 40, 30, 10, 50]);
  });