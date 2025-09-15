import React, { useState } from 'react';
import type { WorkOrder } from '../../domain/work';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Play, Square, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

export const WorkOrderCard: React.FC<{ work: WorkOrder; onDone: (id: string) => void; onStartStop: (id: string) => void }> = ({ work, onDone, onStartStop }) => {
  const [expanded, setExpanded] = useState(false);

  const allChecked = Object.values(work.checklist || {}).every(Boolean);

  return (
    <div className="p-3 border rounded bg-white shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium">{work.projectId} • {work.name}</div>
          <div className="mt-1">
            <Badge variant={work.status === 'IN_PROGRESS' ? 'default' : work.status === 'DONE' ? 'secondary' : 'outline'}>
              {work.status === 'IN_PROGRESS' ? 'В работе' : work.status === 'DONE' ? 'Завершено' : 'Ожидает'}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant={work.status === 'IN_PROGRESS' ? 'destructive' : 'default'} onClick={() => onStartStop(work.id)}>
            {work.status === 'IN_PROGRESS' ? <Square className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
            {work.status === 'IN_PROGRESS' ? 'Стоп' : 'Старт'}
          </Button>
          <Button size="sm" onClick={() => onDone(work.id)} disabled={!allChecked}>
            <CheckCircle2 className="w-4 h-4 mr-1" /> Готово этап
          </Button>
        </div>
      </div>

      <div className="mt-2 text-sm text-muted-foreground">
        План/Факт: {work.planStart ?? '-'} / {work.actualStart ?? '-'}
      </div>

      {expanded && (
        <div className="mt-2 text-sm">
          <div className="mb-1">Чек-лист:</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(work.checklist || {}).map(([k, v]) => (
              <span key={k} className={`text-xs px-2 py-1 rounded border ${v ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                {k}
              </span>
            ))}
            {Object.keys(work.checklist || {}).length === 0 && <span className="text-xs text-muted-foreground">Нет пунктов</span>}
          </div>
        </div>
      )}

      <div className="mt-2">
        <Button variant="ghost" size="sm" onClick={() => setExpanded(x => !x)}>
          {expanded ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
          {expanded ? 'Свернуть' : 'Подробнее'}
        </Button>
      </div>
    </div>
  );
};

export default WorkOrderCard;
