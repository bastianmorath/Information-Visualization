var colors = ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69",
    "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5", "#ffed6f"
];

var svg = d3.select("svg"),
    margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40
    },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
var x0 = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1);

var x1 = d3.scaleBand()
    .padding(0.05);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var z = d3.scaleOrdinal()
    .range(colors);

d3.csv('results.csv')
    .then(data => {
        data = data.filter(function (el) {
            return el.sample == 'v1'
        });
        var profile_method_stalls = d3.nest()
            .key(function (d) {
                return d.profile
            })
            .key(function (d) {
                return d.method
            })
            // 2. For each buffer/method configuration, calculate stalls
            .rollup(function (d) {
                return {
                    num_stalls: d3.mean(d, function (g) {
                        return g.numStall;
                    }),
                };
            })
            .entries(data);

        var keys = ['Method1', 'Method2', 'Method3', 'Method4', 'Method5', 'Method6', 'Method7', 'Method8', 'Method9', 'Method10'];

        x0.domain(['p1', 'p2', 'p3', 'p4']);
        x1.domain(keys).rangeRound([0, x0.bandwidth()]);
        
        y.domain([0, 10 + d3.max(profile_method_stalls, function (d) {
            return d3.max(keys, function (key) {
                value = -1;
                var arrayLength = d.values.length;
                for (var i = 0; i < arrayLength; i++) {
                    if (d.values[i].key == key) {
                        value = d.values[i].value.num_stalls;
                    }
                }
                return value;
            });
        })]).nice();

        // Add bars
        g.append("g")
            .selectAll("g")
            .data(profile_method_stalls)
            .enter().append("g")
            .attr("transform", function (d) {
                return "translate(" + x0(d.key) + ",0)";
            })
            .selectAll("rect")
            .data(function (d) {
                return keys.map(function (key) {
                    value = -1;
                    var arrayLength = d.values.length;
                    for (var i = 0; i < arrayLength; i++) {
                        if (d.values[i].key == key) {
                            value = d.values[i].value.num_stalls;
                        }
                    }
                    return {
                        key: key,
                        value: value
                    };
                });
            })
            .enter().append("rect")
            .attr("x", function (d) {
                return x1(d.key);
            })
            .attr("y", function (d) {
                return y(d.value);
            })
            .attr("width", x1.bandwidth())
            .attr("height", function (d) {
                return height - y(d.value);
            })
            .attr("fill", function (d) {
                return z(d.key);
            });

        // Set up axis
        g.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x0));

        g.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y).ticks(null, "s"))

        g.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 6)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("Average number of stalls for V7");

        // Add legend
        var legend = g.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "end")
            .selectAll("g")
            .data(keys.slice().reverse())
            .enter().append("g")
            .attr("transform", function (d, i) {
                return "translate(" + -i * 77 + ",10)";
            });

        legend.append("rect")
            .attr("x", width - 90)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", z);

        legend.append("text")
            .attr("x", width - 25)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .text(function (d) {
                return d;
            });
    });