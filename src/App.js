import React, { useState }from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import TimerComponent from './TimerComponent';
import NavbarComponent from './NavbarComponent';
import StatsComponent from './StatsComponent';

function App() {
  const [sessions, setSessions] = useState([]);
  const [theme, setTheme] = useState('light');
  const containerBorderColor = theme === 'dark' ? 'border-customOrange' : 'border-darkBlue';

  return (
    <Router>
      <div className={`App font-mono ${theme === 'dark' ? 'bg-darkBlue' : 'bg-customOrange'} min-h-screen overflow-hidden`}>
        <NavbarComponent setTheme={setTheme} theme={theme} />
        
        <div className={`mx-[2vw] my-4 mb-[2vw] p-4 pb-8 border rounded-xl shadow ${containerBorderColor}`}>
          <Routes>
            <Route path="/" element={<TimerComponent sessions={sessions} setSessions={setSessions} theme={theme} />} />
            <Route path="/stats" element={<StatsComponent sessions={sessions} theme={theme} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
