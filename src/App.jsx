import React, { useEffect, useState } from 'react';
import './App.css';
import Chart from 'chart.js/auto';

function App() {
  const [goal, setGoal] = useState('');
  const [goals, setGoals] = useState(() => JSON.parse(localStorage.getItem('goals')) || []);
  const [timeData, setTimeData] = useState({});

  const handleAddGoal = () => {
    if (goal.trim()) {
      const updated = [...goals, goal];
      setGoals(updated);
      localStorage.setItem('goals', JSON.stringify(updated));
      setGoal('');
    }
  };

  const handleClearGoals = () => {
    setGoals([]);
    localStorage.removeItem('goals');
  };

  const drawChart = (data) => {
    const ctx = document.getElementById('chart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(data),
        datasets: [
          {
            label: 'Time (s)',
            data: Object.values(data),
            backgroundColor: '#e50914',
          },
        ],
      },
    });
  };

  useEffect(() => {
    chrome.storage.local.get(null, (res) => {
      const sorted = Object.entries(res)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
      const data = Object.fromEntries(sorted);
      setTimeData(data);
      setTimeout(() => drawChart(data), 500);
    });
  }, []);

  return (
    <div className="container">
      <h1>Productivity Tracker</h1>
      <input
        type="text"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        placeholder="Enter daily goal"
      />
      <button onClick={handleAddGoal}>Add Goal</button>

      <ul>
        {goals.map((g, i) => (
          <li key={i}>✅ {g}</li>
        ))}
      </ul>

      {goals.length > 0 && <button onClick={handleClearGoals} className="clear">Clear Goals</button>}

      <h2> Top Websites (Today)</h2>
      <canvas id="chart" width="280" height="200"></canvas>
    </div>
  );
}

export default App;