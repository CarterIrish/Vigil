import React from "react";
import { createRoot } from "react-dom/client";

const App = () => {
  return (
    <div>
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
 