import React, { createContext, useContext, useState, useCallback } from 'react';
import type { WorkOrder } from '../domain/work';
import { ShopStage } from '../domain/stages';

type MesContextValue = {
  workOrders: WorkOrder[];
  setWorkOrders: (wo: WorkOrder[]) => void;
  updateWorkOrder: (id: string, patch: Partial<WorkOrder>) => void;
  addWorkOrder: (wo: WorkOrder) => void;
  startTimer: (id: string) => void;
  stopTimer: (id: string) => void;
  events: { ts: number; user?: string; action: string; meta?: any }[];
  updateChecklistItem: (id: string, key: string, value: boolean) => void;
  setSkipFlags: (id: string, flags: Partial<NonNullable<WorkOrder['skipFlags']>>) => void;
  updateFields: (id: string, fields: Partial<WorkOrder>) => void;
  pushEvent: (action: string, meta?: any) => void;
};

const MesContext = createContext<MesContextValue | null>(null);

export const useMes = () => {
  const ctx = useContext(MesContext);
  if (!ctx) throw new Error('useMes must be used within MesProvider');
  return ctx;
};

const sample: WorkOrder[] = [
  {
    id: 'wo-1',
    projectId: 'proj-150',
    name: 'Фасады 1',
    stage: ShopStage.CUT_CNC,
    status: 'QUEUED',
    timeMinutes: 0,
    checklist: { 'Проверен раскрой': true, 'Пилы/фрезы ок': true, 'Контроль размеров': true },
    skipFlags: {},
  },
  {
    id: 'wo-2',
    projectId: 'proj-150',
    name: 'Корпус 1',
    stage: ShopStage.EDGE,
    status: 'IN_PROGRESS',
    timeMinutes: 45,
    checklist: { 'Толщина/цвет кромки': true, 'Снятие фаски': false, 'Шов без дефектов': false },
    skipFlags: { noPaint: true },
  }
];

export const MesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(sample);
  const [events, setEvents] = useState<{ ts: number; user?: string; action: string; meta?: any }[]>([]);

  const updateWorkOrder = useCallback((id: string, patch: Partial<WorkOrder>) => {
    setWorkOrders(prev => prev.map(w => (w.id === id ? { ...w, ...patch } : w)));
  }, []);

  const addWorkOrder = useCallback((wo: WorkOrder) => setWorkOrders(prev => [wo, ...prev]), []);

  const logEvent = useCallback((action: string, meta?: any) => {
    setEvents(prev => [{ ts: Date.now(), action, meta }, ...prev].slice(0, 200));
  }, []);

  const startTimer = useCallback((id: string) => {
    setWorkOrders(prev => prev.map(w => (w.id === id ? { ...w, status: 'IN_PROGRESS', actualStart: w.actualStart || new Date().toISOString(), timerStartAt: Date.now() } : w)));
    logEvent('timer.start', { id });
  }, [logEvent]);

  const stopTimer = useCallback((id: string) => {
    setWorkOrders(prev => prev.map(w => {
      if (w.id !== id) return w;
      const now = Date.now();
      const deltaMin = w.timerStartAt ? Math.round((now - w.timerStartAt) / 60000) : 0;
      return { ...w, status: 'QUEUED', timeMinutes: (w.timeMinutes || 0) + deltaMin, timerStartAt: undefined, actualEnd: new Date().toISOString() };
    }));
    logEvent('timer.stop', { id });
  }, [logEvent]);

  const updateChecklistItem = useCallback((id: string, key: string, value: boolean) => {
    setWorkOrders(prev => prev.map(w => w.id === id ? { ...w, checklist: { ...(w.checklist || {}), [key]: value } } : w));
  }, []);

  const setSkipFlags = useCallback((id: string, flags: Partial<NonNullable<WorkOrder['skipFlags']>>) => {
    setWorkOrders(prev => prev.map(w => w.id === id ? { ...w, skipFlags: { ...(w.skipFlags || {}), ...flags } } : w));
  }, []);

  const updateFields = useCallback((id: string, fields: Partial<WorkOrder>) => {
    setWorkOrders(prev => prev.map(w => w.id === id ? { ...w, ...fields } : w));
  }, []);

  return (
  <MesContext.Provider value={{ workOrders, setWorkOrders, updateWorkOrder, addWorkOrder, startTimer, stopTimer, events, updateChecklistItem, setSkipFlags, updateFields, pushEvent: logEvent }}>
      {children}
    </MesContext.Provider>
  );
};

export default MesContext;
