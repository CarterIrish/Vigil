import { useDraggable } from "@dnd-kit/react";
import { useState } from "react";
const DraggableWidget = (props) => {
  const { ref } = useDraggable({
    id: props.widgetId,
  });
  return (
    <div className="widgetListItem" ref={ref}>
      <h3>{props.label}</h3>
    </div>
  );
};

export const SidePanel = ({
  dashboards,
  activeDashboard,
  setActiveDashboard,
  setReloadDash,
}) => {
  const [isAddingDash, setAddingDash] = useState(false);
  const [newDashName, setNewDashName] = useState("");
  const [dashError, setDashError] = useState(null);

  const handleAddDash = async () => {
    setDashError(null);
    const res = await fetch("/api/dashboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newDashName }),
    });
    if (res.status === 201) {
      setReloadDash((prev) => !prev);
      setAddingDash(false);
      setNewDashName("");
    } else {
      const data = await res.json();
      setDashError(data.error ?? "Failed to create dashboard");
    }
  };

  return (
    <div className="sidePanel">
      <div className="sidepanelSection">
        <div className="sidepanelHeader">
          <h2>Dashboards</h2>
          <button onClick={() => setAddingDash(true)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
            </svg>
          </button>
        </div>
        {isAddingDash && (
          <div className="addDashInput">
            <input
              type="text"
              placeholder="Dashboard name"
              value={newDashName}
              onChange={(e) => setNewDashName(e.target.value)}
            />
            <button onClick={handleAddDash}>Add</button>
            {dashError && <p className="formError">{dashError}</p>}
          </div>
        )}
        <div className="dashboardList">
          {dashboards.map((dash) => {
            return (
              <div
                key={dash._id}
                className={`dashboardListItem ${activeDashboard?._id === dash._id ? "active" : ""}`}
                onClick={() => {
                  if(activeDashboard._id === dash._id) return;
                  setActiveDashboard(dash);
                  setReloadDash((prev) => !prev);
                }}
              >
                <h3>{dash.name}</h3>
              </div>
            );
          })}
        </div>
      </div>
      <div className="sidepanelSection">
        <h2>Your Widgets</h2>
        <div className="widgetList">
          {dashboards.length === 0 ? (
            <p>Create a dashboard to add widgets</p>
          ) : (
            <DraggableWidget widgetId="ServerHealth" label="Server Health" />
          )}
        </div>
      </div>
    </div>
  );
};

export default SidePanel;
