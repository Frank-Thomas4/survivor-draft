import React, { useState } from 'react'

export const ADMIN_PIN = '46378154'

export default function AdminPanel({
  data,
  onUpdateTribeName,
  onUpdateTribeIcon,
  onAssignSurvivors,
  onEliminateSurvivor,
  onReinstateSurvivor,
  onUpdateSurvivorName,
  onClose
}) {
  const [activeTab, setActiveTab] = useState('assign')
  const [editingNames, setEditingNames] = useState({})
  const [editingSurvivorNames, setEditingSurvivorNames] = useState({})

  const { tribes, survivors } = data
  const eliminatedCount = survivors.filter(s => s.eliminated).length

  const handleTribeNameChange = (tribeId, val) => {
    setEditingNames(prev => ({ ...prev, [tribeId]: val }))
  }
  const handleTribeNameSave = (tribeId) => {
    const val = editingNames[tribeId]
    if (val && val.trim()) onUpdateTribeName(tribeId, val.trim())
    setEditingNames(prev => { const n = { ...prev }; delete n[tribeId]; return n })
  }

  const handleIconUpload = (tribeId, e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => onUpdateTribeIcon(tribeId, ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleAssignToggle = (tribeId, survivorId) => {
    const tribe = tribes.find(t => t.id === tribeId)
    const already = tribe.survivors.includes(survivorId)
    if (!already && tribe.survivors.length >= 3) {
      alert('Each tribe can only have 3 survivors.')
      return
    }
    const otherTribe = tribes.find(t => t.id !== tribeId && t.survivors.includes(survivorId))
    if (!already && otherTribe) {
      alert(`${survivors.find(s => s.id === survivorId)?.name} is already in ${otherTribe.name}.`)
      return
    }
    const newList = already
      ? tribe.survivors.filter(id => id !== survivorId)
      : [...tribe.survivors, survivorId]
    onAssignSurvivors(tribeId, newList)
  }

  const handleEliminate = (survivorId) => {
    const nextOrder = eliminatedCount + 1
    onEliminateSurvivor(survivorId, nextOrder)
  }

  const handleSurvivorNameSave = (id) => {
    const val = editingSurvivorNames[id]
    if (val && val.trim()) onUpdateSurvivorName(id, val.trim())
    setEditingSurvivorNames(prev => { const n = { ...prev }; delete n[id]; return n })
  }

  const assignedIds = tribes.flatMap(t => t.survivors)

  return (
    <div className="admin-overlay">
      <div className="admin-panel">
        <div className="admin-panel__header">
          <h2 className="admin-panel__title">Admin Panel</h2>
          <button className="admin-panel__close" onClick={onClose}>✕</button>
        </div>

        <div className="admin-tabs">
          {['assign', 'eliminate', 'tribes', 'cast'].map(tab => (
            <button
              key={tab}
              className={`admin-tab ${activeTab === tab ? 'admin-tab--active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'assign' && 'Draft Picks'}
              {tab === 'eliminate' && 'Eliminations'}
              {tab === 'tribes' && 'Tribe Settings'}
              {tab === 'cast' && 'Edit Cast'}
            </button>
          ))}
        </div>

        <div className="admin-panel__body">

          {activeTab === 'assign' && (
            <div>
              <p className="admin-hint">Select up to 3 survivors per tribe.</p>
              {tribes.map(tribe => (
                <div key={tribe.id} className="admin-section">
                  <h3 className="admin-section__title">
                    {tribe.name}
                    <span className="admin-section__count">{tribe.survivors.length}/3</span>
                  </h3>
                  <div className="survivor-grid">
                    {survivors.map(s => {
                      const isAssignedHere = tribe.survivors.includes(s.id)
                      const isAssignedElsewhere = !isAssignedHere && assignedIds.includes(s.id)
                      return (
                        <button
                          key={s.id}
                          className={`survivor-chip ${isAssignedHere ? 'survivor-chip--selected' : ''} ${isAssignedElsewhere ? 'survivor-chip--taken' : ''}`}
                          onClick={() => !isAssignedElsewhere && handleAssignToggle(tribe.id, s.id)}
                          disabled={isAssignedElsewhere}
                        >
                          {s.name}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'eliminate' && (
            <div>
              <p className="admin-hint">Mark survivors eliminated in order. Next elimination will be Boot #{eliminatedCount + 1}.</p>
              <div className="elim-list">
                {survivors
                  .slice()
                  .sort((a, b) => {
                    if (a.eliminated && !b.eliminated) return 1
                    if (!a.eliminated && b.eliminated) return -1
                    if (a.eliminated && b.eliminated) return a.eliminationOrder - b.eliminationOrder
                    return a.id - b.id
                  })
                  .map(s => (
                    <div key={s.id} className={`elim-row ${s.eliminated ? 'elim-row--out' : ''}`}>
                      <div className="elim-row__info">
                        <span className={`survivor-row__status-dot ${s.eliminated ? 'dot--out' : 'dot--in'}`} />
                        <span className="elim-row__name">{s.name}</span>
                        {s.eliminated && <span className="elim-row__order">Boot #{s.eliminationOrder}</span>}
                      </div>
                      <div className="elim-row__actions">
                        {s.eliminated ? (
                          <button className="btn-reinstate" onClick={() => onReinstateSurvivor(s.id)}>Reinstate</button>
                        ) : (
                          <button className="btn-eliminate" onClick={() => handleEliminate(s.id)}>Eliminate</button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {activeTab === 'tribes' && (
            <div>
              {tribes.map(tribe => (
                <div key={tribe.id} className="admin-section">
                  <h3 className="admin-section__title">{tribe.owner}'s Tribe</h3>
                  <div className="admin-field">
                    <label className="admin-label">Tribe Name</label>
                    <div className="admin-inline">
                      <input
                        className="admin-input"
                        value={editingNames[tribe.id] !== undefined ? editingNames[tribe.id] : tribe.name}
                        onChange={e => handleTribeNameChange(tribe.id, e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleTribeNameSave(tribe.id)}
                      />
                      <button className="btn-save" onClick={() => handleTribeNameSave(tribe.id)}>Save</button>
                    </div>
                  </div>
                  <div className="admin-field">
                    <label className="admin-label">Tribe Icon</label>
                    <div className="admin-inline">
                      {tribe.icon && <img src={tribe.icon} alt="icon" className="admin-icon-preview" />}
                      <label className="btn-upload">
                        {tribe.icon ? 'Change Image' : 'Upload Image'}
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleIconUpload(tribe.id, e)} />
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'cast' && (
            <div>
              <p className="admin-hint">Edit survivor names if needed.</p>
              <div className="cast-list">
                {survivors.map(s => (
                  <div key={s.id} className="cast-row">
                    <span className="cast-row__num">#{s.id}</span>
                    <input
                      className="admin-input admin-input--sm"
                      value={editingSurvivorNames[s.id] !== undefined ? editingSurvivorNames[s.id] : s.name}
                      onChange={e => setEditingSurvivorNames(prev => ({ ...prev, [s.id]: e.target.value }))}
                      onBlur={() => handleSurvivorNameSave(s.id)}
                      onKeyDown={e => e.key === 'Enter' && handleSurvivorNameSave(s.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
