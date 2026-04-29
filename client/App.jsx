import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import ServerHealthWidget from "./ServerHealthWidget.jsx";
import SidePanel from "./SidePanel.jsx";
import { DragDropProvider, useDroppable } from "@dnd-kit/react";
import AddWidgetModal from "./AddWidgetModal.jsx";
import EditWidgetModal from "./EditWidgetModal.jsx";

const WidgetArea = ({ widgets, setReloadDash, activeDashboard }) => {
  const { ref } = useDroppable({ id: "widgetArea" });
  const [selectedWidget, setSelectedWidget] = useState(null);

  return (
    <div className="widgetArea" ref={ref}>
      {widgets.map((widget) => {
        let widgetContent;
        switch (widget.type) {
          case "ServerHealth":
            widgetContent = (
              <ServerHealthWidget
                url={widget.endpoint}
                name={widget.name}
                onEdit={() => setSelectedWidget(widget)}
              />
            );
            break;
          default:
            return null;
        }
        if(!widgetContent) return null;
        return (
          <div
            key={widget._id}
            className="widgetContainer"
            style={{
              gridColumn: `span ${widget.w ?? 1}`,
              gridRow: `span ${widget.h ?? 1}`,
            }}
          >
            {widgetContent}
          </div>
        );
      })}
      {selectedWidget && activeDashboard && (
        <EditWidgetModal
          widget={selectedWidget}
          dashboardId={activeDashboard._id}
          onClose={() => setSelectedWidget(null)}
          onSuccess={() => setReloadDash((prev) => !prev)}
        />
      )}
    </div>
  );
};

const App = () => {
  const [reloadDash, setReloadDash] = useState(false);
  const [dashboards, setDashboards] = useState([]);
  const [activeDashboard, setActiveDashboard] = useState(null);
  const [pendingWidgetType, setPendingWidgetType] = useState(null);

  const fetchDashboards = async () => {
    const response = await fetch("/api/dashboard");
    const data = await response.json();
    setDashboards(data);
    setActiveDashboard(
      (prev) => data.find((d) => d._id === prev?._id) ?? data[0],
    );
  };

  useEffect(() => {
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
        <SidePanel
          dashboards={dashboards}
          activeDashboard={activeDashboard}
          setActiveDashboard={setActiveDashboard}
          setReloadDash={setReloadDash}
          fetchDashboards={fetchDashboards}
        />
        <WidgetArea
          widgets={activeDashboard?.widgets ?? []}
          setReloadDash={setReloadDash}
          activeDashboard={activeDashboard}
        />
        {pendingWidgetType && activeDashboard && (
          <AddWidgetModal
            widgetType={pendingWidgetType}
            dashboardId={activeDashboard._id}
            onClose={() => setPendingWidgetType(null)}
            onSuccess={() => setReloadDash((prev) => !prev)}
          />
        )}
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
