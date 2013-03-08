// ==UserScript==
// @name vMB Hessen Analyse
// @require http://d3js.org/d3.v3.min.js
// @namespace vMBAnalyse
// @description Visualisiert die Zeitpunkte und Werte der abgegemenen Stimmen
// @include https://vote-*.piratenpartei-hessen.de/auswertung.php?id=*
// @version 1.0
// @grant none
// ==/UserScript==


var data;

var margin = {top: 20, right: 70, bottom: 50, left: 70},
width = 500 - margin.left - margin.right,
height = 300 - margin.top - margin.bottom;
var r=Math.min(width,height)/2;
var maxVotes=document.querySelector("#tokens").firstChild.nodeValue;
var startdate=new Date().getTime();

var startDateLoaded=false;
var TokensLoaded=false;

function analyseStartDate(logdocument){

    logdocument=logdocument.split("aktiviert");
    logdocument=logdocument[0].split("\n");
    //regular expression would be nicer, but we'll assume 'aktiviert' is unique and
    //that the start date is at the beginning of the occurring line
    var ld=logdocument[logdocument.length -1].substr(1,19);

    startdate = new Date(ld.substr(0,4),ld.substr(5,2)-1,ld.substr(8,2),ld.substr(11,2),ld.substr(14,2),ld.substr(17,2)).getTime();
    
    startDateLoaded=true;
    if(TokensLoaded){
            createGraphs();
    }

}

function analyseTokens(tokendocument){
        var submitdatesEl=tokendocument.querySelectorAll('.submitdate');
        var answerEl=tokendocument.querySelectorAll('.answer');
        nrVotes=submitdatesEl.length;

        data = new Array(nrVotes);
        for(var k=0; k<nrVotes; k++){
          data[k]={};
        }

        var answers = new Array();
        for(var k=0; k<nrVotes; k++){
          data[k].answer=answerEl[k].childNodes[2].nodeValue.substr(1,1);
        }

        for(var k=0; k<nrVotes; k++){
          var td=submitdatesEl[k].firstChild.nodeValue;
          data[k].submitdate = new Date('20'+td.substr(6,2),td.substr(3,2)-1,td.substr(0,2),td.substr(9,2),td.substr(12,2),td.substr(15,2)).getTime();
        }

        data.sort(function(a,b){return a.submitdate-b.submitdate});
        
        TokensLoaded=true;
        if(startDateLoaded){
                createGraphs();
        }
}

function drawPieChart( pieDataSet,transitionTime){
         //draw a pie chart into a different svg

        var arc = d3.svg.arc()
         .innerRadius(0)
         .outerRadius(r/4*3);

        var pie = d3.layout.pie()
         .sort(null)
         .value(function(d) { return d.value; });

         var piechart = d3.select("body").select("#content").select("#piechart").select("svg").select("g");

         var color = d3.scale.ordinal()
          .domain(["Ja","Enthaltung","Nein","Nicht Abgestimmt"])
          .range(["#ff420e", "#579d1c", "#ffd320", "#7e0021"]);

        //create the data set
        var pieData=[{"label":"Ja", value:pieDataSet.cumyea},
                 {"label":"Enthaltung", value:pieDataSet.cumabst},
                 {"label":"Nein", value:pieDataSet.cumnay}];

        var arcs = piechart.selectAll(".arc")
         .data(pie(pieData));

        var arcsenter = arcs.enter()
         .append("g")
         .attr("class", "arc");
        arcsenter.append("path")
         .attr("fill", function(d,i) { return color(d.data.label); } );
        arcsenter.append("text")
         .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })//arc.centroid(d)
         .attr("dy", ".35em")
         .style("text-anchor", "middle")
         .text(function(d,i) { return d.data.label; });

        var paths =  arcs.select("path");
        paths.transition().duration(transitionTime).attr("d", arc);

        var labels =arcs.select("text");
        labels.transition().duration(transitionTime).attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; });

        pieData[3]={"label":"Nicht Abgestimmt", value:(maxVotes/nrVotes)-pieDataSet.cumyea-pieDataSet.cumabst-pieDataSet.cumnay};

        var arc2 = d3.svg.arc()
             .outerRadius(r)
             .innerRadius(r/4*3);

        var arcs = piechart.selectAll(".arc2")
         .data(pie(pieData));

        var arcsenter = arcs.enter()
         .append("g")
         .attr("class", "arc2");
         arcsenter.append("path")
         .attr("fill", function(d, i) { return color(d.data.label); });

        var paths =  arcs.select("path");
        paths.transition().duration(transitionTime).attr("d", arc2);

        arcsenter.append("text")
         .attr("transform", function(d) { return "translate(" + arc2.centroid(d) + ")"; })
         .attr("dy", ".35em")
         .style("text-anchor", "middle")
         .text(function(d,i) { return d.data.label; });

        var labels =arcs.select("text");
        labels.transition().duration(transitionTime).attr("transform", function(d) { return "translate(" + arc2.centroid(d) + ")"; });

        }

function createGraphs(){
        for(var k=0; k<nrVotes; k++){
          data[k].submitdays= (data[k].submitdate-startdate)/1000/60/60/24;
          data[k].yea=data[k].answer=='J'?1:0;
          data[k].nay=data[k].answer=='N'?1:0;
          data[k].abst=data[k].answer=='E'?1:0;
          data[k].cumyea=data[k].yea/(nrVotes);
          data[k].cumnay=data[k].nay/(nrVotes);
          data[k].cumabst=data[k].abst/(nrVotes);
          if(k>0){
                 data[k].cumyea+=data[k-1].cumyea;
                 data[k].cumnay+=data[k-1].cumnay;
                 data[k].cumabst+=data[k-1].cumabst;
          }
        }
        
        bisectData = d3.bisector(function(d) { return d.submitdays; }).left

        var x = d3.scale.linear()
                 .range([0, width])
                 .domain([0, data[nrVotes-1].submitdays]);

        var y = d3.scale.linear()
                 .range([height, 0])
                 .domain([0, (nrVotes)]); 


        var yratio = d3.scale.linear()
                 .range([height, 0])
                 .domain([0, 100]); 


        var xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.format(",.2f")).ticks(Math.round(data[nrVotes-1].submitdays));
        var yAxis = d3.svg.axis().scale(y).orient("left");
        var yratioAxis = d3.svg.axis().scale(yratio).orient("right");

        var nested_data = d3.nest()
         .key(function(d) { return d.answer; })
         .entries(data);

        var line = d3.svg.line()
                 .x(function(d) { return x(d.submitdays); })
                 .y(function(d,i) { return y(i+1); });

       var approvalratio = d3.svg.line()
                 .x(function(d) { return x(d.submitdays); })
                 .y(function(d,i) { return yratio(100*d.cumyea/(i+1)*(nrVotes)); });


        var color = d3.scale.ordinal()
          .domain(["J","E","N","X","A"])
          .range(["#ff420e", "#579d1c", "#ffd320", "#000000", "ff00ff"]);

        var charttable = d3.select("body").select("#content").insert("table",":first-child").append("tr");
        var chart = charttable.append("td").attr("Id", "chart").attr("class", "chart").append("svg")
             .attr("width", width + margin.left + margin.right)
             .attr("height", height + margin.top + margin.bottom)
             .append("g")
             .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var answers = chart.selectAll(".answers")
               .data(nested_data)
               .enter().append("g")
               .attr("class", "answers");

         answers.append("path")
               .attr("class", "line")
               .attr("d", function(d) { return line(d.values); })
               .style("stroke", function(d) { return color(d.key); })
               .style("fill", "none");

        chart.append("g")
               .attr("class", "answer")
               .append("path")
               .datum(data)
               .attr("class", "line")
               .attr("d",  line)
               .style("stroke", "#000000")
               .style("fill", "none");

        chart.append("g")
               .attr("class", "approval")
               .append("path")
               .datum(data)
               .attr("class", "line")
               .attr("d",  approvalratio)
               .style("stroke", "#ff00ff")
               .style("fill", "none");


        xaxh=chart.append("g")
         .attr("class", "x axis")
         .attr("transform", "translate(0," + height + ")")
         .call(xAxis);
         xaxh.append("text")
             .attr("class", "label")
             .attr("x", width/2)
             .attr("y", 35)
             .style("text-anchor", "middle")
             .text("Zeit seit Umfragebeginn / Tage");
        xaxh.selectAll("path").style("stroke", "#000000")
         .style("fill", "none")
         .style("shape-rendering", "crispEdges");
        xaxh.selectAll("line").style("stroke", "#000000")
         .style("fill", "none")
         .style("shape-rendering", "crispEdges");


        yaxh=chart.append("g")
         .attr("class", "y axis")
         .call(yAxis);
         yaxh.append("text")
                 .attr("class", "label")
                 .attr("transform", "rotate(-90)")
                 .attr("x", -height/2)
                 .attr("y", -50)
                 .attr("dy", "0.71em")
                 .style("text-anchor", "middle")
                 .text("Abgegebene Stimmen");
        yaxh.selectAll("path").style("stroke", "#000000")
         .style("fill", "none")
         .style("shape-rendering", "crispEdges");
        yaxh.selectAll("line").style("stroke", "#000000")
         .style("fill", "none")
         .style("shape-rendering", "crispEdges");


        y2axh=chart.append("g")
         .attr("class", "yratio axis")
         .attr("transform", "translate(" +width + ",0)")
         .call(yratioAxis);
        y2axh.append("text")
                .attr("class", "label")
                .attr("transform", "rotate(-90)")
                .attr("x", -height/2)
                .attr("y", 35)
                .attr("dy", ".71em")
                .style("text-anchor", "middle")
                .text("Zustimmung (%)");
        y2axh.selectAll("path").style("stroke", "#000000")
         .style("fill", "none")
         .style("shape-rendering", "crispEdges");
        y2axh.selectAll("line").style("stroke", "#000000")
         .style("fill", "none")
         .style("shape-rendering", "crispEdges");

        chart.append("rect")
         .attr("class", "overlay")
         .style("fill", "none")
         .style("pointer-events","all")
         .attr("width", width)
         .attr("height", height)
         .on("mouseout", function() {  drawPieChart(data[nrVotes-1],0);  })
         .on("mousemove", mousemove);

        function mousemove() {
         var x0 = x.invert(d3.mouse(this)[0]),
         i = bisectData(data, x0, 1),
         d0 = data[i - 1],
         d1 = data[i],
         d = x0 - d0.submitdays > d1.submitdays - x0 ? d1 : d0;
         drawPieChart(d,0);
        }

         var chart = charttable.append("td").attr("Id", "piechart").attr("class", "chart").append("svg")
             .attr("width", 2*r+ margin.left)
             .attr("height", 2*r + margin.top + margin.bottom)
             .append("g")
             .attr("transform", "translate(" + width/2 + "," + height/2 + ")");

        drawPieChart(data[nrVotes-1]);
}

loghref=document.querySelector(".loglink").href;
d3.text(loghref, analyseStartDate);

tokenhref=document.querySelector(".tokenlist").href;
d3.html(tokenhref, analyseTokens);
