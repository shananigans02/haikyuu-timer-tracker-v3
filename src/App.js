import React, { useState }from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import TimerComponent from './TimerComponent';
import NavbarComponent from './NavbarComponent';
import StatsComponent from './StatsComponent';

function App() {
  const [sessions, setSessions] = useState([]);

  return (
    <Router>
      <div className="App">
        <NavbarComponent />
        <Routes>
          <Route path="/" element={<TimerComponent sessions={sessions} setSessions={setSessions} />} />
          <Route path="/stats" element={<StatsComponent sessions={sessions} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
