/**
 * Created by lucylu on 7/16/17.
 */
// $SCRIPT_ROOT = {{ request.script_root|tojson|safe }};

// word cloud
var draw_cloud = function(e) {
    $.getJSON('/word_count', function (data) {
        var fill = d3.scale.category20();

        var layout = d3.layout.cloud()
            .size([850, 350])
            .words(data.wc)
            // .padding(5)
            // .padding([0, 2, 0, 2])
            .padding(1.5)
            .rotate(function () {
                return ~~(Math.random() * 2) * 90;
            })
            // .rotate(0)
            .font("Impact")
            .fontSize(function (d) {
                return d.size;
            })
            .on("end", draw);

        layout.start();

        function draw(words) {
            d3.select(".canvas").append("svg")
                .attr("width", layout.size()[0])
                .attr("height", layout.size()[1])
                .attr("class", "cloud")
                .append("g")
                .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
                .selectAll("text")
                .data(words)
                .enter().append("text")
                .style("font-size", function (d) {
                    return d.size + "px";
                })
                .style("font-family", "Impact")
                // .style("fill", function (d, i) {
                //     return fill(i);
                // })
                .attr("text-anchor", "middle")
                .attr("transform", function (d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .append("a")
                .attr("id", "cloud-word")
                // .attr("href", function(d) { return d.text; })
                .attr("href", "#")
                .on("click", draw_text)
                .attr("fill", function (d, i) {
                    return fill(i);
                })
                .text(function (d) {
                    return d.text;
                });
        }
    });
};

var draw_text = function(e) {
    $.getJSON('/shuffle_text', {
        keyword: $(this).text(),
        color: $(this).attr('fill')
    }, function(data) {
        $(".text-row").empty();
        $("#text-title").text(function(i, old_text) {
            return data.kw ? "Shuffled Lines with Word "+data.kw : "Shuffled Lines";
        }).mark(data.kw, {
                "element": "span",
                "className": "highlight"
            });
        data.st.forEach(function(element) {
            $(".text-row").append(
                // '<i class="fa fa-camera-retro fa-lg"></i>'+
                '<p class="text-p"><i class="fa fa-chevron-right fa-lg text-p-icon"></i>'+element+"</p>")
                .mark(data.kw, {
                "element": "span",
                "className": "highlight"
            });
        });

        $(".text-p-icon").css("color", data.fc);
        $(".highlight").css("color", data.fc);

    return false;
})};


$(function() {
    draw_cloud();
    draw_text();
});
