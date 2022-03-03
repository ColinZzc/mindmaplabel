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

    // <!--svg中会用到的箭头-->
    // <defs>
    //   <marker id="markerArrow" markerWidth="13" markerHeight="13" refx="2" refy="6" orient="auto">
    //     <path d="M2,2 L2,11 L10,6 L2,2"style="fill: #000000;" />
    //   </marker>
    // </defs>
    let arrorSize = 2
    svg.append("defs")
        .append("marker")
        .attr("id", "markerArrow")
        .attr("viewBox", "0 0 "+arrorSize+" "+arrorSize)
        .attr("markerWidth", arrorSize)
        .attr("markerHeight", arrorSize)
        .attr("refX", arrorSize)
        .attr("refY", arrorSize/2)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M 0 0 L "+arrorSize+" "+arrorSize/2+" L 0 "+arrorSize+" z")
        .attr("fill", "#000000")



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
                add_link(link.node1, link.node2, link.color, link.relation, link.shape);
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
        add_rect(node, id, text, x, y, width, height, "white"); // rx默认值1：直角 color白的：无轮廓
    } else if (shape == "1") {
        add_circle(node, id, text, x, y, width, height, color);
    } else if (shape == "2") {
        add_rect(node, id, text, x, y, width, height, color);
    } else if (shape == "3") {
        add_rect(node, id, text, x, y, width, height, color, 10);
    } else if (shape == "4") { //polygon
        add_polygon(node, id, text, x, y, width, height, color, 5);
    }else if (shape == "5") { //flower
        add_flower(node, id, text, x, y, width, height, color, 5);
    }else if (shape == "5") { //other
        add_polygon(node, id, text, x, y, width, height, color, 3);
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

function add_polygon(node, id, text, x, y, width, height, color, n) {
    node
        .append("polygon")
        .attr("id", "node" + id)
        .attr("class", "node-point")
        .attr("points", polygonPoints(x,y,width/2, n))
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

function polygonPoints(cx,cy,r,n){
    var alpha=2*Math.PI/n;
    var a=Math.PI/2+alpha/2;
    var points="";
    for(var i=0;i<n;i++){
        x=cx+r*Math.cos(a);
        y=cy+r*Math.sin(a);
        points+=x+","+y+",";
        a+=alpha;
    }
    return points.substring(0,points.length-1);
}

function add_flower(node, id, text, x, y, width, height, color, n) {
    node
        .append("path")
        .attr("id", "node" + id)
        .attr("class", "node-point")
        .attr("d", flowerD(x, y, width/2, n))
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

function flowerD(cx, cy, r, n) {
    n=n*2
    var alpha=2*Math.PI/n;
    var a=Math.PI/2+alpha/2;

    x=cx+r*Math.cos(a);
    y=cy+r*Math.sin(a);
    var d="M "+x+" "+y+", ";
    a+=alpha;

    for(var i=1;i<n;i+=2){
        x1=cx+r*2*Math.cos(a);
        y1=cy+r*2*Math.sin(a);
        a+=alpha
        x=cx+r*Math.cos(a);
        y=cy+r*Math.sin(a);
        a+=alpha
        d+="Q "+x1+" "+y1+" "+x+" "+y+" , ";
    }
    return d.substring(0,d.length-1);
}

function add_link(node1, node2, color, relation, shape) {

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
        .attr("opacity", 0.5)

    if (shape=="2") {
        link.attr("marker-end", "url(#markerArrow)");
    } else if (shape=="3") {
        link.attr("marker-start", "url(#markerArrow)");
    } else if (shape=="4") {
        link.attr("marker-start", "url(#markerArrow)");
        link.attr("marker-end", "url(#markerArrow)");
    } else if (shape=="5") {
        link.attr("stroke-dasharray", "3 2");
    }

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

