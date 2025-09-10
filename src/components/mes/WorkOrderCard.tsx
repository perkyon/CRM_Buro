import React, { useState } from 'react';
import type { WorkOrder } from '../../domain/work';
import { Button } from '../ui/button';

export const WorkOrderCard: React.FC<{ work: WorkOrder; onDone: (id: string) => void; onStartStop: (id: string) => void }> = ({ work, onDone, onStartStop }) => {
  const [expanded, setExpanded] = useState(false);

  const allChecked = Object.values(work.checklist || {}).every(Boolean);

  return (
    <div className="p-3 border rounded bg-white shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium">{work.projectId} • {work.name}</div>
          <div className="text-sm text-muted-foreground">{work.stage}</div>
        </div>
        <div className="space-x-2">
          <Button size="sm" onClick={() => onStartStop(work.id)}>{work.status === 'IN_PROGRESS' ? 'Stop' : 'Start'}</Button>
          <Button size="sm" onClick={() => onDone(work.id)} disabled={!allChecked}>Готово этап</Button>
        </div>
      </div>

      <div className="mt-2 text-sm">
        План/Факт: {work.planStart ?? '-'} / {work.actualStart ?? '-'}
      </div>

      {expanded && (
        <div className="mt-2 text-sm">
          <div>Чек-лист:</div>
          <ul className="list-disc ml-5">
            {Object.entries(work.checklist || {}).map(([k, v]) => (
              <li key={k} className={v ? 'text-green-600' : 'text-red-600'}>{k} — {v ? 'OK' : 'NO'}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-2">
        <Button variant="ghost" size="sm" onClick={() => setExpanded(x => !x)}>{expanded ? 'Свернуть' : 'Подробнее'}</Button>
      </div>
    </div>
  );
};

export default WorkOrderCard;
