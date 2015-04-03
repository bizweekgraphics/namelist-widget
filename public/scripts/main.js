var config = {
  "key": "Name",
  "scales": {
    "Name": function() { return "#ffffff"; },
    "Age": d3.scale.linear().domain([0,100]).range(["#ffffff", "#ff00ff"]).clamp(true),
    "State": d3.scale.ordinal().range(["#2800D7", "#FA1E64", "#FF6564", "#5C42AB", "#00B9E7", "#00DC3C", "#FB8E1E"])
  }
}

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
        nameListInner.style("background", function(dd) { return config.scales[d] ? config.scales[d](dd[d]) : "#ffffff"; });
      })
      .on("click", function(d) {
        nameList.sort(function(a, b) {
          return a[d] < b[d] ? -1 : a[d] > b[d] ? 1 : a[d] >= b[d] ? (a["Name"] < b["Name"] ? -1 : a["Name"] > b["Name"] ? 1 : 0) : NaN;
        });
      });

})
