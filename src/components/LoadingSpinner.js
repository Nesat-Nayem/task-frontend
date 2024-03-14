// components/LoadingSpinner.js

export default function LoadingSpinner() {
  return (
    <div
      style={{
        position: "fixed", // Use fixed to cover the full viewport
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.9)", // Optional: white background with opacity
        zIndex: 1000, // Ensure it's above other content
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: "2rem", // Smaller width, adjust as needed
          height: "2rem", // Smaller height, adjust as needed
        }}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
      >
        <circle
          cx="50"
          cy="50"
          r="32"
          strokeWidth="8"
          stroke="#44f1b6"
          strokeDasharray="50.26548245743669 50.26548245743669"
          fill="none"
          strokeLinecap="round"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            repeatCount="indefinite"
            dur="1s"
            keyTimes="0;1"
            values="0 50 50;360 50 50"
          ></animateTransform>
        </circle>
      </svg>
    </div>
  );
}
