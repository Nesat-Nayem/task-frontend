"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie, Radar } from 'react-chartjs-2';
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
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';


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
  const [chartType, setChartType] = useState('horizontal');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:7070/api/data');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
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
      datalabels: {
        display: false,
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          display: false,
        },
      },
      y: {
        stacked: true,
      },
    },
  };

  // Calculate the total count for all locations to display percentages
  const totalLocationCount = data.locationData.reduce(
    (sum, item) => sum + item.count,
    0
  );
  // Prepare the data for the location chart
  const locationLabels = data.locationData.map((item) => item._id);
  const locationData = data.locationData.map((item) => item.count);
  const locationTotal = locationData.reduce((sum, count) => sum + count, 0);

  const locationChartData = {
    labels: locationLabels,
    datasets: [
      {
        label: "Amount",
        data: locationData,
        backgroundColor: "#44f1b6",
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
  const filteredAnswersDataf = data.answersData.filter(item => item._id);

  // Sort answers data based on count if needed
  const sortedOrFilteredAnswersData = sorted
    ? [...filteredAnswersDataf].sort((a, b) => b.count - a.count)
    : filteredAnswersDataf;
  // Prepare the data for the answers chart
  const answersLabels = sortedOrFilteredAnswersData.map(item => item._id);
  const answersData = sortedOrFilteredAnswersData.map(item => item.count);

  const answersChartData = {
    labels: answersLabels,
    datasets: [
      {
        label: 'Count',
        data: answersData,
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        // For vertical bar chart, you might want to set the bar thickness
        barThickness: chartType === 'vertical' ? undefined : 'flex', // 'flex' for horizontal or undefined for vertical
      },
    ],
  };
  


  const answersChartOptions = {
    indexAxis: chartType === 'horizontal' ? 'y' : 'x',
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
      case 'horizontal':
        return {
          indexAxis: 'y',
          scales: {
            x: {
              beginAtZero: true,
            },
          },
          // ... other options specific to horizontal bar chart
        };
      case 'vertical':
        return {
          indexAxis: 'x',
          scales: {
            y: {
            beginAtZero: true,
            },
          },
          // ... other options specific to vertical bar chart
        };
      case 'pie':
        // Pie charts do not use indexAxis
        return {
          // ... other options specific to pie chart
        };
      case 'spider':
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
  const renderChart = () => {
    switch (chartType) {
      case 'horizontal':
      case 'vertical':
        return <Bar data={answersChartData} options={chartOptions} />;
      case 'pie':
        return <Pie data={answersChartData} options={chartOptions} />;
      case 'spider':
        return <Radar data={answersChartData} options={chartOptions} />;
      default:
        return null;
    }
  };
  

  // Register the datalabels plugin
  ChartJS.register(ChartDataLabels);

  return (
    <div>
      <div>
        <h2 >Age and Gender </h2>

        <div style={{ display: "flex" }}>
          <div style={{ flex: 2 }}>
            <Bar data={ageGenderChartData} options={ageGenderChartOptions} />
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
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
                  {data.ageGenderData.reduce((sum, item) => sum + item.male, 0)}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
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

      <div>
        <h2>Location Distribution</h2>
        <Bar data={locationChartData} options={locationChartOptions} />
      </div>
      <div>
        <h2>Answers Distribution</h2>
        <button onClick={handleSortToggle}>{sorted ? 'Unsort' : 'Sort'}</button>
        <button onClick={handleTableViewToggle}>{tableView ? 'Hide Table' : 'Show Table'}</button>
        <select onChange={handleChartTypeChange} value={chartType}>
          <option value="horizontal">Horizontal Bar</option>
          <option value="vertical">Vertical Bar</option>
          <option value="pie">Pie</option>
          <option value="spider">Spider</option>
        </select>

        {tableView ? (
          <table>
            <thead>
              <tr>
                <th>Answer</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrFilteredAnswersData.map((item) => (
                <tr key={item._id}>
                  <td>{item._id || 'Unknown'}</td>
                  <td>{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          renderChart()
        )}
      </div>
    </div>
  );
}
