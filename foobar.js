function initBarChart(dataArray) {
   console.log(dataArray) 
  // var bum; 
  // bum = 3; 
  // console.log(bum);

  // bum = 5;
  // console.log(bum);
  // if (bum === 3) {
  //   bum = 9;
  // }

  // console.log(bum);


  // const tea = {
  //   oolong: 'good', 
  //   herbal: 'so-so', 
  //   black: 'only with cream'
  // };

  // console.log(tea.oolong)

  // tea.oolong = 'great';
  // console.log(tea.oolong) 
}

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
  
  
  document.getElementById('data-1').addEventListener('click', function() {
    initBarChart([10, 25, 40, 100]);
  });
  
  document.getElementById('data-2').addEventListener('click', function() {
    initBarChart([15, 40, 30, 10, 50]);
  });