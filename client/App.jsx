import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import ServerHealthWidget from "./ServerHealthWidget.jsx";
import SidePanel from "./SidePanel.jsx";
import { DragDropProvider, useDroppable } from "@dnd-kit/react";
import AddWidgetModal from "./AddWidgetModal.jsx";

const WidgetArea = ({ widgets }) => {
  const { ref } = useDroppable({ id: "widgetArea" });
  return (
    <div className="widgetArea" ref={ref}>
      {widgets.map((widget) => {
        switch (widget.type) {
          case "ServerHealth":
            return (
              <ServerHealthWidget
                key={widget._id}
                url={widget.endpoint}
                name={widget.name}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

const App = () => {
  const [reloadDash, setReloadDash] = useState(false);
  const [dashboards, setDashboards] = useState([]);
  const [activeDashboard, setActiveDashboard] = useState(null);
  const [pendingWidgetType, setPendingWidgetType] = useState(null);
  useEffect(() => {
    const fetchDashboards = async () => {
      const response = await fetch("/api/dashboard");
      const data = await response.json();
      setDashboards(data);
      setActiveDashboard(
        (prev) => data.find((d) => d._id === prev?._id) ?? data[0],
      );
    };
    fetchDashboards();
  }, [reloadDash]);

  return (
    <DragDropProvider
      onDragEnd={(e) => {
        const { source, target } = e.operation;
        if (target?.id === "widgetArea") setPendingWidgetType(source.id);
      }}
    >
      <div className="dashboardContainer">
        <WidgetArea widgets={activeDashboard?.widgets ?? []} />
        {pendingWidgetType && (
          <AddWidgetModal
            widgetType={pendingWidgetType}
            dashboardId={activeDashboard._id}
            onClose={() => setPendingWidgetType(null)}
            onSuccess={() => setReloadDash((prev) => !prev)}
          />
        )}
        <SidePanel
          dashboards={dashboards}
          activeDashboard={activeDashboard}
          setActiveDashboard={setActiveDashboard}
          setReloadDash={setReloadDash}
        />
      </div>
    </DragDropProvider>
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
