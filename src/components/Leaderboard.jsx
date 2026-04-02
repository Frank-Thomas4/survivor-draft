import React from 'react'
import { getTribePoints } from '../data'

export default function Leaderboard({ tribes, survivors }) {
  const ranked = tribes
    .map(t => ({ ...t, points: getTribePoints(t, survivors) }))
    .sort((a, b) => b.points - a.points)

  return (
    <div className="leaderboard">
      <h2 className="leaderboard__title">Standings</h2>
      <div className="leaderboard__list">
        {ranked.map((tribe, i) => (
          <div key={tribe.id} className={`leaderboard__row ${i === 0 ? 'leaderboard__row--first' : ''}`}>
            <span className="leaderboard__rank">#{i + 1}</span>
            <div className="leaderboard__icon">
              {tribe.icon ? (
                <img src={tribe.icon} alt={tribe.name} />
              ) : (
                <span>{tribe.owner[0]}</span>
              )}
            </div>
            <div className="leaderboard__info">
              <span className="leaderboard__tribe-name">{tribe.name}</span>
              <span className="leaderboard__owner">{tribe.owner}</span>
            </div>
            <span className="leaderboard__pts">{tribe.points} pts</span>
          </div>
        ))}
      </div>
    </div>
  )
}
