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

const DashboardRenameInput = ({ dashboard, onDone, fetchDashboards }) => {
  const [name, setName] = useState(dashboard.name);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await fetch(`/api/dashboard/${dashboard._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (res.status === 200) {
      await fetchDashboards();
      onDone();
    } else {
      const data = await res.json();
      setError(data.error ?? "Failed to rename dashboard");
    }
  };

  return (
    <div className="renameDashInput">
      <input
        type="text"
        placeholder="Dashboard name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleSubmit}>Save</button>
      <button onClick={onDone}>Cancel</button>
      {error && <p className="formError">{error}</p>}
    </div>
  );
};

export const SidePanel = ({
  dashboards,
  activeDashboard,
  setActiveDashboard,
  setReloadDash,
  fetchDashboards,
}) => {
  const [isAddingDash, setAddingDash] = useState(false);
  const [newDashName, setNewDashName] = useState("");
  const [dashError, setDashError] = useState(null);
  const [editingDashId, setEditingDashId] = useState(null);

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
            <button
              onClick={() => {
                setAddingDash(false);
                setNewDashName("");
                setDashError(null);
              }}
            >
              Cancel
            </button>
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
                  if (
                    editingDashId === dash._id ||
                    activeDashboard?._id === dash._id
                  )
                    return;
                  setActiveDashboard(dash);
                  setReloadDash((prev) => !prev);
                }}
              >
                {editingDashId === dash._id ? (
                  <DashboardRenameInput
                    fetchDashboards={fetchDashboards}
                    dashboard={dash}
                    onDone={() => {
                      setEditingDashId(null);
                    }}
                  />
                ) : (
                  <h3>{dash.name}</h3>
                )}

                {editingDashId !== dash._id && (
                  <button
                    className="editDashButton"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingDashId(dash._id);
                    }}
                    aria-label="Edit dashboard"
                  >
                    <svg
                      width="20px"
                      height="20px"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54A.484.484 0 0 0 13.82 2h-3.84a.49.49 0 0 0-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 0 0-.59.22L2.63 8.47a.49.49 0 0 0 .12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.49.49 0 0 0-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 0 1 8.4 12 3.6 3.6 0 0 1 12 8.4a3.6 3.6 0 0 1 3.6 3.6 3.6 3.6 0 0 1-3.6 3.6z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                )}
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
