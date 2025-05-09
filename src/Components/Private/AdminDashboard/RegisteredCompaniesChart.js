import { useState, useEffect } from "react";
import Chart from "react-google-charts";

export const RegisteredCompaniesChart = ({ companiesByMonth, companiesByYear }) => {
    const [isYearView, setIsYearView] = useState(false);
    const [monthlyData, setMonthlyData] = useState([["Month", "Joined"]]);
    const [yearlyData, setYearlyData] = useState([["Year", "Joined"]]);

    useEffect(() => {
        const currentMonth = new Date().getMonth(); // Get the current month (0-11)
        const data = Array(12).fill(0); // Initialize array for 12 months

        // Populate the data array with counts from companiesByMonth
        companiesByMonth.forEach(entry => {
            const monthIndex = entry._id - 1; // Assuming _id is 1-based for January
            if (monthIndex >= 0 && monthIndex <= currentMonth) {
                data[monthIndex] = entry.count; // Set the count for the month
            }
        });

        // Prepare the monthly data array up to the current month
        const formattedMonthlyData = [
            ["Month", "Joined"],
            ["Jan", data[0]],
            ["Feb", data[1]],
            ["Mar", data[2]],
            ["Apr", data[3]],
            ["May", data[4]],
            ["Jun", data[5]],
            ["Jul", data[6]],
            ["Aug", data[7]],
            ["Sep", data[8]],
            ["Oct", data[9]],
            ["Nov", data[10]],
            ["Dec", data[11]],
        ].slice(0, currentMonth + 2); // Slice to include only up to the current month

        setMonthlyData(formattedMonthlyData);
    }, [companiesByMonth]); // Update when companiesByMonth changes

    useEffect(() => {
        const currentYear = new Date().getFullYear(); // Get the current year
        const formattedYearlyData = [["Year", "Joined"]];
        
        // Initialize yearly data with 0 counts for each year from 2023 to currentYear
        for (let year = 2023; year <= currentYear; year++) {
            const count = companiesByYear.find(entry => entry._id === year)?.count || 0; // Get count or default to 0
            formattedYearlyData.push([year.toString(), count]);
        }

        setYearlyData(formattedYearlyData);
    }, [companiesByYear]); // Update when companiesByYear changes

    const data = isYearView ? yearlyData : monthlyData;

    const options = {
        isStacked: true,
        height: 300,
        legend: { position: "top", maxLines: 3 },
        vAxis: { minValue: 0 },
        hAxis: {
            title: 'Year',
            format: '####', // Ensure the year format is correct
        },
        series: {
            0: { lineWidth: 2 }, // Customize line width if needed
        },
    };

    return (
        <>
            <div className="row m-2">
                <div className="col-12 col-lg-12 bg-white rounded">
                    <div className="row py-3">
                        <div className="col-md-6 mx-auto pt-4 ps-lg-5">
                            <h5>Companies Joined</h5>
                        </div>
                        <div className="col-md-5 text-lg-start pt-4 ps-lg-5">
                            <label className="toggler-wrapper style-22">
                                <input
                                    type="checkbox"
                                    checked={isYearView}
                                    onChange={() => setIsYearView(!isYearView)}
                                />
                                <div className="toggler-slider">
                                    <div className="toggler-knob"></div>
                                </div>
                                <span className="ms-5 fw-bold">{isYearView ? "Yearly" : "Monthly"}</span>
                            </label>
                        </div>
                    </div>
                    <Chart
                        chartType="AreaChart"
                        width="100%"
                        height="300px"
                        data={data}
                        options={options}
                    />
                </div>
            </div>
        </>
    );
};