import { useState, useEffect, useCallback } from 'react'
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore'
import { db } from './firebase'
import { DEFAULT_DATA } from './data'

const DOC_REF = doc(db, 'survivor', 'draft')

export function useStore() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Subscribe to real-time updates from Firestore
  useEffect(() => {
    const unsub = onSnapshot(DOC_REF, async (snapshot) => {
      if (snapshot.exists()) {
        setData(snapshot.data())
      } else {
        // First time — initialize with default data
        await setDoc(DOC_REF, DEFAULT_DATA)
        setData(DEFAULT_DATA)
      }
      setLoading(false)
    }, (error) => {
      console.error('Firestore error:', error)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  // Save entire data object to Firestore
  const save = useCallback(async (updater) => {
    setData(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      const updated = { ...next, lastUpdated: new Date().toISOString() }
      setDoc(DOC_REF, updated).catch(console.error)
      return updated
    })
  }, [])

  const updateTribeName = useCallback((tribeId, name) => {
    save(prev => ({
      ...prev,
      tribes: prev.tribes.map(t => t.id === tribeId ? { ...t, name } : t)
    }))
  }, [save])

  const updateTribeIcon = useCallback((tribeId, icon) => {
    save(prev => ({
      ...prev,
      tribes: prev.tribes.map(t => t.id === tribeId ? { ...t, icon } : t)
    }))
  }, [save])

  const assignSurvivors = useCallback((tribeId, survivorIds) => {
    save(prev => ({
      ...prev,
      tribes: prev.tribes.map(t => t.id === tribeId ? { ...t, survivors: survivorIds } : t)
    }))
  }, [save])

  const eliminateSurvivor = useCallback((survivorId, eliminationOrder) => {
    save(prev => ({
      ...prev,
      survivors: prev.survivors.map(s =>
        s.id === survivorId ? { ...s, eliminated: true, eliminationOrder } : s
      )
    }))
  }, [save])

  const reinstatesSurvivor = useCallback((survivorId) => {
    save(prev => ({
      ...prev,
      survivors: prev.survivors.map(s =>
        s.id === survivorId ? { ...s, eliminated: false, eliminationOrder: null } : s
      )
    }))
  }, [save])

  const updateSurvivorName = useCallback((survivorId, name) => {
    save(prev => ({
      ...prev,
      survivors: prev.survivors.map(s => s.id === survivorId ? { ...s, name } : s)
    }))
  }, [save])

  const updateSurvivorPhoto = useCallback((survivorId, photo) => {
    save(prev => ({
      ...prev,
      survivors: prev.survivors.map(s => s.id === survivorId ? { ...s, photo } : s)
    }))
  }, [save])

  return {
    data,
    loading,
    updateTribeName,
    updateTribeIcon,
    assignSurvivors,
    eliminateSurvivor,
    reinstatesSurvivor,
    updateSurvivorName,
    updateSurvivorPhoto,
  }
}
