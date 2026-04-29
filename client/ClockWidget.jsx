import { useEffect, useState } from "react";

export const ClockWidget = (props) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const time = now.toLocaleTimeString("en-US", {
    timeZone: props.timezone,
    hour12: props.format === "12h",
  });
  const date = now.toLocaleDateString("en-US", { timeZone: props.timezone });
  return (
    <>
      <h2 className="clockTitle">{props.name}</h2>
      <p className='clockLocation'>{props.timezone}</p>
      <p className="clockTime">{time}</p>
      <p className="clockDate">{date}</p>
      <div className="widgetOptions">
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
    </>
  );
};

export default ClockWidget;
