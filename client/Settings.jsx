import { createRoot } from "react-dom/client";

const Settings = () => {
    return (
        <div>Settings coming soon...</div>
    )
}


const init = () => {
  const container = document.getElementById("app");
  if (container) {
    const root = createRoot(container);
    root.render(<Settings />);
  }
};

window.onload = init;