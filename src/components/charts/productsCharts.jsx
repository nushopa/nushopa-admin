import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js/auto";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export default function ProductChart() {
  const smooth = true; // Set to true for smooth tension, false for no tension
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
        text: "Chart.js Line Chart",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Percentage (%)",
        },
      },
    },
    elements: {
      line: {
        tension: smooth ? 0.5 : 0,
      },
    },
  };

  const labels = ["2023 Q1", "2022 Q2", "2021 Q3", "2020 Q4", "2020 Q5"];

  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label: "GDP Growth",
        data: [0, 0, -3.62, -6.1, 1.87],
        backgroundColor: "rgba(249, 115, 12, .2)",
        borderColor: "rgba(249, 115, 12, 1)",
        borderWidth: 1,
        pointRadius: 3,
        pointHitRadius: 3,
        pointBorderColor: "rgba(249, 115, 12, 1)",
        pointBackgroundColor: "rgba(249, 115, 12, 1)",
      },
    ],
  };

  return <Line options={options} data={data} />;
}
