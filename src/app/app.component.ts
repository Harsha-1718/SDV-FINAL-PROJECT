import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { read, utils } from "xlsx";
import * as d3 from "d3";
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { PieChartComponent } from "./pie-chart/pie-chart.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [CommonModule, RouterOutlet, PieChartComponent]
})
export class AppComponent {
  title = 'Viz';
  file: any;
  arrayBuffer: any = [];
  uploadEvent: any;
  exceljsondata: any = [];
  youngAge: any = 0;
  middleAge: any = 0;
  oldAge: any = 0;
  childAge: any = 0;
  gaugemap: any = {
    configure: null,
    isRendered: null,
    update: null,
    render: null
  };
  averageSleepingEfficieny: any = 0;
  clicked: boolean = true;
  age6: any = 0;
  age5: any = 0;
  age4: any = 0;
  age2: any = 0;
  age3: any = 0;
  age1: any = 0;
  age: any = 0;
  avgSleepDuration: any = 0; 
  showpiechart: boolean = true;
  showguagechart: boolean = false;
  showSpinner: boolean = false;
  constructor(private spinner: NgxSpinnerService) { }
  ngOnInit() {
    this.draw();
  }
  check(event: any) {
    this.uploadedFile(event);
    this.showSpinner = true
    this.spinner.show()
    setTimeout(() => {
      this.spinner.show()
       console.log("Loaded", this.exceljsondata)
      this.showguagechart = true;
      this.showSpinner = true
     
     }, 2000)
     this.showSpinner = false
    console.log("check", this.exceljsondata);
    //setTimeout(() => { this.calculations() }, 2000)\
    this.showSpinner = false
  }
  //extracting data from the excel
  uploadedFile(event: any) {
    if (event.target.files.length > 0) {
      console.log(event.target.files);
      this.file = event.target.files[0];
      this.uploadEvent = event;
    }
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      console.log("data", data);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i)
        arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = read(bstr, {
        type: "binary"
      });
  
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      
      this.exceljsondata = utils.sheet_to_json(worksheet, {
        raw: true,
        defval: "",
      });
    };
    fileReader.readAsArrayBuffer(this.file);
    console.log("Entered please wait until Data is loaded", this.exceljsondata);
  }
  clickPiechart(){
    this.showpiechart = true;
    this.showguagechart = false;
  }
  draw() {
    var self = this;
    var gauge = function (container: any, configuration: any) {

      var config = {
        size: 710,
        clipWidth: 1000,
        clipHeight: 400,
        ringInset: 60,
        ringWidth: 60,

        pointerWidth: 10,
        pointerTailLength: 5,
        pointerHeadLengthPercent: 0.9,

        minValue: 0,
        maxValue: 100,

        minAngle: -90,
        maxAngle: 90,

        transitionMs: 750,

        majorTicks: 5,
        labelFormat: d3.format('d'),
        labelInset: 10,
        prop: undefined,
        arcColorFn: d3.interpolateHsl(d3.rgb('#df17ab'), d3.rgb('#3c0a6c'))
      };
      var range: any = undefined;
      var r: any = undefined;
      var pointerHeadLength: any = undefined;
      var value = 0;

      var svg: any = undefined;
      var arc: any = undefined;
      var scale: any = undefined;
      var ticks: any = undefined;
      var tickData: any = undefined;
      var pointer: any = undefined;

      var donut = d3.pie();

      function deg2rad(deg: any) {
        return deg * Math.PI / 180;
      }

      function newAngle(d: any) {
        var ratio = scale(d);
        var newAngle = config.minAngle + (ratio * range);
        return newAngle;
      }

      function configure(configuration: any) {
        var prop = undefined;
        for (prop in configuration) {
          //config[prop] = configuration[prop];
        }

        range = config.maxAngle - config.minAngle;
        r = config.size / 2;
        pointerHeadLength = Math.round(r * config.pointerHeadLengthPercent);

        // a linear scale this.gaugemap maps domain values to a percent from 0..1
        scale = d3.scaleLinear()
          .range([0, 1])
          .domain([config.minValue, config.maxValue]);

        ticks = scale.ticks(config.majorTicks);
        tickData = d3.range(config.majorTicks).map(function () { return 1 / config.majorTicks; });

        arc = d3.arc()
          .innerRadius(r - config.ringWidth - config.ringInset)
          .outerRadius(r - config.ringInset)
          .startAngle(function (d: any, i) {
            var ratio = d * i;
            return deg2rad(config.minAngle + (ratio * range));
          })
          .endAngle(function (d: any, i) {
            var ratio = d * (i + 1);
            return deg2rad(config.minAngle + (ratio * range));
          });
      }
      self.gaugemap.configure = configure;

      function centerTranslation() {
        return 'translate(' + r + ',' + r + ')';
      }

      function isRendered() {
        return (svg !== undefined);
      }
      self.gaugemap.isRendered = isRendered;

      function render(newValue: any) {
        svg = d3.select(container)
          .append('svg:svg')
          .attr('class', 'gauge')
          .attr('width', config.clipWidth)
          .attr('height', config.clipHeight);

        var centerTx = centerTranslation();

        var arcs = svg.append('g')
          .attr('class', 'arc')
          .attr('transform', centerTx);

        arcs.selectAll('path')
          .data(tickData)
          .enter().append('path')
          .attr('fill', function (d: any, i: number) {
            return config.arcColorFn(d * i);
          })
          .attr('d', arc);

        var lg = svg.append('g')
          .attr('class', 'label')
          .attr('transform', centerTx);
        lg.selectAll('text')
          .data(ticks)
          .enter().append('text')
          .attr('transform', function (d: any) {
            var ratio = scale(d);
            var newAngle = config.minAngle + (ratio * range);
            return 'rotate(' + newAngle + ') translate(0,' + (config.labelInset - r) + ')';
          })
          .text(config.labelFormat);

        var lineData = [[config.pointerWidth / 2, 0],
        [0, -pointerHeadLength],
        [-(config.pointerWidth / 2), 0],
        [0, config.pointerTailLength],
        [config.pointerWidth / 2, 0]];
        var pointerLine = d3.line().curve(d3.curveLinear)
        var pg = svg.append('g').data([lineData])
          .attr('class', 'pointer')
          .attr('transform', centerTx);

        pointer = pg.append('path')
          .attr('d', pointerLine)
          .attr('transform', 'rotate(' + config.minAngle + ')');

        update(newValue === undefined ? 0 : newValue);
      }
      self.gaugemap.render = render;
      function update(newValue: any, newConfiguration?: any) {
        if (newConfiguration !== undefined) {
          configure(newConfiguration);
        }
        var ratio = scale(newValue);
        var newAngle = 50
        console.log("newAngle",newAngle)
        pointer.transition()
          .duration(config.transitionMs)
          .ease(d3.easeElastic)
          .attr('transform', 'rotate(' + newAngle + ')');
      }
      self.gaugemap.update = update;

      configure(configuration);

      return self.gaugemap;
    };

    var powerGauge = gauge('#power-gauge', { 
      size: 300,
      clipWidth: 300,
      clipHeight: 300,
      ringWidth: 60,
      maxValue: 10, 
      transitionMs: 4000,
    });
    powerGauge.render();

  }
openURL(url:any){
  window.open(url, '_blank');
}

}
