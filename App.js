import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from './useStore';
import TribeCard from './components/TribeCard';
import AdminPanel, { ADMIN_PIN } from './components/AdminPanel';
import Leaderboard from './components/Leaderboard';
import FinnsTribe from './components/FinnsTribe';
import './App.css';

const AUTO_REFRESH_MS = 5 * 60 * 1000; // 5 minutes

export default function App() {
  const {
    data,
    updateTribeName,
    updateTribeIcon,
    assignSurvivors,
    eliminateSurvivor,
    reinstatesSurvivor,
    updateSurvivorName,
  } = useStore();

  const [showAdmin, setShowAdmin] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [pinMode, setPinMode] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  // Auto-refresh display
  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefreshed(new Date());
    }, AUTO_REFRESH_MS);
    return () => clearInterval(interval);
  }, []);

  const handleAdminClick = () => {
    setPinMode(true);
    setPinInput('');
    setPinError(false);
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) {
      setPinMode(false);
      setShowAdmin(true);
      setPinInput('');
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const eliminatedCount = data.survivors.filter(s => s.eliminated).length;
  const remainingCount = data.survivors.length - eliminatedCount;

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="app-header__torch-left" aria-hidden="true">🔥</div>
        <div className="app-header__center">
          <div className="app-header__season-label">Season 50</div>
          <h1 className="app-header__title">Survivor Draft</h1>
          <div className="app-header__meta">
            <span>{eliminatedCount} eliminated</span>
            <span className="app-header__dot">·</span>
            <span>{remainingCount} remain</span>
            <span className="app-header__dot">·</span>
            <span className="app-header__refresh" title={`Last refreshed: ${lastRefreshed.toLocaleTimeString()}`}>
              ↻ live
            </span>
          </div>
        </div>
        <div className="app-header__torch-right" aria-hidden="true">🔥</div>
      </header>

      {/* Leaderboard */}
      <section className="app-section app-section--leaderboard">
        <Leaderboard tribes={data.tribes} survivors={data.survivors} />
      </section>

      {/* Tribe Cards Grid */}
      <section className="app-section">
        <h2 className="section-heading">The Tribes</h2>
        <div className="tribes-grid">
          {data.tribes.map(tribe => (
            <TribeCard
              key={tribe.id}
              tribe={tribe}
              survivors={data.survivors}
            />
          ))}
        </div>
      </section>

      {/* Finn's Tribe */}
      <section className="app-section">
        <FinnsTribe survivors={data.survivors} tribes={data.tribes} />
      </section>

      {/* Scoring Key */}
      <section className="app-section scoring-key">
        <h3 className="scoring-key__title">How Scoring Works</h3>
        <p className="scoring-key__text">
          Each survivor earns points equal to their finishing position — first boot = 1 pt, winner = 24 pts.
          Active survivors show <strong>tentative points (~)</strong> based on how many people remain.
          Points lock in permanently when they're eliminated.
        </p>
      </section>

      {/* Admin Button */}
      <div className="admin-trigger-wrap">
        <button className="admin-trigger" onClick={handleAdminClick}>
          ⚙ Admin
        </button>
      </div>

      {/* PIN Modal */}
      {pinMode && (
        <div className="modal-overlay" onClick={() => setPinMode(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal__title">Admin Access</h2>
            <p className="modal__sub">Enter your PIN to continue</p>
            <form onSubmit={handlePinSubmit}>
              <input
                className={`modal__pin-input ${pinError ? 'modal__pin-input--error' : ''}`}
                type="password"
                inputMode="numeric"
                maxLength={6}
                value={pinInput}
                onChange={e => { setPinInput(e.target.value); setPinError(false); }}
                autoFocus
                placeholder="••••"
              />
              {pinError && <p className="modal__error">Incorrect PIN. Try again.</p>}
              <button type="submit" className="modal__submit">Enter</button>
            </form>
            <button className="modal__cancel" onClick={() => setPinMode(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Admin Panel */}
      {showAdmin && (
        <AdminPanel
          data={data}
          onUpdateTribeName={updateTribeName}
          onUpdateTribeIcon={updateTribeIcon}
          onAssignSurvivors={assignSurvivors}
          onEliminateSurvivor={eliminateSurvivor}
          onReinstateSurvivor={reinstatesSurvivor}
          onUpdateSurvivorName={updateSurvivorName}
          onClose={() => setShowAdmin(false)}
        />
      )}
    </div>
  );
}
