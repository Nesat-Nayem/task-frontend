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
      indexAxis: 'y',
      responsive: true,
      plugins: {
        tooltip: {
          displayColors: false, // Disable the small color box next to the tooltip text
          callbacks: {
            title: (tooltipItems) => {
              // Return the age range for the title
              return tooltipItems[0].label;
            },
            label: () => {
              // Return an empty string to avoid showing individual category counts
              return '';
            },
            footer: (tooltipItems) => {
              // Find the index of the hovered item
              const index = tooltipItems[0].dataIndex;
              // Retrieve the data for both male and female using the index
              const maleValue = ageGenderMaleData[index];
              const femaleValue = ageGenderFemaleData[index];
              const total = ageGenderTotalData[index];
              // Calculate the percentages
              const malePercentage = ((maleValue / total) * 100).toFixed(1) + '%';
              const femalePercentage = ((femaleValue / total) * 100).toFixed(1) + '%';
              // Return the combined data as the footer
              return [
                `Male: ${maleValue} (${malePercentage})`,
                `Female: ${femaleValue} (${femalePercentage})`,
                `Total: ${total}`,
              ];
            }
          }
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
    [ageGenderMaleData, ageGenderFemaleData, ageGenderTotalData]
  );
  

  // const ageGenderChartOptions = useMemo(
  //   () => ({
  //     indexAxis: "y",
  //     responsive: true,
  //     plugins: {
  //       tooltip: {
  //         callbacks: {
  //           label: (context) => {
  //             const label = context.dataset.label;
  //             const value = context.raw;
  //             const total = ageGenderTotalData[context.dataIndex];
  //             const percentage = ((value / total) * 100).toFixed(1) + "%";
  //             return `${label}: ${value} (${percentage})`;
  //           },
  //           footer: (tooltipItems) => {
  //             // Find the index of the hovered item
  //             const index = tooltipItems[0].dataIndex;
  //             // Retrieve the data for both male and female using the index
  //             const maleValue = ageGenderMaleData[index];
  //             const femaleValue = ageGenderFemaleData[index];
  //             const total = ageGenderTotalData[index];
  //             // Calculate the percentages
  //             const malePercentage =
  //               ((maleValue / total) * 100).toFixed(1) + "%";
  //             const femalePercentage =
  //               ((femaleValue / total) * 100).toFixed(1) + "%";
  //             // Return the combined data as the footer
  //             return [
  //               `Male: ${maleValue} (${malePercentage})`,
  //               `Female: ${femaleValue} (${femalePercentage})`,
  //               `Total: ${total}`,
  //             ];
  //           },
  //         },
  //       },
  //       datalabels: {
  //         display: false,
  //       },
  //     },
  //     scales: {
  //       x: {
  //         stacked: true,
  //         ticks: {
  //           display: false,
  //         },
  //       },
  //       y: {
  //         stacked: true,
  //       },
  //     },
  //   }),
  //   [ageGenderMaleData, ageGenderFemaleData, ageGenderTotalData]
  // );

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
        Age & Gender
      </h2>

      <div style={{ display: "flex", margin: "20px" }}>
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
