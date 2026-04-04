import React from 'react';
import { createRoot } from 'react-dom/client';

const App = () => <div />;

const root = document.getElementById('app');
if (root) createRoot(root).render(<App />);
