import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Members from './pages/Members';
import Graph from './pages/Graph';
import Fit from './pages/Fit';

const App = () => {
  return (
    <Router>
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/members" element={<Members />} />
          <Route path="/graph" element={<Graph />} />
          <Route path="/fit" element={<Fit />} />
        </Routes>
      </div>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);