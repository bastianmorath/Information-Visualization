var width = 360;
var height = 360;

var color = d3.scaleOrdinal(d3.schemeCategory10);

d3.csv('results.csv')
    .then(dataset => {

        // Do one group for each buffer and method configuration
        var buffer_method_groups = d3.nest()
            .key(function (d) {
                return d.bufSize
            })
            .key(function (d) {
                return d.method
            })
            // 2. For each buffer/method configuration, calculate metrics
            .rollup(function (d) {
                return {
                    avg_quality: d3.mean(d, function (g) {
                        return g.quality;
                    }),
                    avg_num_changes: d3.mean(d, function (g) {
                        return g.change;
                    }),
                };
            })
            .entries(dataset);

        // Generate one plot for each buffer group
        buffer_method_groups.forEach(function (d) { 
            generate_plot(d.key, d.values);
        });

    });

function generate_plot(key, values) {
    // standard d3 plot setup
    var margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 40
        },
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

    x_max = d3.max(values, function (d) {
        return d.value.avg_quality;
    })
    y_max = d3.max(values, function (d) {
        return d.value.avg_num_changes;
    })

    x.domain([0, x_max / 10 + x_max]);
    y.domain([0, y_max / 10 + y_max]);

    // x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .style("font-size", "12px")
        .call(xAxis);
    
    // y-axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 2)
        .attr("dy", ".71em")
        .style("text-anchor", "end")


    // draw a point g
    var point = svg.selectAll(".point")
        .data(values)
        .enter()
        .append("g")
        .attr("class", "point");

    // add circle for each method with respective color
    point.append("circle")
        .attr("cx", function (d) {
            return x(d.value.avg_quality);
        })
        .attr("r", function (d) {
            return 7;
        })
        .attr("cy", function (d) {
            return y(d.value.avg_num_changes);
        })
        .style("fill", function (d, i) {
            return color[i];
        })

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
        .text("Average number of changes in quality");

    // Add title
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 20 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "17px")
        .style("text-decoration", "underline")
        .text("Buffer size " + key);

    // add legend
    var legend = svg.append("g")
        .attr("class", "legend")
        .attr("x", width - 65)
        .attr("y", 25)
        .attr("height", 100)
        .attr("width", 100);

    var methods = ['Method 1', 'Method 2', 'Method 3', 'Method 4', 'Method 5',
        'Method 6', 'Method 7', 'Method 8', 'Method 9', 'Method 10',
    ];

    legend.selectAll('.legend').data(color)
        .enter()
        .append('g')
        .each(function (d, i) {
            var g = d3.select(this);

            g.append("text")
                .attr("x", 30)
                .attr("y", i * 25 + 200)
                .attr("height", 30)
                .attr("width", 100)
                .style("fill", color[i])
                .text(methods[i]);
        });
}