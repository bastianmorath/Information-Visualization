var width = 360;
var height = 360;
var radius = Math.min(
    width, height) / 2;

var color = d3.scaleOrdinal(d3.schemeCategory10);
var donutWidth = 75;

var svg = d3.select('#chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + (width / 2) +
        ',' + (height / 2) + ')');

var arc = d3.arc().innerRadius(radius - donutWidth).outerRadius(radius);

var pie = d3.pie()
    .value(function(d) {
        return d.change;
    })
    .sort(null);

d3.csv('results.csv')
    .then(dataset => { 
       
        // Do one group for each buffer and method configuration
        var buffer_method_groups = d3.nest()
            .key(function(d) { return d.bufSize})
            .key(function(d) { return d.method})
            // 2. For each buffer/method configuration, calculate metrics
            .rollup(function(d) { return {
                avg_quality: d3.mean(d, function(g) {return g.quality; }),
                num_changes: d3.sum(d, function(g) {return g.change; }),
              };
            })
            .entries(dataset);
        
        console.log(buffer_method_groups)
        


       
        var avg_quality_per_method = d3.nest()
            .key(function(d) { return d.method;})
            .rollup(function(d) { 
                return d3.mean(d, function(g) {return g.quality; });
            }).entries(dataset); 

        avg_quality_per_method.forEach(function(d) {
            d.method = d.key;
            d.avg_quality = d.value;
        });
        // 3. For each buf conf + method, calculate metrics

        
       


        var num_changes_per_method = d3.nest()
            .key(function(d) { return d.method;})
            .rollup(function(d) {
            return d3.sum(d, function(g) {return g.change; });
            }).entries(dataset);

        num_changes_per_method.forEach(function(d) {
            d.method = d.key;
            d.num_changes = d.value;
        });
        
        // console.log(avg_quality_per_method)
        // console.log(num_changes_per_method)
        
        var qualities = []
        avg_quality_per_method.forEach(function (entry) {
            qualities.push(entry.avg_quality);
        });

        var changes = []
        num_changes_per_method.forEach(function (entry) {
            changes.push(entry.num_changes);
        });

        // console.log(qualities);
        // console.log(changes);

        var data = [] 
        for (let index = 0; index < qualities.length; index++) {
            const quality = qualities[index];
            const num_changes = changes[index];
            var dict = {'x': quality, 'y': num_changes}; // create an empty array
            data.push(dict)
        }

        // standard d3 plot setup
        var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 500 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

        var x = d3.scaleLinear()
            .range([0, width]);

        var y = d3.scaleLinear()
            .range([height, 0]);

        var xAxis = d3.axisBottom()
            .scale(x)

        var yAxis = d3.axisLeft()
            .scale(y)

        var svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var color = d3.schemeCategory10;


        x.domain([0, d3.max(data, function(d) { return d.x; })]);
        y.domain([0, d3.max(data, function(d) { return d.y; })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end");

        // draw a point g
        var point = svg.selectAll(".point")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "point");

        // add circle
        point.append("circle")
            .attr("cx", function(d) { return x(d.x); })
            .attr("r", function(d) { return 10; })
            .attr("cy", function(d) { return y(d.y); })
            .style("fill", function(d,i){ return color[i]; })

        // X-Axis label
        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height - 6)
            .text("Average quality");

        // Y-Axis label
        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 6)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("Total changes");

        
        // add legend   
	var legend = svg.append("g")
        .attr("class", "legend")
        .attr("x", width - 65)
        .attr("y", 25)
        .attr("height", 100)
        .attr("width", 100);
        
    var methods = ['Method 1', 'Method 2', 'Method 3', 'Method 4', 'Method 5', 
    'Method 6', 'Method 7', 'Method 8', 'Method 9', 'Method 10',];
    
    legend.selectAll('.legend').data(color)
        .enter()
        .append('g')
        .each(function(d, i) {
            var g = d3.select(this);
            g.append("circle")
                .attr("x", width - 65)
                .attr("y", i*10)
                .attr("r", 25)
                .style("fill", color[i]);
            
            g.append("text")
                .attr("x", width - 50)
                .attr("y", i * 25 + 4)
                .attr("height",30)
                .attr("width",100)
                .style("fill", color[i])
                .text(methods[i]);
            });
});

    
