import { useState, useEffect, useCallback } from 'react';
import { DEFAULT_DATA } from './data';

const STORAGE_KEY = 'survivor50_draft';

export function useStore() {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_DATA;
  });

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updateData = useCallback((updater) => {
    setData(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      return { ...next, lastUpdated: new Date().toISOString() };
    });
  }, []);

  // Update tribe name
  const updateTribeName = useCallback((tribeId, name) => {
    updateData(prev => ({
      ...prev,
      tribes: prev.tribes.map(t => t.id === tribeId ? { ...t, name } : t)
    }));
  }, [updateData]);

  // Update tribe icon (base64 string)
  const updateTribeIcon = useCallback((tribeId, icon) => {
    updateData(prev => ({
      ...prev,
      tribes: prev.tribes.map(t => t.id === tribeId ? { ...t, icon } : t)
    }));
  }, [updateData]);

  // Assign survivors to a tribe (admin)
  const assignSurvivors = useCallback((tribeId, survivorIds) => {
    updateData(prev => ({
      ...prev,
      tribes: prev.tribes.map(t => t.id === tribeId ? { ...t, survivors: survivorIds } : t)
    }));
  }, [updateData]);

  // Mark a survivor as eliminated with their order
  const eliminateSurvivor = useCallback((survivorId, eliminationOrder) => {
    updateData(prev => ({
      ...prev,
      survivors: prev.survivors.map(s =>
        s.id === survivorId
          ? { ...s, eliminated: true, eliminationOrder }
          : s
      )
    }));
  }, [updateData]);

  // Undo elimination
  const reinstatesSurvivor = useCallback((survivorId) => {
    updateData(prev => ({
      ...prev,
      survivors: prev.survivors.map(s =>
        s.id === survivorId
          ? { ...s, eliminated: false, eliminationOrder: null }
          : s
      )
    }));
  }, [updateData]);

  // Update survivor name (admin)
  const updateSurvivorName = useCallback((survivorId, name) => {
    updateData(prev => ({
      ...prev,
      survivors: prev.survivors.map(s => s.id === survivorId ? { ...s, name } : s)
    }));
  }, [updateData]);

  // Reset all data
  const resetData = useCallback(() => {
    updateData(DEFAULT_DATA);
  }, [updateData]);

  return {
    data,
    updateTribeName,
    updateTribeIcon,
    assignSurvivors,
    eliminateSurvivor,
    reinstatesSurvivor,
    updateSurvivorName,
    resetData
  };
}
