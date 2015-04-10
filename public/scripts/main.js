// configure filters (buttons) and display fields (for each name)
// filter key names are used for button labels
// display field key names are used for a data attribute for css
var config = {
  "filters": {
    "All": function(d) { return true; },
    "CEOs": function(d) { return d["Title"].indexOf("CEO") !== -1 },
    "Finance": function(d) { return d["Industry"].indexOf("Financial Services") !== -1 || d["Industry"].indexOf("Private Equity") !== -1 || d["Industry"].indexOf("Money Management") !== -1; },
    "Sports": function(d) { return d["Industry"].indexOf("Golf") !== -1 || d["Industry"].indexOf("Sports") !== -1; },
    "Billionaires": function(d) { return d["Misc"].indexOf("Billionaire") !== -1 },
    "Women": function(d) { return d["Misc"].indexOf("Woman") !== -1 }
  },
  "displayFields": {
    "name": function(d) { return d["First"] + " " + d["Last"] + " " + d["Suffix"]; },
    "topline": function(d) { return d["Industry"]; },
    "company": function(d) { return d["Company"]; },
    "affiliation": function(d) { return [d["Title"], d["Company"]].filter(function(d) { return d.length > 0; }).join(", "); },
    "location": function(d) { return [d["City"], d["State"]].filter(function(d) { return d.length > 0; }).join(", "); }
  }
}

d3.json('static/names.json', function(error, names) {

  var properties = Object.keys(names[0]),
      displayFields = Object.keys(config.displayFields),
      filters = Object.keys(config.filters);

  // add name containers
  var nameList = d3.select("#names").selectAll(".name")
      .data(names)
    .enter()
      .append("div")
      .classed("name", true)
      .style("width", function(d) { return (100/~~(d3.select("#names").node().offsetWidth / 150))+"%"; });

  // an inner div is used for expansion on rollover
  var nameListInner = nameList.append("div")
      .classed("name-inner", true);

  // append configured fields to each name
  var nameListProperties = nameListInner.selectAll("p")
      .data(displayFields)
    .enter()
      .append("p")
      .attr("data-property", function(d) { return d; })
      .html(function(d) { return config.displayFields[d](d3.select(this.parentNode).data()[0]); });

  // add filter buttons
  var filterButtons = d3.select("#filters").selectAll(".filter")
      .data(filters)
    .enter()
      .append("div")
      .classed("filter", true)
      .text(function(d) { return d; })
      .on("click", sortAndFilter);

  // add search box
  var searchField = d3.select("#search").append("input")
      .attr("placeholder", "Search for names, industries, titles, companies, locations...")
      .style("width", "100%")
      .on("keyup", search);

  // on load, initial sort and filter is 'All'
  sortAndFilter.call(filterButtons.filter(function(d) { return d=='All'; }).node(), 'All');

  function sortAndFilter(d) {
    // set data attribute on the whole names container to allow css styling
    d3.select("#names").attr("data-filter", d);
    // fade everything out
    nameList.style("opacity", .3);
    // sort first by filter, and then by name (Last, First)
    nameList.sort(function(a,b) {
      if (config.filters[d](a) == config.filters[d](b)) {
        return a["Last"] < b["Last"] ? -1 : a["Last"] > b["Last"] ? 1 : (a["First"] < b["First"] ? -1 : 1);
      } else {
        return config.filters[d](a) > config.filters[d](b) ? -1 : 1;
      }
    })
    // highlight matching names
    nameList.filter(config.filters[d]).style("opacity", 1);
    // show button selection
    d3.selectAll(".filter.selected").classed("selected", false);
    d3.select(this).classed("selected", true);
  }

  function search() {
    // case-insensitive
    var value = this.value.toLowerCase();
    // class the whole names container to show expanded detail boxes even when not hovering
    d3.select("#names").classed("searching", value.length > 0);
    // hide everything
    nameList.style("display", "none");
    // show everything that matches
    nameList.filter(function(d) {
      // case-insensitive; searches all `properties` of `names`
      return properties.reduce(function(a,b) { return a || d[b].toLowerCase().indexOf(value) !== -1 }, false);
    }).style("display", "inline-block");
  }

})
