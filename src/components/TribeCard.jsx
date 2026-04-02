import React from 'react'
import { calculatePoints, getTribePoints } from '../data'

function SurvivorAvatar({ survivor, size = 36 }) {
  const initials = survivor.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  if (survivor.photo) {
    return (
      <img
        src={survivor.photo}
        alt={survivor.name}
        className="survivor-avatar survivor-avatar--photo"
        style={{ width: size, height: size }}
      />
    )
  }
  return (
    <div
      className="survivor-avatar survivor-avatar--initials"
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  )
}

export default function TribeCard({ tribe, survivors }) {
  const tribePoints = getTribePoints(tribe, survivors)

  const assignedSurvivors = tribe.survivors
    .map(id => survivors.find(s => s.id === id))
    .filter(Boolean)
    .sort((a, b) => {
      if (a.eliminated && !b.eliminated) return 1
      if (!a.eliminated && b.eliminated) return -1
      return 0
    })

  const eliminatedCount = survivors.filter(s => s.eliminated).length

  return (
    <div className="tribe-card">
      <div className="tribe-card__header">
        <div className="tribe-card__icon-wrap">
          {tribe.icon
            ? <img src={tribe.icon} alt={tribe.name} className="tribe-card__icon" />
            : <div className="tribe-card__icon-placeholder">{tribe.owner ? tribe.owner[0].toUpperCase() : '?'}</div>
          }
        </div>
        <div className="tribe-card__title-group">
          <h2 className="tribe-card__tribe-name">{tribe.name}</h2>
          <span className="tribe-card__owner">{tribe.owner}</span>
        </div>
        <div className="tribe-card__points-badge">
          <span className="tribe-card__points-num">{tribePoints}</span>
          <span className="tribe-card__points-label">pts</span>
        </div>
      </div>

      <div className="tribe-card__survivors">
        {assignedSurvivors.length === 0 && (
          <p className="tribe-card__empty">No survivors drafted yet</p>
        )}
        {assignedSurvivors.map(s => {
          const pts = calculatePoints(s, survivors)
          return (
            <div key={s.id} className={`survivor-row ${s.eliminated ? 'survivor-row--eliminated' : 'survivor-row--active'}`}>
              <div className="survivor-row__info">
                <SurvivorAvatar survivor={s} size={32} />
                <div className="survivor-row__text">
                  <span className="survivor-row__name">{s.name}</span>
                  {s.eliminated && (
                    <span className="survivor-row__boot-tag">Boot #{s.eliminationOrder}</span>
                  )}
                </div>
              </div>
              <div className="survivor-row__points">
                <span className="survivor-row__pts-num">{pts}</span>
                {!s.eliminated && <span className="survivor-row__tentative">~</span>}
              </div>
            </div>
          )
        })}
      </div>

      {assignedSurvivors.length > 0 && (
        <div className="tribe-card__footer">
          <span className="tribe-card__footer-label">
            {eliminatedCount} eliminated · {survivors.length - eliminatedCount} remain
          </span>
          <span className="tribe-card__footer-total">{tribePoints} total pts</span>
        </div>
      )}
    </div>
  )
}
