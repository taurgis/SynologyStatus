define(["vendor/Chart.min"], function() {
  var Graphs = ({
     graphItems: {
        cpuChart : "",
        memoryChart : "",
        diskChart: ""
     },
    init: function(sysData) {
      this.graphItems.cpuChart = this.createGraph("cpuChart", sysData.data.result[1].data.cpu.other_load + sysData.data.result[1].data.cpu.system_load + sysData.data.result[1].data.cpu.user_load);
      this.graphItems.memoryChart = this.createGraph("memoryChart", sysData.data.result[1].data.memory.real_usage);
      this.graphItems.diskChart = this.createGraph("diskChart", sysData.data.result[1].data.disk.total.utilization);
    },
    update: function(sysData) {
      this.updateData(this.graphItems.cpuChart, sysData.data.result[1].data.cpu.other_load + sysData.data.result[1].data.cpu.system_load + sysData.data.result[1].data.cpu.user_load);
      this.updateData(this.graphItems.memoryChart, sysData.data.result[1].data.memory.real_usage);
      this.updateData(this.graphItems.diskChart, sysData.data.result[1].data.disk.total.utilization);
    },
    createGraph: function(elementId, percentage) {
      var chart = new Chart(document.getElementById(elementId).getContext("2d")).Doughnut(this.loadData(percentage));
      this.setGraphText($('#' + elementId), percentage);
      return chart;
    },
    loadData: function(percentage) {
        return [
          {
              value: percentage,
              color:"#F7464A",
                      highlight: "#FF5A5E",
              label: "Used"
          },
          {
              value: 100 - percentage,
              color: "#eee",
              highlight: "#eee",
              label: "Unused"
          }
      ];
    },
    updateData: function(chart, percentage) {
      this.setGraphText(chart.chart.canvas, percentage);
      chart.segments[0].value= percentage;
      chart.segments[1].value=100-percentage;
      chart.update();
    },
    setGraphText: function(chart, percentage) {
      $(chart).siblings('.percentage-text').text(percentage + "%");
    }
  });

  return Graphs;
});
