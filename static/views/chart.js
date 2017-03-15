    var margin = {top: 50, right: 50, bottom: 50, left: 0},
            width  = $("#chartarea").width() - margin.left - margin.right,
            height = ($("#chartarea").width() - margin.right - margin.left)/3;

    var parseDate = d3.timeParse("%Y-%m-%d");

    var x = techan.scale.financetime()
            .range([0, width]);

    var y = d3.scaleLinear()
            .range([height, 0]);

    var candlestick = techan.plot.candlestick()
            .xScale(x)
            .yScale(y);

    var xAxis = d3.axisBottom(x);

    var xTopAxis = d3.axisTop(x);

    var yAxis = d3.axisLeft(y);

    var yRightAxis = d3.axisRight(y);


    var ohlcRightAnnotation = techan.plot.axisannotation()
            .axis(yRightAxis)
            .orient('right')
            .format(d3.format(',.2f'))
            .translate([width, 0]);

    var timeTopAnnotation = techan.plot.axisannotation()
            .axis(xTopAxis)
            .orient('top')
            .format(d3.timeFormat('%d-%m-%Y'))
            .width(80);

    var crosshair = techan.plot.crosshair()
            .xScale(x)
            .yScale(y)
            .xAnnotation([ timeTopAnnotation])
            .yAnnotation([ ohlcRightAnnotation])
            .on("enter", enter)
            .on("out", out)
            .on("move", move);

    var svg = d3.select("#chartarea").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var coordsText = svg.append('text')
            .style("text-anchor", "end")
            .attr("class", "coords")
            .attr("x", width - 5)
            .attr("y", 15);

    d3.csv("/api/values", function(error, data) {
        var accessor = candlestick.accessor();

        data = data.slice(0, 200).map(function(d) {
            return {
                date: parseDate(d.Date),
                open: +d.Open,
                high: +d.High,
                low: +d.Low,
                close: +d.Close,
                volume: +d.Volume
            };
        }).sort(function(a, b) { return d3.ascending(accessor.d(a), accessor.d(b)); });

        x.domain(data.map(accessor.d));
        y.domain(techan.scale.plot.ohlc(data, accessor).domain());

        svg.append("g")
                .datum(data)
                .attr("class", "candlestick")
                .call(candlestick);

        svg.append("g")
                .attr("class", "x axis")
                .call(xTopAxis);

        svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

        svg.append("g")
                .attr("class", "y axis")
                .call(yAxis);

        svg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + width + ",0)")
                .call(yRightAxis);

        svg.append('g')
                .attr("class", "crosshair")
                .datum({ x: x.domain()[80], y: 67.5 })
                .call(crosshair)
                .each(function(d) { move(d); }); // Display the current data

        svg.append('text')
                .attr("x", 5)
                .attr("y", 15)
                .text("Fresenius Medical Care");
    });

    function enter() {
        coordsText.style("display", "inline");
    }

    function out() {
        coordsText.style("display", "none");
    }

    function move() {
    }