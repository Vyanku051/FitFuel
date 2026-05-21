import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LogMeal from './pages/LogMeal';
import Workouts from './pages/Workouts';
import AiSuggest from './pages/AiSuggest';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/log-meal" element={<LogMeal />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/ai-suggest" element={<AiSuggest />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;