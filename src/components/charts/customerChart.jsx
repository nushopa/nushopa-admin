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
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

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

export default function CustomerChart() {
  const [customerCountByMonth, setCustomerCountByMonth] = useState({})
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}customer/customer-per-month`)
      .then((response) => {
        if (response.data) {
          setCustomerCountByMonth(response?.data?.customerCountByMonth);
        }
      })
      .catch(() => {
        toast.error("Error fetching customers");
      })

  }, []);
  const smooth = true; // Set to true for smooth tension, false for no tension
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },

    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Customers",
        },
      },
    },
    elements: {
      line: {
        tension: smooth ? 0.5 : 0,
      },
    },
  };
  const labels = Object.keys(customerCountByMonth);
  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label: "Customers",
        data: Object.values(customerCountByMonth),
        backgroundColor: "#fff",
        borderColor: "rgba(0, 113, 69, 1)",
        borderWidth: 1,
        pointRadius: 3,
        pointHitRadius: 3,
        pointBorderColor: "rgba(0, 113, 69, 1)",
        pointBackgroundColor: "rgba(0, 113, 69, 1)",
      },
    ],
  };

  return <Line options={options} data={data} className="w-full bg-white shadow-md rounded-md mt-2 p-3" />;
}
