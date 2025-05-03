import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CycleProvider } from './context/CycleContext';
import Welcome from './components/Onboarding/Welcome';
import LastPeriodDate from './components/Onboarding/LastPeriodDate';
import AverageCycleLength from './components/Onboarding/AverageCycleLength';
import Conditions from './components/Onboarding/Conditions';
import CycleTracker from './components/Tracker/CycleTracker';
import MonthView from './components/Tracker/MonthView';
import LogPeriod from './components/Tracker/LogPeriod';
import AddSymptoms from './components/Tracker/AddSymptoms';
import Analysis from './components/Tracker/Analysis';
import CycleHistory from './components/Tracker/CycleHistory';

const App: React.FC = () => (
  <CycleProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/last-period" element={<LastPeriodDate />} />
        <Route path="/cycle-length" element={<AverageCycleLength />} />
        <Route path="/conditions" element={<Conditions />} />
        <Route path="/tracker" element={<CycleTracker />} />
        <Route path="/month-view" element={<MonthView />} />
        <Route path="/log-period" element={<LogPeriod />} />
        <Route path="/add-symptoms" element={<AddSymptoms />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/cycle-history" element={<CycleHistory />} />
      </Routes>
    </Router>
  </CycleProvider>
);

export default App;