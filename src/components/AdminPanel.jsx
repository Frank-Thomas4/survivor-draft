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
  onUpdateSurvivorPhoto,
  onClose
}) {
  const [activeTab, setActiveTab] = useState('assign')
  const [editingNames, setEditingNames] = useState({})
  const [editingSurvivorNames, setEditingSurvivorNames] = useState({})
  const [uploadingPhoto, setUploadingPhoto] = useState(null)

  const { tribes, survivors } = data
  const eliminatedCount = survivors.filter(s => s.eliminated).length

  // ── Tribe name ──
  const handleTribeNameChange = (tribeId, val) => {
    setEditingNames(prev => ({ ...prev, [tribeId]: val }))
  }
  const handleTribeNameSave = (tribeId) => {
    const val = editingNames[tribeId]
    if (val && val.trim()) onUpdateTribeName(tribeId, val.trim())
    setEditingNames(prev => { const n = { ...prev }; delete n[tribeId]; return n })
  }

  // ── Tribe icon ──
  const handleIconUpload = (tribeId, e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => onUpdateTribeIcon(tribeId, ev.target.result)
    reader.readAsDataURL(file)
  }

  // ── Draft assign ──
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

  // ── Eliminate ──
  const handleEliminate = (survivorId) => {
    onEliminateSurvivor(survivorId, eliminatedCount + 1)
  }

  // ── Survivor name ──
  const handleSurvivorNameSave = (id) => {
    const val = editingSurvivorNames[id]
    if (val && val.trim()) onUpdateSurvivorName(id, val.trim())
    setEditingSurvivorNames(prev => { const n = { ...prev }; delete n[id]; return n })
  }

  // ── Survivor photo ──
  const handlePhotoUpload = (survivorId, e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingPhoto(survivorId)
    // Resize image before storing to keep Firebase document small
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const MAX = 200
      const ratio = Math.min(MAX / img.width, MAX / img.height)
      canvas.width = img.width * ratio
      canvas.height = img.height * ratio
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      const base64 = canvas.toDataURL('image/jpeg', 0.75)
      onUpdateSurvivorPhoto(survivorId, base64)
      URL.revokeObjectURL(url)
      setUploadingPhoto(null)
    }
    img.src = url
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
              {tab === 'cast' && 'Cast Photos'}
            </button>
          ))}
        </div>

        <div className="admin-panel__body">

          {/* ── DRAFT PICKS ── */}
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

          {/* ── ELIMINATIONS ── */}
          {activeTab === 'eliminate' && (
            <div>
              <p className="admin-hint">Mark survivors eliminated in order. Next will be Boot #{eliminatedCount + 1}.</p>
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
                        {s.photo
                          ? <img src={s.photo} alt={s.name} className="elim-row__photo" />
                          : <span className={`survivor-row__status-dot ${s.eliminated ? 'dot--out' : 'dot--in'}`} />
                        }
                        <span className="elim-row__name">{s.name}</span>
                        {s.eliminated && <span className="elim-row__order">Boot #{s.eliminationOrder}</span>}
                      </div>
                      <div className="elim-row__actions">
                        {s.eliminated
                          ? <button className="btn-reinstate" onClick={() => onReinstateSurvivor(s.id)}>Reinstate</button>
                          : <button className="btn-eliminate" onClick={() => handleEliminate(s.id)}>Eliminate</button>
                        }
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ── TRIBE SETTINGS ── */}
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

          {/* ── CAST PHOTOS ── */}
          {activeTab === 'cast' && (
            <div>
              <p className="admin-hint">Upload a headshot for each castaway. Photos are stored in Firebase and visible to all players instantly.</p>
              <div className="cast-photo-grid">
                {survivors.map(s => (
                  <div key={s.id} className="cast-photo-card">
                    <div className="cast-photo-card__img-wrap">
                      {uploadingPhoto === s.id ? (
                        <div className="cast-photo-card__loading">⏳</div>
                      ) : s.photo ? (
                        <img src={s.photo} alt={s.name} className="cast-photo-card__img" />
                      ) : (
                        <div className="cast-photo-card__placeholder">
                          {s.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="cast-photo-card__name">{s.name}</div>
                    <label className="cast-photo-card__btn">
                      {s.photo ? '↺ Replace' : '+ Photo'}
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={e => handlePhotoUpload(s.id, e)}
                      />
                    </label>
                    {s.photo && (
                      <button
                        className="cast-photo-card__remove"
                        onClick={() => onUpdateSurvivorPhoto(s.id, null)}
                      >
                        Remove
                      </button>
                    )}
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
