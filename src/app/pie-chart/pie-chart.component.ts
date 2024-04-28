import { Component } from '@angular/core';
import { log } from 'console';
import * as d3 from 'd3';
@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss'
})
export class PieChartComponent {
  svg: any;
  margin = 50;
 private width = 750;
 private height = 600;
  data = [
   {"Continent": "Africa", "count": "999700406794", "percentage":"39%"},
   {"Continent": "Asia", "count": "356304789172", "percentage":"12%"},
   {"Continent": "Europe", "count": "567694672011","percentage":"19%"},
   {"Continent": "North-America", "count": "457363337501", "percentage":"13%"},
   {"Continent": "oceania", "count": "320381210816", "percentage":"9%"},
   {"Continent": "Soth-America", "count": "321666503057","percentage":"8%" }, 
 ];
 // The radius of the pie chart is half the smallest side
 private radius = Math.min(this.width, this.height) / 2 - this.margin;
 private colors : any;
 sectionColors: any = [
  '#78c0a8', 
  '#ffb07c', 
  '#b0a8b9', 
  '#d9b44a',
  '#6a737b',
  '#61a5c2',
  '#96c7d9',
  '#4998ab',
  '#88c4d5',
  '#206a8e' 
  ]
 constructor() { }
 ngOnInit(): void {
   this.createSvg();
   //d3.csv("/assets/frameworks.csv").then(data => this.data);
   console.log("check", this.data);
   
   this.createColors();
   this.drawChart();
}
 private createSvg(): void {
   this.svg = d3.select("figure#pie")
   .append("svg")
   .attr("width", this.width)
   .attr("height", this.height)
   .append("g")
   .attr(
     "transform",
     "translate(" + this.width / 2 + "," + this.height / 2 + ")"
   );
   }

   private createColors(): void {
     this.colors = d3.scaleOrdinal()
     .domain(this.data.map(d => d.count.toString()))
     .range(["#78c0a8", '#ffb07c',
     '#b0a8b9', 
     '#d9b44a', 
     '#6a737b', 
     '#61a5c2', 
     '#96c7d9',]);
   }  
 private drawChart(): void {
   // Compute the position of each group on the pie:
   const pie = d3.pie<any>().value((d: any) => Number(d.count));
 
   // Build the pie chart
   this.svg
   .selectAll('pieces')
   .data(pie(this.data))
   .enter()
   .append('path')
   .attr('d', d3.arc()
     .innerRadius(0)
     .outerRadius(this.radius)
   )
   .attr('fill', (d: any, i: any) => (this.colors(i)))
   .attr("stroke", "#121926")
   .style("stroke-width", "1px");
 
   // Add labels
   const labelLocation = d3.arc()
   .innerRadius(100)
   .outerRadius(this.radius);
 
   this.svg
   .selectAll('pieces')
   .data(pie(this.data))
   .enter()
   .append('text')
   .text((d: any)=> d.data.Continent + " - " + d.data.percentage)
   .attr("transform", (d: any) => "translate(" + labelLocation.centroid(d) + ")")
   .style("text-anchor", "middle")
   .style("font-size", 15);
 }

}
