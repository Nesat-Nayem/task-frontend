import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

export default function LocationChart({ locationData }) {
  // Calculate the total count for all locations to display percentages
  const locationLabels = locationData.locationData.map((item) => item._id);
  const locationCounts = locationData.locationData.map((item) => item.count);
  const locationTotal = locationCounts.reduce((sum, count) => sum + count, 0);

  const locationChartData = {
    labels: locationLabels,
    datasets: [
      {
        label: "Amount",
        data: locationCounts,
        backgroundColor: "#44f1b6",
        barThickness: 50,
        datalabels: {
          color: "black",
          anchor: "end",
          align: "end",
          formatter: (value, context) => {
            const percentage = ((value / locationTotal) * 100).toFixed(1);
            return `${percentage}%`;
          },
        },
      },
    ],
  };

  const locationChartOptions = {
    indexAxis: "y",
    responsive: true,
    scales: {
      y: {
        ticks: {
          callback: function (value) {
            return this.getLabelForValue(value);
          },
        },
      },
      x: {
        ticks: {
          display: false,
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (context) => context[0].label,
          label: (context) => {
            const value = context.parsed.x;
            const percentage = ((value / locationTotal) * 100).toFixed(1);
            return `Amount: ${value} (${percentage}%)`;
          },
          footer: () => `Total: ${locationTotal}`,
        },
      },
      legend: {
        display: false,
      },
      datalabels: {
        font: {
          weight: "bold",
        },
      },
    },
  };

  return (
    <div>
      <h2
        style={{
          textAlign: "center",
          marginTop: "20px",
          marginBottom: "20px",
          padding: "10px",
        }}
      >
        Locations
      </h2>
      <div style={{ width: "95%", margin: "0 auto" }}>
        <Bar data={locationChartData} options={locationChartOptions} />
      </div>
    </div>
  );
}
