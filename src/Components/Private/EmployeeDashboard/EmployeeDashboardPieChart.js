import Chart from "react-google-charts"

export const CompanyInfEmployeeDashboardPieChartoPieChart = ({completedProjectCount,inproccessProjectCount}) => {

  const data = [
    ["Projects", "Hours per Day"],
    ["Finish", completedProjectCount],
    ["Inprocess", inproccessProjectCount ],
  ];

  const options = {
    pieSliceText: "label",
    is3D: true,
    pieSliceText: 'percentage',
    chartArea: {
      height: "100%",
      width: "100%",
      backgroundColor: {
        opacity: 0

        
      },
    },
    slices: { 0: { color: '#80C783' }, 1: { color: '#ebc682' }} //56AFFE


  };


  return (
    <>
      <div className="col-12 col-lg-4 p-2 mx-auto" >
        <Chart
          chartType="PieChart"
          data={data}
          options={options}
          width={"100%"}
        />
      </div>

    </>
  )
}