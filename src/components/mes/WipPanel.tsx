import React from 'react';
import { useMes } from '../../stores/mesContext';
import { APP_CONFIG } from '../../config/app';
import { Progress } from '../ui/progress';
import { STAGE_RU } from '../../i18n/ru';

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
      <h4 className="font-semibold">Загрузка цеха (WIP)</h4>
      <div className="grid grid-cols-3 gap-4 mt-3">
        {Object.keys(APP_CONFIG.wipLimits).map((stage) => {
          const item = grouped[stage] || { active: 0, plannedHours: 0 };
          const limit = (APP_CONFIG.wipLimits as any)[stage] || 0;
          const loadPct = limit > 0 ? Math.min(100, Math.round((item.active / limit) * 100)) : 0;
          const label = (STAGE_RU as any)[stage] || stage;
          return (
            <div key={stage} className="p-3 border rounded bg-white">
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-medium">{label}</div>
                <div className="text-xs text-muted-foreground">Активно: {item.active} / {limit}</div>
              </div>
              <Progress value={loadPct} className="h-2" />
              <div className="mt-1 text-[11px] text-muted-foreground">Загрузка: {loadPct}% • План, ч: {item.plannedHours.toFixed(1)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WipPanel;
