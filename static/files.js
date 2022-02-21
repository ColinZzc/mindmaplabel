var globalfileList = null
var currentFileIndex = -1

d3.json('/filelist').then((filelist)=>{
    console.log(filelist)
    globalfileList = d3.select('#filelist')
        .selectAll("label")
        .data(filelist)
        .enter()
        .append("button")
        .attr("class", "btn btn-default")
        .attr("onclick", "chooseFile(this)")
        .attr("value", (d,i)=>i) //index
        .text(d=>d)
    globalfileList.append('input')
        .attr("type", "radio")

})

function chooseFile(obj) {
    let filename = obj.textContent
    currentFileIndex = Number(obj.value)
    readTextFile(filename)


    let spans = document.getElementsByTagName("span")
    for (const span of spans) {
        span.style.opacity = "1"
    }
}