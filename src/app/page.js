'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

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
  const ageGenderLabels = data.ageGenderData.map(item => item._id);
  const ageGenderMaleData = data.ageGenderData.map(item => item.male);
  const ageGenderFemaleData = data.ageGenderData.map(item => item.female);

  const ageGenderChartData = {
    labels: ageGenderLabels,
    datasets: [
      {
        label: 'Male',
        data: ageGenderMaleData,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
      {
        label: 'Female',
        data: ageGenderFemaleData,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  // Prepare the data for the location chart
  const locationLabels = data.locationData.map(item => item._id);
  const locationData = data.locationData.map(item => item.count);

  const locationChartData = {
    labels: locationLabels,
    datasets: [
      {
        label: 'Count',
        data: locationData,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  // Prepare the data for the answers chart
  const answersLabels = data.answersData.map(item => item._id);
  const answersData = data.answersData.map(item => item.count);

  const answersChartData = {
    labels: answersLabels,
    datasets: [
      {
        label: 'Count',
        data: answersData,
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
      },
    ],
  };

  return (
    <div>
      <h1>Survey Data Visualization</h1>
      <div>
        <h2>Age and Gender Distribution</h2>
        <Bar data={ageGenderChartData} />
      </div>
      <div>
        <h2>Location Distribution</h2>
        <Bar data={locationChartData} />
      </div>
      <div>
        <h2>Answers Distribution</h2>
        <Bar data={answersChartData} />
      </div>
    </div>
  );
}
