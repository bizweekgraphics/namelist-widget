d3.json('static/names.json', function(error, names) {

  var nameList = d3.select("#names").selectAll(".name")
      .data(names)
    .enter()
      .append("div")
      .classed("name", true)

  var nameListInner = nameList.append("div")
      .classed("name-inner", true);

  var properties = Object.keys(names[0]);

  properties.forEach(function(value, index) {
    nameListInner.append("p")
      .attr("data-property", value)
      .text(function(d) { return d[value]; });
  })

  d3.select("#properties").selectAll(".property")
      .data(properties)
      .enter()
      .append("div")
      .classed("property", true)
      .style("width", (100/properties.length)+"%")
      .text(function(d) { return d; })
      .on("mouseover", function(d) {
        d3.selectAll('.name p').classed('selected', false);
        d3.selectAll('.name p[data-property="'+d+'"]').classed('selected', true);
      })
      .on("click", function(d) {
        nameList.sort(function(a, b) {
          return a[d] < b[d] ? -1 : a[d] > b[d] ? 1 : a[d] >= b[d] ? 0 : NaN;
        });
      });

})
