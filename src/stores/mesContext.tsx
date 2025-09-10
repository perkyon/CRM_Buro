import React, { createContext, useContext, useState, useCallback } from 'react';
import type { WorkOrder } from '../domain/work';
import { ShopStage } from '../domain/stages';

type MesContextValue = {
  workOrders: WorkOrder[];
  setWorkOrders: (wo: WorkOrder[]) => void;
  updateWorkOrder: (id: string, patch: Partial<WorkOrder>) => void;
  addWorkOrder: (wo: WorkOrder) => void;
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

  const updateWorkOrder = useCallback((id: string, patch: Partial<WorkOrder>) => {
    setWorkOrders(prev => prev.map(w => (w.id === id ? { ...w, ...patch } : w)));
  }, []);

  const addWorkOrder = useCallback((wo: WorkOrder) => setWorkOrders(prev => [wo, ...prev]), []);

  return (
    <MesContext.Provider value={{ workOrders, setWorkOrders, updateWorkOrder, addWorkOrder }}>
      {children}
    </MesContext.Provider>
  );
};

export default MesContext;
