var config = {
  "key": "Name",
  "scales": {
    "Name": function() { return "#ffffff"; },
    "Age": d3.scale.linear().domain([0,100]).range(["#ffffff", "#ff00ff"]).clamp(true),
    "State": d3.scale.ordinal().range(["#2800D7", "#FA1E64", "#FF6564", "#5C42AB", "#00B9E7", "#00DC3C", "#FB8E1E"])
  }
}

// this is currently using an old 2004 USA Today list
// http://usatoday30.usatoday.com/sports/golf/masters/2002-09-27-augusta-list.htm
d3.json('static/names.json', function(error, names) {

  console.log(names);

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

  d3.select("#properties").append("input")
      .attr("placeholder", "Search")
      .style("width", (100/(properties.length+1))+"%")
      .on("keyup", function() {
        var value = this.value.toLowerCase();
        nameList.style("display", "inline-block");
        nameList.filter(function(d) {
          // case-insensitive; searches all `properties` of `names`
          return properties.reduce(function(a,b) { return a && d[b].toLowerCase().indexOf(value) == -1 }, true);
        }).style("display", "none");
      });

  d3.select("#properties").selectAll(".property")
      .data(properties)
      .enter()
      .append("div")
      .classed("property", true)
      .style("width", (100/(properties.length+1))+"%")
      .text(function(d) { return d; })
      .on("click", function(d) {
        nameList.sort(function(a, b) {
          // sort by specified property `d` and then by `config.key`
          return a[d] < b[d] ? -1 : a[d] > b[d] ? 1 : a[d] >= b[d] ? (a[config.key] < b[config.key] ? -1 : a[config.key] > b[config.key] ? 1 : 0) : NaN;
        });
        d3.selectAll('.name p').classed('selected', false);
        d3.selectAll('.name p[data-property="'+d+'"]').classed('selected', true);
        nameListInner.style("background", function(dd) { return config.scales[d] ? config.scales[d](dd[d]) : "#ffffff"; });
      });

})
