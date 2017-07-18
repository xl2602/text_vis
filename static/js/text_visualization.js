/**
 * Created by lucylu on 7/16/17.
 */
// $SCRIPT_ROOT = {{ request.script_root|tojson|safe }};

// word cloud
$.getJSON('/word_count', function(data) {
    console.log(data);

    var fill = d3.scale.category20();

    var layout = d3.layout.cloud()
        .size([850, 350])
        .words(data.wc)
        // .padding(5)
        .padding(1.5)
        .rotate(function() { return ~~(Math.random() * 2) * 90; })
        // .rotate(0)
        .font("Impact")
        .fontSize(function(d) { return d.size; })
        .on("end", draw);

    layout.start();

    function draw(words) {
      d3.select(".canvas").append("svg")
          .attr("width", layout.size()[0])
          .attr("height", layout.size()[1])
          .attr("class", "wordcloud")
        .append("g")
          .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
        .selectAll("text")
          .data(words)
        .enter().append("text")
          .style("font-size", function(d) { return d.size + "px"; })
          .style("font-family", "Impact")
          .style("fill", function(d, i) { return fill(i); })
          .attr("text-anchor", "middle")
          .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          })
          .text(function(d) { return d.text; });
    }
});


$.getJSON('/shuffle_text', function(data) {
    // console.log(data);
    data.st.forEach(function(element) {
        // console.log(element);
        $(".text-row").append("<p>"+element+"</p>")
    });
});


$(".text-row").mark("said", {
    "element": "span",
    "className": "highlight"
});

// $(".text-row").mark("said");

