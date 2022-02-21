var width = 1000
var height = 800
var widthForText = 300
var svg = d3
    .select("#viz")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
var data = [];
var data_p = [];
var x_all = new Array();
var y_all = new Array();
var text_all = new Array();
var group_y = 50

function cleanSVG(){
    d3.select("#viz").select("svg").remove()
    svg = d3.select("#viz")
        .append("svg")
        .attr("viewBox", "0 0 "+(width+widthForText)+" "+height)
    data = [];
    data_p = [];
    x_all = new Array();
    y_all = new Array();
    text_all = new Array();
    group_y = 50
}


function readTextFile(file) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", "static/data/tobeCheck/"+file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == "200") {

            //clean svg
            cleanSVG()

            var text = (rawFile.responseText);
            data = JSON.parse(text);
            //console.log(data[0].nodes);
            data[0].nodes.forEach(function (node) {
                data_p.push(node.id)
                //console.log(data_p.indexOf(node.id))
                add_node(node.id, node.text, node.coordinates.x * width, node.coordinates.y * height,
                    node.coordinates.width * width, node.coordinates.height * height, node.color, node.shape);
            });
            data[0].links.forEach(function (link) {
                //console.log(link)
                add_link(link.node1, link.node2, link.color, link.relation);
            });
            data[0].groups.forEach(function (group) {
                //console.log(group)
                add_group(group.relation, group.nodes);
            });
        }
    }
    rawFile.send(null);
}

// readTextFile("33.json");


function add_node(id, text, x, y, width, height, color, shape) {
    var node = svg
        .append("g")
        .attr("class", "node-group");
    if (shape == "0") {
        add_rect(node, id, text, x, y, width, height, "white");
    } else if (shape == "1") {
        add_circle(node, id, text, x, y, width, height, color);
    } else if (shape == "2") {
        add_rect(node, id, text, x, y, width, height, color);
    } else if (shape == "3") {
        add_rect(node, id, text, x, y, width, height, color, 10);
    }
    x_all.push(x);
    y_all.push(y);
    text_all.push(text);
}

function add_rect(node, id, text, x, y, width, height, color, rx = 1) {
    node
        .append("rect")
        .attr("rx", rx)
        .attr("id", "node" + id)
        .attr("class", "node-point")
        .attr("x", x - width / 2)
        .attr("y", y - height / 2)
        .attr("height", height)
        .attr("width", width)
        .attr("stroke", color)
        .attr("fill", "white");
    node.append('text')
        .attr("id", "text" + id)
        .attr('class', 'text')
        .attr('x', x - width / 2)
        .attr('y', y)
        .text(text);
}

function add_circle(node, id, text, x, y, width, height, color) {
    node
        .append("circle")
        .attr("id", "node" + id)
        .attr("class", "node-point")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", width/2)
        .attr("stroke", color)
        .attr("fill", "None")
        .attr("opacity", .5);
    node.append('text')
        .attr("id", "text" + id)
        .attr('class', 'text')
        .attr('x', x - width / 2)
        .attr('y', y)
        .text(text);
}

function add_link(node1, node2, color, relation) {

    let x1 = x_all[data_p.indexOf(node1)];
    let y1 = y_all[data_p.indexOf(node1)];
    let x2 = x_all[data_p.indexOf(node2)];
    let y2 = y_all[data_p.indexOf(node2)];

    //console.log(d3.select("#node" + node1).attr("x"))

    var link = svg
        .append("g");
    link
        .append("line")
        .attr("class", "link "+relation)
        .attr("x1", x1)
        .attr("x2", x2)
        .attr("y1", y1)
        .attr("y2", y2)
        .attr("stroke", color)
        .attr("stroke-width", 5)
        .attr("opacity", 0.5);

    // let mx = (x1 / 2.0 + x2 / 2.0);
    // let my = (y1 / 2 + y2 / 2);
    // console.log(node2)
    // link.append('text')
    //     .attr('class', 'text-link')
    //     .attr('x', mx)
    //     .attr('y', my)
    //     .attr("stoke", "black")
    //     .text(relation);
}

function add_group(relation, nodes) {
    node_list = nodes.split(" ");
    svg.append('text')
        .attr('class', 'text-group')
        .attr('x', width)
        .attr('y', group_y)
        .attr("stoke", "black")
        .text(relation + ":");

    node_list.forEach(function (node) {
        group_y += 20
        svg.append('text')
            .attr('class', 'text-group')
            .attr('x', width)
            .attr('y', group_y)
            .attr("stoke", "black")
            .text(text_all[data_p.indexOf(node)]);
    });

    group_y += 30
}
