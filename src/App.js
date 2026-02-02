import React, { useState } from 'react';
import Header from './components/Header';
import ZoneSelector from './components/ZoneSelector';
import DepartmentList from './components/DepartmentList';
import './App.css';
import useSession from './hooks/useSession';

function App() {
  const [currentZone, setCurrentZone] = useState(null);
  const { isSessionActive, isExpired, remainingTime } = useSession();

  const handleSelectZone = (zone) => {
    setCurrentZone(zone);
  };

  const handleGoBack = () => {
    setCurrentZone(null);
  };

  // 🔒 Locked state after expiry
  if (isExpired) {
    return (
      <div className="App">
        <Header />
        <main className="page-wrapper">
          <section
            style={{
              padding: '40px',
              textAlign: 'center',
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            <h2 style={{ color: '#dc2626' }}>Session expired</h2>
            <p>Please scan the QR code again to continue.</p>
          </section>
        </main>
      </div>
    );
  }

  // ⏳ While waiting for QR scan (initial load without ?qr=1)
  if (!isSessionActive) {
    return (
      <div className="App">
        <Header />
        <main className="page-wrapper">
          <section
            style={{
              padding: '40px',
              textAlign: 'center'
            }}
          >
            <p>Please scan the QR code to start.</p>
          </section>
        </main>
      </div>
    );
  }

  // ✅ Normal app flow
  return (
    <div className="App">
      <Header />

      <main className="page-wrapper">
        {!currentZone ? (
          <ZoneSelector onSelectZone={handleSelectZone} />
        ) : (
          <DepartmentList
            zone={currentZone}
            onBack={handleGoBack}
          />
        )}
      </main>

      <footer>
        <p className="note-text">
          Navigation through Mappls App
          <span style={{ marginLeft: 8, fontSize: 12, opacity: 0.7 }}>
            (expires in {Math.ceil(remainingTime / 1000)}s)
          </span>
        </p>
        &copy; 2025 Ashok Leyland. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
