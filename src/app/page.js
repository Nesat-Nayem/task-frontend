"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie, Radar, Doughnut, PolarArea } from "react-chartjs-2";
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

        parsing: {
          key: "count",
        },
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
            const label = context.label;
            const value = context.raw;
            const percentage = ((value / totalAnswers) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
      legend: {
        display: chartType === "pie",
        position: "bottom",
      },

      datalabels: {
        font: {
          weight: "bold",
        },
        formatter: (value, context) => {
          const percentage = ((value / totalAnswers) * 100).toFixed(1);
          return `${percentage}%`;
        },
        color: "#000",
        anchor: (context) => {
          const chartType = context.chart.config.type;
          if (chartType === "bar") {
            return context.dataset.indexAxis === "y" ? "end" : "end";
          } else if (chartType === "pie") {
            return "end";
          }
        },
        align: (context) => {
          const chartType = context.chart.config.type;
          if (chartType === "bar") {
            return context.dataset.indexAxis === "y" ? "end" : "end";
          } else if (chartType === "pie") {
            return "center";
          }
        },
        offset: (context) => {
          const chartType = context.chart.config.type;
          if (chartType === "pie") {
            return 20;
          }
        },
        display: (context) => {
          const chartType = context.chart.config.type;
          return chartType !== "radar";
        },
      },
    },
  };

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

      case "polarArea":
        return {
          // ... options specific to polar area chart
          scale: {
            ticks: {
              beginAtZero: true,
            },
          },
        };

      default:
        return {};
    }
  };

  // Now we call getChartOptions to get the correct options for the current chartType
  const chartOptions = getChartOptions();

  // Render chart based on selected type
  const renderChart = () => {
    switch (chartType) {
      case "horizontal":
      case "vertical":
        return (
          <Bar
            key={tableView}
            data={answersChartData}
            options={{ ...chartOptions, ...answersChartOptions }}
          />
        );
      case "pie":
        return (
          <Pie
            key={tableView}
            data={answersChartData}
            options={{ ...chartOptions, ...answersChartOptions }}
          />
        );
      case "spider":
        return (
          <Radar
            key={tableView}
            data={answersChartData}
            options={{ ...chartOptions, ...answersChartOptions }}
          />
        );
      case "doughnut":
        return (
          <Doughnut
            key={tableView}
            data={answersChartData}
            options={answersChartOptions}
          />
        );

      case "polarArea":
        return (
          <PolarArea
            key={tableView}
            data={answersChartData}
            options={{ ...chartOptions, ...answersChartOptions }}
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
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            width: "98%",
            alignItems: "center",
          }}
        >
          <button
            onClick={handleSortToggle}
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#f0f0f0",
              border: "none",
              borderRadius: "4px",
              padding: "8px 12px",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            <span style={{ marginRight: "5px" }}>
              {sorted ? "Unsort" : "Sort"}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {sorted ? (
                <path d="M3 4h13M3 8h9m-9 4h6m4 0l4 4m0 0l4-4m-4 4V4" />
              ) : (
                <path d="M3 4h13M3 8h9m-9 4h6m4 0l4 4m0 0l4-4m-4 4V4" />
              )}
            </svg>
          </button>
          <button
            onClick={handleTableViewToggle}
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#f0f0f0",
              border: "none",
              borderRadius: "4px",
              padding: "8px 12px",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            <span style={{ marginRight: "5px" }}>
              {tableView ? "Hide Table" : "Show Table"}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {tableView ? (
                <path d="M4 12h16M4 6h16M4 18h16" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          <select
            onChange={handleChartTypeChange}
            value={chartType}
            style={{
              appearance: "none",
              backgroundColor: "#f0f0f0",
              border: "none",
              borderRadius: "4px",
              padding: "8px 12px",
              cursor: "pointer",
              outline: "none",
              fontFamily: "Arial, sans-serif",
              fontSize: "14px",
            }}
          >
            <option value="vertical">Vertical Bar</option>
            <option value="horizontal">Horizontal Bar</option>
            <option value="pie">Pie</option>
            <option value="spider">Spider</option>
            <option value="doughnut">Doughnut</option>
            <option value="polarArea">Polar Area</option>
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
