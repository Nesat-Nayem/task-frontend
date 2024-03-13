import { Bar } from "react-chartjs-2";
import { useMemo } from "react";

export default function AgeGenderChart({ data }) {
  // Prepare the data for the ageGender chart
  const ageGenderLabels = data.ageGenderData.map((item) => item._id);
  const ageGenderMaleData = data.ageGenderData.map((item) => item.male);
  const ageGenderFemaleData = data.ageGenderData.map((item) => item.female);
  const ageGenderTotalData = data.ageGenderData.map((item) => item.total);

  const ageGenderChartData = useMemo(
    () => ({
      labels: ageGenderLabels,
      datasets: [
        {
          label: "Male",
          data: ageGenderMaleData,
          backgroundColor: "#e3f4ee",
          stack: "gender",
          barThickness: 40,
        },
        {
          label: "Female",
          data: ageGenderFemaleData,
          backgroundColor: "#44f1b6",
          stack: "gender",
          barThickness: 40,
        },
      ],
    }),
    [ageGenderLabels, ageGenderMaleData, ageGenderFemaleData]
  );

  const ageGenderChartOptions = useMemo(
    () => ({
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
    }),
    [ageGenderTotalData]
  );

  return (
    <div>
      <h2>Age and Gender Distribution</h2>

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
                {data.ageGenderData.reduce((sum, item) => sum + item.female, 0)}
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
  );
}
