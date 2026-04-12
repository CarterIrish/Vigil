import { createRoot } from "react-dom/client";
import ServerHealthWidget from "./ServerHealthWidget.jsx";
import SidePanel from "./SidePanel.jsx";

const App = () => {
  return (
    <div className="dashboardContainer">
      <div className="widgetArea">
        {/* TODO: remove this hardcoded widget and replace with dynamic widget loading based on user configuration */}
        <ServerHealthWidget url="https://api.carterirish.net/v1/health" />
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
