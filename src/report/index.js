import { App } from "./components";
import { createRoot } from 'react-dom/client';

const container = document.getElementById('report-app');
const root = createRoot(container);

root.render(<App />);