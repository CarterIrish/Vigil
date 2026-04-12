import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

const App = () => {
  return (
    <div className="dashboardContainer">
      <ServerHealthWidget url="https://api.carterirish.net/v1/health" />
    </div>
  );
};

const ServerHealthWidget = (props) => {
  const [healthData, setHealthData] = useState(null);
  const [refreshToggle, setRefreshToggle] = useState(false);
  const [, setFailureCount] = useState(0);
  const [widgetStatus, setWidgetStatus] = useState("unknown");

  const handleHealthFailure = (prevCount) => {
    const newCount = prevCount + 1;
    setWidgetStatus(newCount >= 3 ? "down" : "unhealthy");
    return newCount;
  };

  useEffect(() => {
    const sendHealthCheck = async () => {
      try {
        const params = new URLSearchParams({ endpoint: props.url });
        const result = await fetch(`/api/healthwidget?${params.toString()}`);
        const data = await result.json();
        setHealthData(data);

        if (data.status === "healthy") {
          setWidgetStatus("healthy");
          setFailureCount(0);
        } else {
          setFailureCount(handleHealthFailure);
        }
      } catch (err) {
        console.error("Error fetching health data: ", err);
        setFailureCount(handleHealthFailure);
      }
    };

    sendHealthCheck();
  }, [refreshToggle, props.url]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshToggle((prev) => !prev);
    }, 60000);
    return () => clearInterval(interval);
  }, [props.url]);

  return (
    <div className="widgetContainer">
      <h2>Widget</h2>
      <p>
        {healthData
          ? `Health Status: ${healthData.status}`
          : "No data available"}
      </p>
      <span className={`statusIndicator ${widgetStatus}`} />
      <button
        className="refreshButton"
        onClick={() => setRefreshToggle(!refreshToggle)}
      >
        <svg
          width="24px"
          height="24px"
          viewBox="-2.5 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <path
            d="M20.48 18.613l-1.12 7.84 7.627-1.173-2.987-3.040c1.013-1.867 1.6-3.947 1.6-6.24 0-7.093-5.707-12.8-12.8-12.8v1.067c6.453 0 11.733 5.28 11.733 11.733 0 1.973-0.48 3.787-1.333 5.44l-2.72-2.827zM20.587 25.173l0.64-4.267 3.52 3.627-4.16 0.64z"
            fill="currentColor"
          />
          <path
            d="M1.067 16c0-2.827 1.013-5.387 2.667-7.413l3.253 3.307 1.12-7.84-7.627 1.227 2.453 2.56c-1.813 2.187-2.933 5.067-2.933 8.16 0 7.093 5.707 12.8 12.8 12.8v-1.067c-6.453 0-11.733-5.28-11.733-11.733zM6.827 5.387l-0.64 4.267-3.52-3.627 4.16-0.64z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  );
};

const init = () => {
  const container = document.getElementById("app");
  if (container) {
    const root = createRoot(container);
    root.render(<App />);
  }
};

window.onload = init;
