import React, { useState }from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import TimerComponent from './TimerComponent';
import NavbarComponent from './NavbarComponent';
import StatsComponent from './StatsComponent';

function App() {
  const [sets, setSets] = useState([]);

  return (
    <Router>
      <div className="App">
        <NavbarComponent />
        <Routes>
          <Route path="/" element={<TimerComponent sets={sets} setSets={setSets} />} />
          <Route path="/stats" element={<StatsComponent sets={sets} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
