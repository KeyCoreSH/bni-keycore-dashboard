import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Members from './pages/Members';
import Graph from './pages/Graph';
import Fit from './pages/Fit';
import Estrutura from './pages/Estrutura';

const App = () => {
  return (
    <Router>
      <div style={{ padding: '20px' }}>
        <h1>BNI KeyCore Dashboard</h1>
        <Routes>
          <Route path="/members" element={<Members />} />
          <Route path="/graph" element={<Graph />} />
          <Route path="/fit" element={<Fit />} />
          <Route path="/grupo/estrutura" element={<Estrutura />} />   {/* Nova rota */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;