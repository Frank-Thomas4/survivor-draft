import React from 'react';

export default function FinnsTribe({ survivors, tribes }) {
  const assignedIds = tribes.flatMap(t => t.survivors);
  const undrafted = survivors.filter(s => !assignedIds.includes(s.id));

  return (
    <div className="finns-tribe">
      <div className="finns-tribe__header">
        <div className="finns-tribe__icon">🐾</div>
        <div>
          <h2 className="finns-tribe__title">Finn's Tribe</h2>
          <p className="finns-tribe__sub">Undrafted survivors — {undrafted.length} remaining</p>
        </div>
      </div>
      <div className="finns-tribe__grid">
        {undrafted.length === 0 && (
          <p className="finns-tribe__empty">All survivors have been drafted!</p>
        )}
        {undrafted.map(s => (
          <div
            key={s.id}
            className={`finns-chip ${s.eliminated ? 'finns-chip--eliminated' : ''}`}
          >
            <span className={`survivor-row__status-dot ${s.eliminated ? 'dot--out' : 'dot--in'}`} />
            <span>{s.name}</span>
            {s.eliminated && <span className="finns-chip__boot"> (Boot #{s.eliminationOrder})</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
