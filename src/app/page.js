"use client";

import { useEffect, useState } from "react";
import axios from "axios";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:7070/api/data");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  // Prepare the data for the ageGender chart
  const ageGenderLabels = data.ageGenderData.map((item) => item._id);
  const ageGenderMaleData = data.ageGenderData.map((item) => item.male);
  const ageGenderFemaleData = data.ageGenderData.map((item) => item.female);
  const ageGenderTotalData = data.ageGenderData.map((item) => item.total);

  const ageGenderChartData = {
    labels: ageGenderLabels,
    datasets: [
      {
        label: "Male",
        data: ageGenderMaleData,
        backgroundColor: "#e3f4ee",
        stack: "gender",
      },
      {
        label: "Female",
        data: ageGenderFemaleData,
        backgroundColor: "#44f1b6",
        stack: "gender",
      },
    ],
  };

  const ageGenderChartOptions = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const dataset = context.dataset;
            const value = dataset.data[context.dataIndex];
            const total = ageGenderTotalData[context.dataIndex];
            const percentage = ((value / total) * 100).toFixed(1);
            return `${dataset.label}: ${value} (${percentage}%)`;
          },
          footer: (tooltipItems) => {
            const total = ageGenderTotalData[tooltipItems[0].dataIndex];
            return `Total: ${total}`;
          },
        },
      },
    },
  };

  // Prepare the data for the location chart
  const locationLabels = data.locationData.map((item) => item._id);
  const locationData = data.locationData.map((item) => item.count);

  const locationChartData = {
    labels: locationLabels,
    datasets: [
      {
        label: "Count",
        data: locationData,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  // Prepare the data for the answers chart
  const answersLabels = data.answersData.map((item) => item._id);
  const answersData = data.answersData.map((item) => item.count);

  const answersChartData = {
    labels: answersLabels,
    datasets: [
      {
        label: "Count",
        data: answersData,
        backgroundColor: "rgba(153, 102, 255, 0.5)",
      },
    ],
  };

  return (
    <div>
      <h1>Survey Data Visualization</h1>

      <div>
        <h2>Age and Gender </h2>
        <div style={{ display: "flex" }}>
          <div style={{ flex: 2 }}>
            <Bar data={ageGenderChartData} options={ageGenderChartOptions} />
          </div>

          <div>
            <div style={{ display: "flex" }}>
              <div
                style={{
                  flex: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  marginLeft: "20px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: "#e3f4ee",
                      marginRight: "10px",
                    }}
                  ></div>
                  <div>
                    Male:{" "}
                    {data.ageGenderData.reduce(
                      (sum, item) => sum + item.male,
                      0
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: "#44f1b6",
                      marginRight: "10px",
                    }}
                  ></div>
                  <div>
                    Female:{" "}
                    {data.ageGenderData.reduce(
                      (sum, item) => sum + item.female,
                      0
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: "#44f1b6",
                      marginRight: "10px",
                    }}
                  ></div>
                  <div>Other: 0</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2>Location </h2>
        <Bar data={locationChartData} />
      </div>
      <div>
        <h2>Answers </h2>
        <Bar data={answersChartData} />
      </div>
    </div>
  );
}
