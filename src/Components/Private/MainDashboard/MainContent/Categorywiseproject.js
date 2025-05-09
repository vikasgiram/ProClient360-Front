import { Bar } from "react-chartjs-2";

export const Categorywiseproject = ({ categorywise }) => {
  // Extract category data directly from props
  const categories = Object.keys(categorywise);
  const inprocessData = categories.map(category => categorywise[category].inprocess);
  const completedData = categories.map(category => categorywise[category].completed);
  const upcomingData = categories.map(category => categorywise[category].upcoming);

  // console.log(categories,"categories", inprocessData,"inprocessData", completedData,"completedData", upcomingData,"upcomingData");
  

  const FirstCompdata = {
    labels: categories,
    datasets: [
      {
        label: 'Inprocess',
        data: inprocessData,
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

  return (
    <div className="row bg-white p-2 m-1 border">
      <div className="col-12  col-lg-6 py-1">
        <span className="text-dark py-4 heading_fontsize_first">Category wise project</span>
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
