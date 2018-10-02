import { Component, OnInit, ViewChild } from '@angular/core';

import * as moment from 'moment'
import Chart from 'chart.js';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.template.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    barChart: any = [];
    lineChart: any = [];

    constructor() { }

    ngOnInit(): void {
        const el = <HTMLCanvasElement>document.getElementById('barChart');
        const ctx = el.getContext('2d');

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

        // line chart
        const lineEl = <HTMLCanvasElement>document.getElementById('lineChart');
        const lineCtx = lineEl.getContext('2d');

        function hoursEarlier(hours) {
            return moment().subtract(hours, 'h').toDate();
        };

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
        window.addEventListener('resize', () => {
             this.barChart.resize();
             this.lineChart.resize();
        })
    }
}