import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.css'
})
export class LineChartComponent implements OnInit {
  @ViewChild('chart', { static: true }) private chartContainer!: ElementRef;

  private margin = { top: 20, right: 30, bottom: 30, left: 50 };
  private width = 500 - this.margin.left - this.margin.right;
  private height = 300 - this.margin.top - this.margin.bottom;

  private data = [
    { x: 50, y: 50 },   // Starting point
    { x: 400, y: 200 }  // Ending point
  ];

  constructor() { }

  ngOnInit(): void {
    this.createSimpleLine();
  }

  private createSimpleLine(): void {
    const element = this.chartContainer.nativeElement;

    // Set up the SVG container
    const svg = d3.select(element)
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom + 40)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    // Define the scales for the x and y axes
    const xScale = d3.scaleLinear()
      .domain([0, 500])  // Input domain
      .range([0, this.width]); // Output range (chart width)



    const yScale = d3.scaleLinear()
      .domain([0, 300])  // Input domain
      .range([this.height, 0]); // Output range (chart height)



    // Major ticks on X and Y axes
    const majorXTicks = [0, 100, 200, 300, 400, 500];
    const majorYTicks = [0, 100, 200, 300];




    // Interpolated ticks: custom generation of minor ticks   
    const minorXTicks = [20, 40, 60, 80, 120, 140, 160, 180, 220, 240, 260, 280, 320, 340, 360, 380, 420, 440, 460, 480];
    const minorYTicks: number[] = [20, 40, 60, 80, 120, 140, 160, 180, 220, 240, 260, 280];



    // Add major X-axis grid lines
    svg.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${this.height})`)
      .call(d3.axisBottom(xScale)
        .tickValues(majorXTicks)  // Use the specific tick values for the X-axis
        .tickSize(-this.height)
        .tickFormat('' as any)  // No tick labels for grid lines
      );

    // Add major Y-axis grid lines
    svg.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(yScale)
        .tickValues(majorYTicks)  // Use the specific tick values for the Y-axis
        .tickSize(-this.width)
        .tickFormat('' as any)  // No tick labels for grid lines
      );

    // Add interpolated X-axis grid lines (minor ticks)
    svg.selectAll('.x-minor-grid')
      .data(minorXTicks)
      .enter()
      .append('line')
      .attr('class', 'x-minor-grid')
      .attr('x1', (d: any) => xScale(d))
      .attr('x2', (d: any) => xScale(d))
      .attr('y1', 0)
      .attr('y2', this.height)
      .attr('stroke', 'gray')
      .attr('stroke-opacity', 0.5)
      ; // Dashed minor grid lines

    // Add interpolated Y-axis grid lines (minor ticks)
    svg.selectAll('.y-minor-grid')
      .data(minorYTicks)
      .enter()
      .append('line')
      .attr('class', 'y-minor-grid')
      .attr('y1', (d: any) => yScale(d))
      .attr('y2', (d: any) => yScale(d))
      .attr('x1', 0)
      .attr('x2', this.width)
      .attr('stroke', 'gray')
      .attr('stroke-opacity', 0.5)
      ; // Dashed minor grid lines



    // Add x-axis to the SVG
    svg.append('g')
      .attr('transform', `translate(0,${this.height})`)
      .call(d3.axisBottom(xScale)
        .tickValues(majorXTicks)  // Set the ticks to only match majorXTicks
        .tickFormat(d3.format('d')));  // Use 'd' format for integer labels


    // Add 2 x-axis to the SVG 
    const xScale2 = d3.scaleLinear()
      .domain([0, 50])  // Input domain
      .range([0, this.width]); // Output range (chart width)

    svg.append('g')
      .attr('transform', `translate(0,${this.height + 40})`)
      .call(d3.axisBottom(xScale2)
        .tickValues([0, 10, 20, 30, 40, 50])  // Set the ticks to only match majorXTicks
        .tickFormat(d3.format('d')));  // Use 'd' format for integer labels


    // Add y-axis to the SVG
    svg.append('g')
      .call(d3.axisLeft(yScale)
        .tickValues(majorYTicks)  // Set the ticks to only match majorXTicks
        .tickFormat(d3.format('d')));  // Use 'd' format for integer labels

    // Draw the line
    svg.append('line')
      .attr('x1', this.data[0].x)
      .attr('y1', this.data[0].y)
      .attr('x2', this.data[1].x)
      .attr('y2', this.data[1].y)
      .attr('class', 'line')
      .attr('stroke', 'red')
      .attr('stroke-width', 3);



    // Draw the line 2 
    svg.append('line')
      .attr('x1', 50)
      .attr('y1', 30)
      .attr('x2', 400)
      .attr('y2', 180)
      .attr('class', 'line')
      .attr('stroke', 'red')
      .attr('stroke-width', 3);


    // Create tooltip
    const tooltip = d3.select(element)
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    // Add mouse events for tooltip
    svg.selectAll('.line')
      .on('mouseover', () => tooltip.style('opacity', 1))
      .on('mousemove', (event: MouseEvent) => {
        const [xValue, yValue] = d3.pointer(event);
        const x = Math.round(xScale.invert(xValue - this.margin.left)); // Invert the x scale to get the x value
        const y = Math.round(yScale.invert(this.height - (yValue - this.margin.top))); // Invert the y scale to get the y value

        tooltip.html(`X: ${x}, Y: ${y}`)
          .style('left', (event.pageX + 5) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', () => tooltip.style('opacity', 0));
  }

}