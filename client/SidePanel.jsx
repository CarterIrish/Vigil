export const SidePanel = ({
  dashboards,
  activeDashboard,
  setActiveDashboard,
  setReloadDash,
}) => {
  return (
    <div className="sidePanel">
      <div className="sidepanelSection">
        <h2>Dashboards</h2>
        <div className="dashboardList">
          {dashboards.map((dash) => {
            return (
              <div
                key={dash._id}
                className={`dashboardListItem ${activeDashboard?._id === dash._id ? "active" : ""}`}
                onClick={() => {
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
          <div className="widgetListItem">
            <h3>Server Health</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidePanel;
