import React, { useEffect, useState } from 'react';

export default function StatsPanel() {
  const [stats, setStats] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    fetch(`${API_URL}/api/stats`)
      .then(res => res.json())
      .then(setStats)
      .catch(err => console.error("Stats load failed"));
  }, []);

  if (!stats) return <div style={{ background: '#222', padding: '1rem', borderRadius: '8px' }}>Loading stats...</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
      <div style={{ background: '#222', padding: '1rem', borderRadius: '8px' }}>
        <div style={{ color: '#aaa' }}>Avg Multiplier</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.average_multiplier}x</div>
      </div>
      <div style={{ background: '#222', padding: '1rem', borderRadius: '8px' }}>
        <div style={{ color: '#aaa' }}>&gt;10x Rate</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.high_mult_rate}%</div>
      </div>
      <div style={{ background: '#222', padding: '1rem', borderRadius: '8px' }}>
        <div style={{ color: '#aaa' }}>Rounds Analyzed</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.total_rounds}</div>
      </div>
    </div>
  );
}