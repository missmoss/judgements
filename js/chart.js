d3.csv("data/update3.csv")
.then(function(data) {

  var parseDate = d3.timeParse("%Y-%m-%d");

  data.forEach(function(d) {
    d.jdate = parseDate(d.jdate);
    d.year = d.jdate.getYear();
    d.id = d.id;
    d.sys = d.sys;
    d.type = d.type;
    d.defendant = d.defendant;
    d.plaintiff = d.plaintiff;
    d.reason = d.reason;
    d.no = d.no;
    d.laws = d.laws;
    d.arguements = d.arguements;
    d.fee = d.fee;
    d.judge = d.judge;
    d.topics = d.topics;
  })

  // registration: charts in this page
  var selectMulti = dc.selectMenu("#select"),
  sysPie = dc.pieChart("#sys-pie"),
  typePie = dc.pieChart("#type-pie"),
  textFilter = dc.textFilterWidget("#search"),
  textTable = dc.dataTable('.dc-data-grid'),
  defRow = dc.rowChart("#def-row"),
  pltRow = dc.rowChart("#plt-row"),
  rsRow = dc.rowChart("#rs-row");

  var ndx = crossfilter(data),
  courtDimension = ndx.dimension(function(d) { return d.court; }),
  sysDimension = ndx.dimension(function(d) { return d.sys; }),
  typeDimension = ndx.dimension(function(d) { return d.type; }),
  nameDimension = ndx.dimension(function(d) { return d.defendant + d.plaintiff; }),
  defDimension = ndx.dimension(function(d) { return d.defendant; }),
  pltDimension = ndx.dimension(function(d) { return d.plaintiff; }),
  rsDimension = ndx.dimension(function(d) { return d.reason; }),
  sysGroup = sysDimension.group().reduceCount(),
  typeGroup = typeDimension.group().reduceCount(),
  defRawGroup = defDimension.group().reduceCount(),
  pltRawGroup = pltDimension.group().reduceCount();
  rsRawGroup = rsDimension.group().reduceCount();

  function getTops(source_group) {
    return {
      all: function () {
        var result = source_group.top(25).slice(0),
        output = [];
        result.forEach(function(d) {
          if(d.key !== "" & !d.key.includes("○○")) {
            output.push(d);
          }
        });
        return output;
      }
    };
  }
  var defGroup = getTops(defRawGroup),
  pltGroup = getTops(pltRawGroup),
  rsGroup = getTops(rsRawGroup);


  selectMulti
  .dimension(courtDimension)
  .group(courtDimension.group().reduceCount())
  .multiple(true)
  .numberVisible(10)
  .controlsUseVisibility(true);

  sysPie
  .slicesCap(4)
  .innerRadius(30)
  .dimension(sysDimension)
  .group(sysGroup)
  .legend(dc.legend())
  .on('pretransition', function(chart) {
    chart.selectAll('text.pie-slice').text(function(d) {
      return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
    })
  });

  typePie
  .slicesCap(4)
  .innerRadius(30)
  .dimension(typeDimension)
  .group(typeDimension.group())
  .legend(dc.legend())
  .on('pretransition', function(chart) {
    chart.selectAll('text.pie-slice').text(function(d) {
      return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
    })
  });

  textFilter
  .dimension(nameDimension);

  defRow
  .width(768)
  .height(480)
  .elasticX(true)
  .dimension(defDimension)
  .group(defGroup)
  .cap(10);

  pltRow
  .width(768)
  .height(480)
  .elasticX(true)
  .dimension(pltDimension)
  .group(pltGroup)
  .cap(10);

  rsRow
  .width(768)
  .height(480)
  .elasticX(true)
  .dimension(rsDimension)
  .group(rsGroup)
  .cap(10);

  textTable
  .dimension(nameDimension)
  .showSections(false)
  .columns([
    function (d) {
      return d.no;
    },
    function (d) {
      return d.reason;
    },
    function (d) {
      return d.plaintiff;
    },
    function (d) {
      return d.defendant;
    },
    function (d) {
      return d.judge;
    },
    function (d) {
      return d.fee;
    },
    function (d) {
      return d.arguements;
    },
    function (d) {
      return d.topics;
    }]);


    dc.renderAll();
    // end of dc.js
  });
