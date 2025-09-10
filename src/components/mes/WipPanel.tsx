import React from 'react';
import { useMes } from '../../stores/mesContext';
import { APP_CONFIG } from '../../config/app';

const WipPanel: React.FC = () => {
  const { workOrders } = useMes();

  const grouped = workOrders.reduce((acc: Record<string, any>, w) => {
    acc[w.stage] = acc[w.stage] || { active: 0, plannedHours: 0 };
    if (w.status === 'IN_PROGRESS') acc[w.stage].active++;
    // estimate plannedHours as timeMinutes/60
    acc[w.stage].plannedHours += (w.timeMinutes || 0) / 60;
    return acc;
  }, {} as Record<string, any>);

  return (
    <div className="p-3 bg-white rounded shadow-sm">
      <h4 className="font-semibold">WIP / Загрузка цеха</h4>
      <div className="grid grid-cols-3 gap-4 mt-3">
        {Object.keys(APP_CONFIG.wipLimits).map(stage => {
          const item = grouped[stage] || { active: 0, plannedHours: 0 };
          const limit = APP_CONFIG.wipLimits[stage as any] || 0;
          const loadPct = limit > 0 ? Math.round((item.active / limit) * 100) : 0;
          return (
            <div key={stage} className="p-2 border rounded">
              <div className="text-sm font-medium">{stage}</div>
              <div className="text-xs">Active: {item.active} / {limit}</div>
              <div className="text-xs">Load: {loadPct}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WipPanel;
