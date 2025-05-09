import { Chart } from "chart.js";
import { Bar } from "react-chartjs-2";
import { useState, useEffect } from "react";

// Customize chart legend (if needed)
Chart.Legend.prototype.afterFit = function () {
  this.height = this.height + 40;
};


export const Valuewiseproject = ({valueWise}) => {
  
const rangeData=valueWise.map((data) => data.range);
const inProcessData=valueWise.map((data) => data.inprocess);
const completedData=valueWise.map((data) => data.completed);
const upcomingData=valueWise.map((data) => data.upcoming);

// console.log("rangeData",rangeData,"inProcess", inProcessData, "completed",completedData,"upcoming", upcomingData);

  const FirstCompdata = {
    labels: rangeData,
    datasets: [
      {
        label: 'Inprocess',
        data: inProcessData,
        fill: true,
        backgroundColor: '#4791FF',
      },
      {
        label: 'Completed',
        data: completedData,
        fill: true,
        backgroundColor: '#02BC77',
      },
      {
        label: 'Upcoming',
        data: upcomingData,
        fill: true,
        backgroundColor: '#FF9123',
      },
    ],
  };

  const FirstCompBar = {
    responsive: true,
    maintainAspectRatio: true,
    layout: {
        padding: {
            top: 15,
            bottom: 0,
        },
    },
    legend: {
        display: true,
        position: 'top',
        align: 'start',
    },
    plugins: {
        datalabels: {
            anchor: 'end',
            align: 'end',
            rotation: -90,
            color: 'black',
        },
    },
    scales: {
        xAxes: [{
            stacked: false,
            gridLines: {
                drawOnChartArea: false,
                color: '#1b4b7b',
            },
            barThickness: 25,
            barPercentage: 9.0,
            categoryPercentage: 9.0,
            ticks: {
                autoSkip: false,
                fontSize: '13',
                fontColor: '#1b4b7b',
                // maxRotation: 90,
                // minRotation: 90,
            }
        }],
        yAxes: [{
          stacked: false,
          gridLines: {
              drawOnChartArea: false,
              color: '#1b4b7b',
          },
          ticks: {
              beginAtZero: true,
              fontSize: '12',
              fontColor: '#1b4b7b',
              callback: function(value) {
                  return Number.isInteger(value) ? value : ''; // Show only integer values
              }
          }
      }]
    }
};

  // Render the component
  return (
    <div className="row bg-white p-2 m-1 border">
      <div className="col-12 col-lg-8 py-1">
        <span className="text-dark py-4 heading_fontsize_first">Value wise project</span>
      </div>
      <div className="col-12 col-lg-12 p-2 mx-auto" style={{ overflowX: 'auto' }}>
        <Bar
          options={FirstCompBar}
          data={FirstCompdata}
          height={'65px'}
        />
      </div>
    </div>
  );
};