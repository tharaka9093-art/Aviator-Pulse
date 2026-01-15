import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

export default function LiveChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    
    const fetchRounds = async () => {
      try {
        const res = await fetch(`${API_URL}/api/rounds`);
        const rounds = await res.json();
        const chartData = rounds.reverse().map(r => ({
          x: new Date(r.timestamp * 1000).toLocaleTimeString(),
          y: r.multiplier
        }));
        setData(chartData);
      } catch (err) {
        console.error("Failed to load rounds");
      }
    };

    fetchRounds();
    const interval = setInterval(fetchRounds, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ background: '#222', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
      <h2>Live Multiplier (Last 50 Rounds)</h2>
      <div style={{ height: '300px' }}>
        <Line
          data={{
            labels: data.map(d => d.x),
            datasets: [{
              label: 'Multiplier (x)',
              data: data.map(d => d.y),
              borderColor: '#3b82f6',
              tension: 0.2,
              pointRadius: 3,
              pointBackgroundColor: '#ef4444'
            }]
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: { beginAtZero: true, ticks: { color: 'white' } },
              x: { ticks: { color: 'gray' } }
            },
            plugins: { legend: { labels: { color: 'white' } } }
          }}
        />
      </div>
    </div>
  );
}