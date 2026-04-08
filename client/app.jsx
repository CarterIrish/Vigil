const React = require('react');
const { createRoot } = require('react-dom/client');

const App = () => {
    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    );
};

const init = () => {
    const container = document.getElementById('app');
    if (container) {
        const root = createRoot(container);
        root.render(<App />);
    }
};

window.onload = init;
