import { useState, useEffect } from "react";

export const ServerHealthWidget = (props) => {
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
      <h2 className="serverHealthTitle">{props.name}</h2>
      <h3 className="serverHealthUrl">{props.url}</h3>
      <div className="widgetStatusRow">
        <span className={`statusIndicator ${widgetStatus}`} />
        <p>
          {healthData
            ? `Health Status: ${healthData.status}`
            : "No data available"}
        </p>
      </div>
      <div className="widgetOptions">
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
        <button
          className="editButton"
          onClick={props.onEdit}
          aria-label="Edit widget"
        >
          <svg
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54A.484.484 0 0 0 13.82 2h-3.84a.49.49 0 0 0-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 0 0-.59.22L2.63 8.47a.49.49 0 0 0 .12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.49.49 0 0 0-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 0 1 8.4 12 3.6 3.6 0 0 1 12 8.4a3.6 3.6 0 0 1 3.6 3.6 3.6 3.6 0 0 1-3.6 3.6z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ServerHealthWidget;
