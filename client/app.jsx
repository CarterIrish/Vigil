import React, { useState, useEffect } from "react";
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
  const [reloadHealth, setReloadHealth] = useState(false);

  useEffect(() => {
    const SendHealthCheck = async () => {
      const params = new URLSearchParams({ endpoint: props.url });
      const result = await fetch(
        `/api/healthwidget?${params.toString()}`,
      );
      const data = await result.json();
      setHealthData(data);
    };

    SendHealthCheck();
  }, [reloadHealth]);

  return (
    <div className="widgetContainer">
      <h2>Widget</h2>
      <span>
        {healthData
          ? `Health Status: ${healthData.status}`
          : "No data available"}
      </span>
      <button onClick={() => setReloadHealth(!reloadHealth)}>Refresh</button>
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
