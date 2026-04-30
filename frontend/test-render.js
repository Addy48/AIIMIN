import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './src/App.js';

try {
    console.log("Rendering App...");
    renderToString(React.createElement(App));
    console.log("Rendered successfully");
} catch (err) {
    console.error("\n--- CRASH CAUGHT ---");
    console.error(err);
}
