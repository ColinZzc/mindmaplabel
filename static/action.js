d3.select("#controlArea")
    .selectAll("span")
    .on("mouseover", highlightlinks)

function highlightlinks(obj) {
    let label = this.textContent
    d3.select("#viz")
        .selectAll(".link")
        .attr("stroke-width", 1)
    d3.select("#viz")
        .selectAll("."+label)
        .attr("stroke-width", 5)

    let spans = document.getElementsByTagName("span")
    for (const span of spans) {
        span.style.opacity = ".5"
    }
    this.style.opacity = "1"
}

function labelAction(bool) {
    if (currentFileIndex<0) {
        return
    }

    console.log(bool)
    let fileName = globalfileList.data()[currentFileIndex]
    let dom = globalfileList.nodes()[currentFileIndex]
    if (bool) {
        dom.className = dom.className.replace('default', 'success')
    } else {
        dom.className = dom.className.replace('default', 'warning')
    }

    fetch('/label', {
        method: "post",
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"filename": fileName, "label": bool})
    })

    if (currentFileIndex+1<globalfileList.size()) {
        globalfileList.nodes()[Number(currentFileIndex)+1].click()
    } else {
        alert("到最后啦～ 在王总发现前摸一会鱼吧～")
    }
}

function save() {
    fetch('/save')
}