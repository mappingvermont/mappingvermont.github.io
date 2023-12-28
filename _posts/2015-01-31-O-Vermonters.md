---
layout: post
category : general
tags : [D3, Politics]
title: O Vermonters!
description: "Identity and politics in the Green Mountain State"
---
Living in Vermont is kind of a big deal. Of those that make this choice, the vast majority are proud to be here-- proud of the ready access to woods and wilderness, proud of the toughness developed over 6-month-long winters, and proud of the delicious food, beer, and maple syrup that it's tough to find any place else. Not everyone can live in Vermont; it takes a certain kind of person to forgo a high profile career and salary in favor of piecing together seasonal work and a part time job at a non-profit that's an hour away, but people do it. For this committment and sheer stick-to-it-ness, these people are called "Vermonters".\\
\\
I'm as proud of this appellation as anyone, but lately I've been feeling like it's a bit over-used. Hearing Governor Shumlin's recent address  brought this to my attention, his nasal tone invoking our collective identity three times in the first five sentences:

{% highlight css %}
Mr. President, Mr. Speaker, members of the General Assembly, distinguished guests,
and fellow Vermonters:

Thank you for the tremendous honor and opportunity to serve again as Governor.
As a Vermonter who grew up, raised my daughters, and built two businesses here, it
is the greatest privilege of my life to give back to the state that has given me
so much. I love serving as Governor because I love Vermont.

I have worked hard as Governor to improve life for Vermonters in these
still-difficult times.
{% endhighlight %}

I decided to take a look at the use of "Vermonters" in every inaugural address, beginning with Thomas Chittenden in 1779, and compare it to the total words used by each Governor (Chittenden's 1779 stats: 835 words, 0 "Vermonters"). The Secretary of State has a great [archive](https://www.sec.state.vt.us/archives-records/state-archives/government-history/inaugurals-and-farewells/table-of-addresses.aspx) of these addresses (unfortunately all in PDF), and so I wrote a Python script to download it and convert them to text. For those interested, the text files are available [here](/data/inauguraladdresses).\\
\\
I used the NLTK package to count the occurrence of "Vermonter" or "Vermonters" in each document, with the big winner being Jim Douglas, whose 2007 address used the word 33 times. Here's my favorite sentence from his speech:

{% highlight css %}
I have warmed the thin hands of older Vermonters, their eyes still sparkling
between deep gray granite lines of age.
{% endhighlight %}

I also wanted to see how these trends played out over time. I wrote the results to CSV, and then graphed word count over time, with the "Vermonter" count symbolized by the size of each point. Much is owed to this great [D3 graph example](http://wrobstory.github.io/2013/11/D3-brush-and-tooltip.html) and this [stack exchange post](http://stackoverflow.com/questions/22651346/how-to-embed-a-d3-js-example-to-the-jekyll-blog-post) about integrating D3 with Jekyll. Here's the final product:

<style>

#example .point {
  fill: #2f225d;
  stroke: #afa2dc;
}

#example .selected {
  fill: #afa2dc;
  stroke: #2f225d;
}

#example .axis {
  font: 10px sans-serif;
}

#example p {
  font: 12px sans-serif;
  margin: 0 0 0 0;
  padding: 0;
}

#main .tooltip {
  font: 12px sans-serif;
  margin: 0 0 0 0;
  padding: 0;
}

#example .clear-button {
  font: 14px sans-serif;
  cursor: pointer;
}

#example .axis path,
.axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

#example .brush .extent {
  stroke: #fff;
  fill-opacity: .125;
  shape-rendering: crispEdges;
}
</style>
<script src="https://d3js.org/d3.v3.min.js"></script>
<script>
d3.helper = {};

d3.helper.tooltip = function(){
    var tooltipDiv;
    var bodyNode = d3.select('div#main').node();

    function tooltip(selection){

        selection.on('mouseover.tooltip', function(pD, pI){
            // Clean up lost tooltips
            d3.select('div#main').selectAll('div.tooltip').remove();
            // Append tooltip
            tooltipDiv = d3.select('div#main')
                           .append('div')
                           .attr('class', 'tooltip')
            var absoluteMousePos = d3.mouse(bodyNode);
            tooltipDiv.style({

                left: (absoluteMousePos[0])+'px',
                top: (absoluteMousePos[1])+'px',
                'background-color': '#d8d5e4',
                width: '170px',
                height: '60px',
                padding: '5px',
                position: 'absolute',
                'z-index': 1001,
                'box-shadow': '0 1px 2px 0 #656565'
            });

            var first_line = '<p>Governor: ' + pD.governor + '<br>'
            var second_line = 'Year: ' + pD.year + '<br>'
            var third_line = 'Total Words: ' + pD.totalwords_text + '<br>'
            var fourth_line = 'Number of "Vermonters": ' + pD.numvermonters

            tooltipDiv.html(first_line + second_line + third_line + fourth_line)
        })
        .on('mousemove.tooltip', function(pD, pI){
            // Move tooltip
            var absoluteMousePos = d3.mouse(bodyNode);
            tooltipDiv.style({
                left: (absoluteMousePos[0] - 190)+'px',
                top: (absoluteMousePos[1] + 10)+'px'
            });
        })
        .on('mouseout.tooltip', function(pD, pI){
            // Remove tooltip
            tooltipDiv.remove();
        });

    }

    tooltip.attr = function(_x){
        if (!arguments.length) return attrs;
        attrs = _x;
        return this;
    };

    tooltip.style = function(_x){
        if (!arguments.length) return styles;
        styles = _x;
        return this;
    };

    return tooltip;
};

var data = [];
var values = [];


d3.csv("/data/inauguraladdresses/wordcount.csv", function(csvData) {

  csvData.forEach(function(d) {

	data.push({
	index: +d.UniqueID,
    year: +d.Year,
    governor: d.Governor,
    totalwords: d.Totalwords,
    totalwords_text: d.Totalwords_STR,
    numvermonters: +d.Numberofvermonters,
    pcttotal: parseFloat(d.Pctwords)
	});

	values.push(+d.Totalwords);

  });
  buildChart(data);
})

function buildChart(inputData){

	var margin = {top: 20, right: 50, bottom: 60, left: 40},
		width = 720 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	var x = d3.scale.linear()
		.range([0, width])
		.domain([1775, 2026]);

	var y = d3.scale.linear()
		.range([height, 0])
		.domain([0, d3.max(values) + 100]);

	var brush = d3.svg.brush()
		.x(x)
		.on("brush", brushmove)
		.on("brushend", brushend);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom").tickFormat(d3.format("d"));

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.ticks(11);

	var svg = d3.select("div#example").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.append("g")
		.attr("class", "x axis")
		.attr("clip-path", "url(#clip)")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis);

	svg.append("g")
		.attr("class", "brush")
		.call(brush)
	  .selectAll('rect')
		.attr('height', height);

	svg.append("defs").append("clipPath")
		.attr("id", "clip")
	  .append("rect")
		.attr("width", width)
		.attr("height", height + 20);

	points = svg.selectAll(".point")
		.data(inputData)
	  .enter().append("circle")
		.attr("class", "point")
		.attr("clip-path", "url(#clip)")
		.attr("r", function(d){return d.numvermonters + 1.75;})
		.attr("cx", function(d) { return x(d.year); })
		.attr("cy", function(d) { return y(d.totalwords); })
		.call(d3.helper.tooltip());

	points.on('mousedown', function(){
	  brush_elm = svg.select(".brush").node();
	  new_click_event = new Event('mousedown');
	  new_click_event.pageX = d3.event.pageX;
	  new_click_event.clientX = d3.event.clientX;
	  new_click_event.pageY = d3.event.pageY;
	  new_click_event.clientY = d3.event.clientY;
	  brush_elm.dispatchEvent(new_click_event);
	});

	function brushmove() {
	  var extent = brush.extent();
	  points.classed("selected", function(d) {
		is_brushed = extent[0] <= d.year && d.year <= extent[1];
		return is_brushed;
	  });
	}

	function brushend() {
	  get_button = d3.select(".clear-button");
	  if(get_button.empty() === true) {
		clear_button = svg.append('text')
		  .attr("y", 460)
		  .attr("x", 540)
		  .attr("class", "clear-button")
		  .text("Clear Brush");
	  }

	  x.domain(brush.extent());

	  transition_data();
	  reset_axis();

	  points.classed("selected", false);
	  d3.select(".brush").call(brush.clear());

	  clear_button.on('click', function(){
		x.domain([1778, 2016]);
		transition_data();
		reset_axis();
		clear_button.remove();
	  });
	}

	function transition_data() {
	  svg.selectAll(".point")
		.data(data)
	  .transition()
		.duration(500)
		.attr("cx", function(d) { return x(d.year); });
	}

	function reset_axis() {
	  svg.transition().duration(500)
	   .select(".x.axis")
	   .call(xAxis);
	}
}

</script>

<div id="example"></div>
