var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, NgZone } from '@angular/core';
import * as moment from 'moment';
import Chart from 'chart.js';
export var DashboardComponent = (function () {
    function DashboardComponent(zone) {
        this.zone = zone;
        this.barChart = [];
        this.lineChart = [];
    }
    DashboardComponent.prototype.ngOnInit = function () {
        // amCharts
        //this.zone.runOutsideAngular(() => {
        //     let chart = am4core.create("amchart-1", am4charts.XYChart);
        var _this = this;
        //     chart.data = [{
        //         "country": "Lithuania",
        //         "litres": 501.9,
        //         "units": 250
        //     }, {
        //         "country": "Czech Republic",
        //         "litres": 301.9,
        //         "units": 222
        //     }, {
        //         "country": "Ireland",
        //         "litres": 201.1,
        //         "units": 170
        //     }, {
        //         "country": "Germany",
        //         "litres": 165.8,
        //         "units": 122
        //     }, {
        //         "country": "Australia",
        //         "litres": 139.9,
        //         "units": 99
        //     }, {
        //         "country": "Austria",
        //         "litres": 128.3,
        //         "units": 85
        //     }, {
        //         "country": "UK",
        //         "litres": 99,
        //         "units": 93
        //     }, {
        //         "country": "Belgium",
        //         "litres": 60,
        //         "units": 50
        //     }, {
        //         "country": "The Netherlands",
        //         "litres": 50,
        //         "units": 42
        //     }];
        //     // Create axes
        //     let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        //     categoryAxis.dataFields.category = "country";
        //     categoryAxis.title.text = "Countries";
        //     let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        //     valueAxis.title.text = "Litres sold (M)";
        //     // Create series
        //     var series = chart.series.push(new am4charts.ColumnSeries());
        //     series.dataFields.valueY = "litres";
        //     series.dataFields.categoryX = "country";
        //     series.name = "Sales";
        //     series.columns.template.tooltipText = "Series: {name}\nCategory: {categoryX}\nValue: {valueY}";
        //     series.columns.template.fill = am4core.color("#104547");
        //     var series2 = chart.series.push(new am4charts.LineSeries());
        //     series2.name = "Units";
        //     series2.stroke = am4core.color("#CDA2AB");
        //     series2.strokeWidth = 3;
        //     series2.dataFields.valueY = "units";
        //     series2.dataFields.categoryX = "country";
        //     this.chart = chart;
        // });
        var el = document.getElementById('barChart');
        var ctx = el.getContext('2d');
        Chart.defaults.global.defaultFontFamily = 'Titillium Web';
        this.barChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Cisco', 'Polycom', 'Yealink', 'VTech', 'Panasonic'],
                datasets: [{
                        label: '# in Stock',
                        data: [40, 52, 62, 65, 87],
                        backgroundColor: [
                            'rgb(0,160,218, 0.2)',
                            'rgb(200,27,33, 0.2)',
                            'rgb(1,90,57, 0.2)',
                            'rgb(1,66,130, 0.2)',
                            'rgb(0,0,0, 0.2)'
                        ],
                        borderColor: [
                            'rgb(0,160,218, 1)',
                            'rgb(200,27,33, 1)',
                            'rgb(1,90,57, 1)',
                            'rgb(1,66,130, 1)',
                            'rgb(0,0,0, 1)'
                        ],
                        borderWidth: 0.5
                    }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: false,
                    position: 'top',
                    labels: {
                        boxWidth: 50,
                        fontColor: '#424242'
                    }
                },
                scales: {
                    xAxes: [{
                            ticks: {
                                maxRotation: 90,
                                minRotation: 80
                            }
                        }],
                    yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                }
            }
        });
        // // line chart
        var lineEl = document.getElementById('lineChart');
        var lineCtx = lineEl.getContext('2d');
        function hoursEarlier(hours) {
            return moment().subtract(hours, 'h').toDate();
        }
        ;
        var speedData = {
            labels: [hoursEarlier(10), hoursEarlier(9.4), hoursEarlier(8), hoursEarlier(7), hoursEarlier(6), hoursEarlier(5), hoursEarlier(4)],
            datasets: [{
                    label: "",
                    data: [0, 59, 75, 20, 20, 55, 40],
                    borderWidth: 0.6,
                    lineTension: 0.25,
                    fill: false,
                    borderColor: 'orange',
                    backgroundColor: 'transparent',
                    pointBorderColor: 'orange',
                    pointBackgroundColor: 'rgba(255,150,0,0.5)',
                    pointRadius: 3,
                    pointHoverRadius: 10,
                    pointHitRadius: 30,
                    pointBorderWidth: 1,
                    pointStyle: 'rectRounded'
                }]
        };
        var chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: false,
                position: 'top',
                labels: {
                    boxWidth: 50,
                    fontColor: '#424242'
                }
            },
            scales: {
                xAxes: [{
                        type: "time",
                        time: {
                            unit: 'hour',
                            unitStepSize: 0.6,
                            round: 'hour',
                            tooltipFormat: "h:mm:ss a",
                            displayFormats: {
                                hour: 'MMM D, h:mm A'
                            }
                        }
                    }],
                yAxes: [{
                        gridLines: {
                            color: "black"
                        },
                        scaleLabel: {
                            display: true,
                            labelString: "# Units",
                            fontColor: "green"
                        }
                    }]
            }
        };
        this.lineChart = new Chart(lineCtx, {
            type: 'line',
            data: speedData,
            options: chartOptions
        });
        //resize hack
        window.addEventListener('resize', function () {
            _this.barChart.resize();
            _this.lineChart.resize();
        });
    };
    DashboardComponent = __decorate([
        Component({
            selector: 'app-dashboard',
            templateUrl: './dashboard.template.html',
            styleUrls: ['./dashboard.component.scss']
        }), 
        __metadata('design:paramtypes', [NgZone])
    ], DashboardComponent);
    return DashboardComponent;
}());
//# sourceMappingURL=dashboard-component.js.map