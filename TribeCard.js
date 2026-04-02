import React from 'react';
import { calculatePoints, getTribePoints } from '../data';

export default function TribeCard({ tribe, survivors, isFinn = false }) {
  const tribePoints = getTribePoints(tribe, survivors);

  const assignedSurvivors = tribe.survivors
    .map(id => survivors.find(s => s.id === id))
    .filter(Boolean)
    .sort((a, b) => {
      if (a.eliminated && !b.eliminated) return 1;
      if (!a.eliminated && b.eliminated) return -1;
      return 0;
    });

  const eliminatedCount = survivors.filter(s => s.eliminated).length;
  const activeRemaining = survivors.length - eliminatedCount;

  return (
    <div className={`tribe-card ${isFinn ? 'tribe-card--finn' : ''}`}>
      <div className="tribe-card__header">
        <div className="tribe-card__icon-wrap">
          {tribe.icon ? (
            <img src={tribe.icon} alt={tribe.name} className="tribe-card__icon" />
          ) : (
            <div className="tribe-card__icon-placeholder">
              {tribe.owner ? tribe.owner[0].toUpperCase() : 'F'}
            </div>
          )}
        </div>
        <div className="tribe-card__title-group">
          <h2 className="tribe-card__tribe-name">{tribe.name}</h2>
          {!isFinn && (
            <span className="tribe-card__owner">{tribe.owner}</span>
          )}
        </div>
        {!isFinn && (
          <div className="tribe-card__points-badge">
            <span className="tribe-card__points-num">{tribePoints}</span>
            <span className="tribe-card__points-label">pts</span>
          </div>
        )}
      </div>

      <div className="tribe-card__survivors">
        {assignedSurvivors.length === 0 && (
          <p className="tribe-card__empty">No survivors drafted yet</p>
        )}
        {assignedSurvivors.map(s => {
          const pts = calculatePoints(s, survivors);
          const isTentative = !s.eliminated;
          return (
            <div
              key={s.id}
              className={`survivor-row ${s.eliminated ? 'survivor-row--eliminated' : 'survivor-row--active'}`}
            >
              <div className="survivor-row__info">
                <span className={`survivor-row__status-dot ${s.eliminated ? 'dot--out' : 'dot--in'}`} />
                <span className="survivor-row__name">{s.name}</span>
                {s.eliminated && (
                  <span className="survivor-row__boot-tag">
                    Boot #{s.eliminationOrder}
                  </span>
                )}
              </div>
              <div className="survivor-row__points">
                <span className="survivor-row__pts-num">{pts}</span>
                {isTentative && (
                  <span className="survivor-row__tentative" title="Tentative — updates as survivors are eliminated">~</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!isFinn && assignedSurvivors.length > 0 && (
        <div className="tribe-card__footer">
          <span className="tribe-card__footer-label">
            {eliminatedCount} eliminated · {activeRemaining} remain
          </span>
          <span className="tribe-card__footer-total">{tribePoints} total pts</span>
        </div>
      )}
    </div>
  );
}
