d3.csv('results.csv')
    .then(dataset => {

        var margin = {
                top: 30,
                right: 0,
                bottom: 100,
                left: 90
            },
            width = 960 - margin.left - margin.right,
            height = 430 - margin.top - margin.bottom,
            gridSize = Math.floor(width / 10),
            legendElementWidth = gridSize,

            colors = d3['schemeRdYlGn'][9]
        
            // Create dataset, i.e. for each method/buffer conf combination, calculate avg. QoE

        // Transform "method_x" into a numerical value"
        dataset.forEach(function (d) {
            d.method = +(d.method.slice(-1));
        });

        var buffer_method_groups = d3.nest()
            .key(function (d) {
                return d.bufSize
            })
            .key(function (d) {
                return d.method
            })
            // 2. For each buffer/method configuration, calculate metric
            .rollup(function (d) {
                return {
                    avg_qoe: d3.mean(d, function (g) {
                        return g.qoe;
                    }),
                };
            })
            .entries(dataset);

        // Bring it into array/dictionary form for easier processing later
        var dataArray = new Array(3)
        var i = 0;
        for (const [key, value] of Object.entries(buffer_method_groups)) {
            dataArray[i] = value.values.map(function (d) {
                return d.value.avg_qoe
            });
            i++;
        }
        var methods = ["M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9", "M10"],
            buffer_configs = ["30/60", "120", "240"];

        var data = []
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 10; j++) {
                const element = dataArray[i][j];
                var newItem = {};
                newItem.method = methods[j];
                newItem.buffer = buffer_configs[i];
                newItem.value = dataArray[i][j];
                data.push(newItem);
            }
        }

        var svg = d3.select("#chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Method labels
        svg.selectAll(".methodLabel")
            .data(buffer_configs)
            .enter().append("text")
            .text(function (d) {
                return d;
            })
            .attr("x", 0)
            .attr("y", function (d, i) {
                return i * gridSize;
            })
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
            .attr("class", "dayLabel mono axis axis-workweek");
            
        // Buffer labels
        svg.selectAll(".bufferLabel")
            .data(methods)
            .enter()
            .append("text")
            .text(function (d) {
                return d;
            })
            .attr("x", function (d, i) {
                return i * gridSize;
            })
            .attr("y", 0)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSize / 2 + ", -6)")
            .attr("class", "dayLabel mono axis axis-workweek");
            
        // Create color scheme
        var conc_values = [].concat.apply([], dataArray)
        var colorScale = d3.scaleQuantile([d3.min(conc_values), d3.max(conc_values)], colors)

        var cards = svg.selectAll(".method")
            .data(data, function (d) {
                return d.values;
            })

        cards.append("title");
        
        // Create one "tile" for each buffer/method configuration
        cards.enter().append("rect")
            .attr("x", function (d) {
                x_index = methods.findIndex(m => m === d.method);
                return x_index * gridSize;
            })
            .attr("y", function (d) {
                y_index = buffer_configs.findIndex(m => m === d.buffer);
                return y_index * gridSize;
            })
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("class", "hour bordered")
            .attr("width", gridSize)
            .attr("height", gridSize)
            .style("fill", function (d) {
                return colorScale(d.value)
            });

        cards.select("title").text(function (d) {
            return 'd.value';
        });

        cards.exit().remove();

        // Create legend
        var legend = svg.selectAll(".legend")
            .data([0].concat(colorScale.quantiles()), function (d) {
                return d;
            })
            .enter();


        legend.append("g")
            .attr("class", "legend");

        legend.append("rect")
            .attr("x", function (d, i) {
                return legendElementWidth * i;
            })
            .attr("y", height)
            .attr("width", legendElementWidth)
            .attr("height", gridSize / 2)
            .style("fill", function (d, i) {
                return colors[i];
            });

        legend.append("text")
            .attr("class", "mono")
            .text(function (d) {
                return "≥ " + Math.round(d);
            })
            .attr("x", function (d, i) {
                return legendElementWidth * i;
            })
            .attr("y", height + gridSize - 20);

        legend.append("text")
            .attr("class", "mono")
            .text('Each tile shows the average QoE')
            .attr("x", 0)
            .attr("y", height - 10);

        legend.exit().remove();

    });