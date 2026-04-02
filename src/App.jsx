import React, { useState, useEffect } from 'react'
import { useStore } from './useStore'
import TribeCard from './components/TribeCard'
import AdminPanel, { ADMIN_PIN } from './components/AdminPanel'
import Leaderboard from './components/Leaderboard'
import FinnsTribe from './components/FinnsTribe'

const AUTO_REFRESH_MS = 5 * 60 * 1000

export default function App() {
  const {
    data,
    updateTribeName,
    updateTribeIcon,
    assignSurvivors,
    eliminateSurvivor,
    reinstatesSurvivor,
    updateSurvivorName,
  } = useStore()

  const [showAdmin, setShowAdmin] = useState(false)
  const [pinInput, setPinInput] = useState('')
  const [pinError, setPinError] = useState(false)
  const [pinMode, setPinMode] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {}, AUTO_REFRESH_MS)
    return () => clearInterval(interval)
  }, [])

  const handleAdminClick = () => { setPinMode(true); setPinInput(''); setPinError(false) }

  const handlePinSubmit = (e) => {
    e.preventDefault()
    if (pinInput === ADMIN_PIN) {
      setPinMode(false); setShowAdmin(true); setPinInput(''); setPinError(false)
    } else {
      setPinError(true); setPinInput('')
    }
  }

  const eliminatedCount = data.survivors.filter(s => s.eliminated).length
  const remainingCount = data.survivors.length - eliminatedCount
  const assignedIds = data.tribes.flatMap(t => t.survivors)
  const undrafted = data.survivors.filter(s => !assignedIds.includes(s.id))

  return (
    <div className="app">

      {/* ── HEADER ── */}
      <header className="app-header">
        <div className="app-header__left">
          <span className="app-header__eyebrow">Survivor 50 · Season 50</span>
          <h1 className="app-header__title">
            The Boys<sup>TM</sup> Draft
          </h1>
        </div>
        <div className="app-header__right">
          <div className="app-header__stat">
            <span className="app-header__stat-num">{eliminatedCount}</span>
            <span className="app-header__stat-label">Eliminated</span>
          </div>
          <div className="app-header__stat">
            <span className="app-header__stat-num">{remainingCount}</span>
            <span className="app-header__stat-label">Remain</span>
          </div>
          <span className="app-header__torch">🔥</span>
        </div>
      </header>

      {/* ── BODY: SIDEBAR + MAIN ── */}
      <div className="app-body">

        {/* ── SIDEBAR ── */}
        <aside className="app-sidebar">

          {/* Leaderboard */}
          <Leaderboard tribes={data.tribes} survivors={data.survivors} />

          {/* Divider */}
          <div style={{ borderTop: '1px solid var(--gray-200)' }} />

          {/* Finn's Tribe */}
          <div>
            <div className="finns-sidebar__title">🐾 Finn's Tribe</div>
            <div className="finns-sidebar__grid">
              {undrafted.length === 0 && (
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  All drafted!
                </span>
              )}
              {undrafted.map(s => (
                <div key={s.id} className={`finns-chip ${s.eliminated ? 'finns-chip--eliminated' : ''}`}>
                  <span className={`survivor-row__status-dot ${s.eliminated ? 'dot--out' : 'dot--in'}`} />
                  {s.name}
                  {s.eliminated && <span className="finns-chip__boot">(#{s.eliminationOrder})</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid var(--gray-200)' }} />

          {/* Scoring key */}
          <div className="scoring-key">
            <div className="scoring-key__title">Scoring</div>
            <p className="scoring-key__text">
              1st boot = 1 pt · Winner = 24 pts. Active survivors show tentative (~) points. Points lock in on elimination.
            </p>
          </div>

        </aside>

        {/* ── MAIN ── */}
        <main className="app-main">
          <div className="section-label">The Tribes</div>
          <div className="tribes-grid">
            {data.tribes.map(tribe => (
              <TribeCard key={tribe.id} tribe={tribe} survivors={data.survivors} />
            ))}
          </div>
        </main>

      </div>

      {/* ── ADMIN BUTTON ── */}
      <div className="admin-trigger-wrap">
        <button className="admin-trigger" onClick={handleAdminClick}>⚙ Admin</button>
      </div>

      {/* ── PIN MODAL ── */}
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
                maxLength={8}
                value={pinInput}
                onChange={e => { setPinInput(e.target.value); setPinError(false) }}
                autoFocus
                placeholder="••••••••"
              />
              {pinError && <p className="modal__error">Incorrect PIN. Try again.</p>}
              <button type="submit" className="modal__submit">Enter</button>
            </form>
            <button className="modal__cancel" onClick={() => setPinMode(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* ── ADMIN PANEL ── */}
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
  )
}
