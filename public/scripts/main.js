var config = {
  "key": "Name",
  "scales": {
    "Name": function() { return "#ffffff"; },
    "Age": d3.scale.linear().domain([0,100]).range(["#ffffff", "#ff00ff"]).clamp(true),
    "State": d3.scale.ordinal().range(["#FA1E64", "#FF6564", "#00B9E7", "#00DC3C", "#FB8E1E"])
  },
  "displayFields": {
    "name": function(d) { return d["First"] + " " + d["Last"] + " " + d["Etc."]; },
    "topline": function(d) { return d["Topline"]; },
    "location": function(d) { return d["City"] + ", " + d["State"]; },
    "affiliation": function(d) { return d["Company"]; }
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
  var displayFields = Object.keys(config.displayFields);

  displayFields.forEach(function(value, index) {
    nameListInner.append("p")
      .attr("data-property", value)
      .html(function(d) { return config.displayFields[value](d); });
  })

  d3.select("#search").append("input")
      .attr("placeholder", "Search for names, titles, companies, locations...")
      .style("width", "100%")
      .on("keyup", function() {
        var value = this.value.toLowerCase();
        d3.select("#names").classed("searching", value.length > 0);
        nameList.style("display", "inline-block");
        nameList.filter(function(d) {
          // case-insensitive; searches all `properties` of `names`
          return properties.reduce(function(a,b) { return a && d[b].toLowerCase().indexOf(value) == -1 }, true);
        }).style("display", "none");
      });

  /*
  nameList.sort(function(a, b) {
    // sort by specified property `d` and then by `config.key`
    return a[d] < b[d] ? -1 : a[d] > b[d] ? 1 : a[d] >= b[d] ? (a[config.key] < b[config.key] ? -1 : a[config.key] > b[config.key] ? 1 : 0) : NaN;
  });
  */

})
