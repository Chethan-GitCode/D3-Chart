import { AfterViewInit, Component } from '@angular/core';
import * as d3 from 'd3';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import { HttpClient } from "@angular/common/http";




@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements AfterViewInit {

  public d3 = d3;

  optres: any = []


  popArray: any = [];





  width: number;
  height: number;
  marginn = 200;
  x: any;
  y: any;
  svg: any;
  g: any;
  popRes: any = []
  sres: any;
  populationCount: any = [];
  total: number = 0;
  popCount: any;

  constructor(private http: HttpClient) {
    this.width = 0;
    this.height = 0;

  }

  ngOnInit() {


  }
  ngAfterViewInit() {

    this.http
      .get('assets/population.csv', {
        responseType: 'text',
      })
      .subscribe(
        (response: any) => {
          let csvRowData = response.split(/[\r?\n|\r|\n]+/);
          csvRowData.forEach((rowData: any, index: number) => {
            if (index === 0) return;
            var data = rowData.split(',');
            this.popRes.push({ label: data[0], year: parseInt(data[1]), population: parseInt(data[2]), density: parseInt(data[3]), growth: parseInt(data[4]) });
            this.optres.push({ label: data[0], year: parseInt(data[1]) })

            this.populationCount.push({ label: data[0], population: parseInt(data[2]) });

            //initial year of the array
            this.popArray = this.popRes.filter((res: any) => res.year == this.popRes[0].year)

            for (let i = 0; i < this.populationCount.length; i++) {
              this.total += this.populationCount[i].population;
              //console.log("ress" + this.total)
            }
            //this.popCount =  this.numberFormat(this.total);
          });

          console.log("length" + this.popRes.length)

          this.initSvg();
          this.initAxis();
          this.drawAxis();
        },
        error => {
          console.log(error);
        });
  }

  initSvg() {

    this.svg = d3.select("svg");

    this.width = this.svg.attr("width") - this.marginn, //300
      this.height = this.svg.attr("height") - this.marginn //200
  }

  initAxis() {
    this.x = d3.scaleLinear().domain([0, 100]).range([0, this.width]);
    this.y = d3.scaleLinear().domain([0, 200]).range([this.height, 0]);


    this.x.domain([0, d3Array.max(this.popRes, (d: any) => d.density)]);
    this.y.domain([-100, d3Array.max(this.popRes, (d: any) => d.growth)]);
    this.g = this.svg.append("g")
      .attr("transform", "translate(" + 100 + "," + 100 + ")");
  }

  drawAxis() {
    this.svg.append('text')
      .attr('x', this.width / 2 + 100)
      .attr('y', 100)
      .attr('text-anchor', 'middle')
      .style('font-family', 'Helvetica')
      .style('font-size', 20)
      .text('Scatter Plot');

    // X label
    this.svg.append('text')
      .attr('x', this.width / 2 + 100)
      .attr('y', this.height - 15 + 150)
      .attr('text-anchor', 'middle')
      .style('font-family', 'Helvetica')
      .style('font-size', 12)
      .text('Population Density');

    // Y label
    this.svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'translate(60,' + this.height + ')rotate(-90)')
      .style('font-family', 'Helvetica')
      .style('font-size', 12)
      .text('Population Growth');

    // Step 6
    this.g.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(this.x));

    this.g.append("g")
      .call(d3.axisLeft(this.y));

    // Step 7
    this.svg.append('g')
      .selectAll("dot")
      .data(this.popArray)
      .enter()
      .append("circle")
      .attr('cx', (d: any) => { return this.x(d.density) })
      .attr('cy', (d: any) => { return this.y(d.growth) })
      .attr("r", 5)
      .attr("transform", "translate(" + 100 + "," + 100 + ")")
      .style("fill", "#CC0000");
  }



  changeyear(e: any) {
    this.popArray = []
    this.popArray = this.popRes.filter((res: any) => res.year == e.target.value);
    setTimeout(
      () => {
        this.initSvg();
        this.initAxis();

        this.drawAxis();
      }, 2000
    )


  }


  numberFormat(d: number) {
    for (var e = 0; d >= 1000; e++) {
      d /= 1000;
    }
    return d.toFixed(3) + ['', ' k', ' M', ' G'][e];
  }
}
