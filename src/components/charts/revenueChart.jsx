import {
    Card,
    CardBody,
} from "@material-tailwind/react";
import { phantomGet } from "phantom-request";
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";



export default function RevenueChart() {
    const [revenueByMonth, setRevenueByMonth] = useState({})
    const { data } = phantomGet({
        route: "order/total/revenue-per-month",
    });
    useEffect(() => {
        if (data) setRevenueByMonth(data?.revenueByMonth);
    }, [data])
    const chartConfig = {
        type: "line",
        height: 300,
        series: [
            {
                name: "Sales",
                data: Object.values(revenueByMonth),
            },
        ],
        options: {
            chart: {
                toolbar: {
                    show: false,
                },
            },
            title: {
                show: "",
            },
            dataLabels: {
                enabled: false,
            },
            colors: ["#007145"],
            stroke: {
                lineCap: "round",
                curve: "smooth",
            },
            markers: {
                size: 0,
            },
            xaxis: {
                axisTicks: {
                    show: false,
                },
                axisBorder: {
                    show: false,
                },
                labels: {
                    style: {
                        colors: "#616161",
                        fontSize: "12px",
                        fontFamily: "inherit",
                        fontWeight: 400,
                    },
                },
                categories: Object.keys(revenueByMonth),
            },
            yaxis: {
                labels: {
                    style: {
                        colors: "#616161",
                        fontSize: "12px",
                        fontFamily: "inherit",
                        fontWeight: 400,
                    },
                },
            },
            grid: {
                show: true,
                borderColor: "#dddddd",
                strokeDashArray: 5,
                xaxis: {
                    lines: {
                        show: true,
                    },
                },
                padding: {
                    top: 5,
                    right: 20,
                },
            },
            fill: {
                opacity: 0.8,
            },
            tooltip: {
                theme: "dark",
            },
        },
    };
    return (
        <Card className="mt-3">

            <CardBody className="px-2 pb-0">
                <Chart {...chartConfig} />
            </CardBody>
        </Card>
    );
}