"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ArcElement,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

import AgeGenderChart from "@/components/AgeGenderChart";
import LocationChart from "@/components/LocationChart";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ArcElement
);

export default function Home() {
  const [data, setData] = useState(null);
  const [sorted, setSorted] = useState(false);
  const [tableView, setTableView] = useState(false);
  const [chartType, setChartType] = useState("vertical");

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

  // Filter out the data entry with an empty "_id"
  const filteredAnswersData = data.answersData.filter(
    (item) => item._id !== ""
  );

  // Calculate the total count of all answers
  const totalAnswers = filteredAnswersData.reduce(
    (sum, item) => sum + item.count,
    0
  );

  // Filter out the answers with an empty "_id"
  const filteredAnswersDataf = data.answersData.filter((item) => item._id);

  // Sort answers data based on count if needed
  const sortedOrFilteredAnswersData = sorted
    ? [...filteredAnswersDataf].sort((a, b) => b.count - a.count)
    : filteredAnswersDataf;
  // Prepare the data for the answers chart
  const answersLabels = sortedOrFilteredAnswersData.map((item) => item._id);
  const answersData = sortedOrFilteredAnswersData.map((item) => item.count);

  const answersChartData = {
    labels: answersLabels,
    datasets: [
      {
        label: "Count",
        data: answersData,
        backgroundColor: "#44f1b6",
        // For vertical bar chart, you might want to set the bar thickness
        barThickness: chartType === "vertical" ? undefined : "flex", // 'flex' for horizontal or undefined for vertical
      },
    ],
  };

  const answersChartOptions = {
    indexAxis: chartType === "horizontal" ? "y" : "x",
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            const percentage = ((value / totalAnswers) * 100).toFixed(1);
            return `Count: ${value} (${percentage}%)`;
          },
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

  // Event handlers
  const handleSortToggle = () => setSorted(!sorted);
  const handleTableViewToggle = () => setTableView(!tableView);
  const handleChartTypeChange = (event) => {
    setChartType(event.target.value);
  };

  // Define chartOptions based on chartType
  const getChartOptions = () => {
    switch (chartType) {
      case "horizontal":
        return {
          indexAxis: "y",
          scales: {
            x: {
              beginAtZero: true,
            },
          },
          // ... other options specific to horizontal bar chart
        };
      case "vertical":
        return {
          indexAxis: "x",
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          // ... other options specific to vertical bar chart
        };
      case "pie":
        // Pie charts do not use indexAxis
        return {
          // ... other options specific to pie chart
        };
      case "spider":
        // Radar (spider) charts do not use indexAxis
        return {
          // ... other options specific to radar chart
        };
      default:
        return {};
    }
  };

  // Now we call getChartOptions to get the correct options for the current chartType
  const chartOptions = getChartOptions();

  // Render chart based on selected type
  // Render chart based on selected type
  const renderChart = () => {
    switch (chartType) {
      case "horizontal":
      case "vertical":
        return (
          <Bar key={tableView} data={answersChartData} options={chartOptions} />
        );
      case "pie":
        return (
          <Pie key={tableView} data={answersChartData} options={chartOptions} />
        );
      case "spider":
        return (
          <Radar
            key={tableView}
            data={answersChartData}
            options={chartOptions}
          />
        );
      default:
        return null;
    }
  };

  // Register the datalabels plugin
  ChartJS.register(ChartDataLabels);

  return (
    <div>
      <div>
        <AgeGenderChart data={data} />
      </div>

      <div>
        <LocationChart locationData={data} />
      </div>

      <div>
        <h2
          style={{
            textAlign: "center",
            marginTop: "20px",
            marginBottom: "20px",
            padding: "10px",
          }}
        >
          Answers
        </h2>
        <div style={{ display: "flex", justifyContent: "end", width: "98%" }}>
          <button onClick={handleSortToggle}>
            {sorted ? "Unsort" : "Sort"}
          </button>
          <button onClick={handleTableViewToggle}>
            {tableView ? "Hide Table" : "Show Table"}
          </button>
          <select onChange={handleChartTypeChange} value={chartType}>
            <option value="vertical">Vertical Bar</option>
            <option value="horizontal">Horizontal Bar</option>
            <option value="pie">Pie</option>
            <option value="spider">Spider</option>
          </select>
        </div>

        <div style={{ display: "flex", width: "100%", margin: "0 auto" }}>
          {/* Chart container */}
          <div style={{ flex: tableView ? "1 0 50%" : "1 0 100%" }}>
            {renderChart()}
          </div>

          {/* Table container, only displayed when tableView is true */}
          {tableView && (
            <div style={{ flex: "1 0 50%", padding: "20px" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: "#f2f2f2",
                      color: "#333",
                    }}
                  >
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "left",
                        borderBottom: "2px solid #ddd",
                      }}
                    >
                      Answer
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "left",
                        borderBottom: "2px solid #ddd",
                      }}
                    >
                      Response
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedOrFilteredAnswersData.map((item, index) => {
                    const percentage = (
                      (item.count / totalAnswers) *
                      100
                    ).toFixed(1);
                    return (
                      <tr
                        key={item._id}
                        style={{
                          backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9",
                        }}
                      >
                        <td
                          style={{
                            padding: "12px",
                            borderBottom: "1px solid #ddd",
                            width: "80%",
                          }}
                        >
                          {item._id || "Unknown"}
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            borderBottom: "1px solid #ddd",
                          }}
                        >
                          {item.count} ({percentage}%)
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
