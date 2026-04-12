import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import ServerHealthWidget from "./ServerHealthWidget.jsx";
import SidePanel from "./SidePanel.jsx";

const App = () => {
  const [reloadDash, setReloadDash] = useState(false);
  const [dashboards, setDashboards] = useState([]);

  useEffect(() => {
    const fetchDashboards = async () => {
      const response = await fetch("/api/dashboard");
      const data = await response.json();
      setDashboards(data);
    };
    fetchDashboards();
  }, [reloadDash]);

  return (
    <div className="dashboardContainer">
      <div className="widgetArea">
        {/* TODO: remove this hardcoded widget and replace with dynamic widget loading based on user configuration */}
        {dashboards[0]?.widgets.map((widget) => {
          switch(widget.type){
            case 'ServerHealth':
              return <ServerHealthWidget key={widget._id} url={widget.endpoint} name={widget.name} />;
            default:
              return null;
          }
        })}
      </div>
      <SidePanel />
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
