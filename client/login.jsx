const React = require('react');
const { createRoot } = require('react-dom/client');

const LoginWindow = () => {
    return (
        <div>
            <h1>Login</h1>
            <form>
                <input type="text" placeholder="Username" />
                <input type="password" placeholder="Password" />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

const init = () => {
    const container = document.getElementById('app');
    if (container) {
        const root = createRoot(container);
        root.render(<LoginWindow />);
    }
};

window.onload = init;
