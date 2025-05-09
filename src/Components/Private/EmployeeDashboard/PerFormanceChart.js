import { useState } from "react";
import Chart from "react-google-charts"




export const PerFormanceChart = () => {


    const [isYearView, setIsYearView] = useState(false);

    const monthlyData = [
        ["Month", "Performance"],
        ["Jan", 0],
        ["Feb", 70],
        ["Mar", 60],
        ["April", 100],
        ["May", 90],
        ["Jun", 30],
        ["Jul", 50],
        ["Aug", 65],
        ["Sep", 35],
        ["Oct", 55],
        ["Nov", 100],
        ["Dec", 95],
    ];

    const yearlyData = [
        ["Year", "Performance"],
        ["2015", 0],
        ["2016", 10],
        ["2017", 60],
        ["2018", 40],
        ["2019", 33],
        ["2020", 60],
        ["2021", 70],
        ["2022", 20],
        ["2023", 99]
    ];

    const data = isYearView ? yearlyData : monthlyData;

    const options = {
        isStacked: true,
        height: 300,
        legend: { position: "top", maxLines: 3 },
        vAxis: { minValue: 0 },
    };


    return (
        <>

            <div className="row m-2">
                <div className="col-12 col-lg-12 bg-white rounded" >
                    <div className="row py-3">
                        <div className="col-md-6 mx-auto pt-4 ps-lg-5">
                            <h5>Performance</h5>
                        </div>

                        <div className="col-md-5  text-lg-start pt-4 ps-lg-5">


                            <label className="toggler-wrapper style-22">
                                <input type="checkbox"
                                    checked={isYearView}
                                    onChange={() => setIsYearView(!isYearView)}

                                />
                                <div className="toggler-slider" >
                                    <div className="toggler-knob"></div>

                                </div>
                                <span className="ms-5 fw-bold"> {isYearView ? "Yearly" : " Monthly"}</span>
                            </label>

                        </div>
                    </div>
                    <Chart
                        chartType="AreaChart"
                        width="100%"
                        data={data}
                        options={options}
                    />
                </div>
            </div>

        </>
    )
}