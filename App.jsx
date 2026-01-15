import React, { useState, useEffect } from 'react';
import LiveChart from './LiveChart';
import StatsPanel from './StatsPanel';

export default function App() {
  const [accepted, setAccepted] = useState(false);

  if (!accepted) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', background: '#111', color: 'white', minHeight: '100vh' }}>
        <h1>AviatorPulse – Educational Tool</h1>
        <div style={{ background: '#440000', padding: '1rem', margin: '1rem auto', maxWidth: '600px', borderRadius: '8px' }}>
          <p>⚠️ This site is for <strong>statistical analysis only</strong>.</p>
          <p>Aviator is a game of chance. <strong>Past results do not predict future outcomes.</strong></p>
          <p>You must be 18+ to proceed.</p>
        </div>
        <button onClick={() => setAccepted(true)} style={{
          background: '#3b82f6', color: 'white', border: 'none',
          padding: '0.75rem 2rem', fontSize: '1rem', borderRadius: '6px', cursor: 'pointer'
        }}>
          I Understand – Enter Site
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem', background: '#111', color: 'white', minHeight: '100vh' }}>
      <h1>Aviator Game Analyzer</h1>
      <StatsPanel />
      <LiveChart />
      <footer style={{ marginTop: '2rem', textAlign: 'center', color: '#aaa', fontSize: '0.9rem' }}>
        © 2026 AviatorPulse | Educational use only
      </footer>
    </div>
  );
}