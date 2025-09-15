import React, { useState } from 'react';
import type { WorkOrder } from '../../domain/work';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Play, Square, CheckCircle2, ChevronDown, ChevronUp, Clock3 } from 'lucide-react';
import { STAGE_RU } from '../../i18n/ru';
import WorkOrderDetailsDialog from './WorkOrderDetailsDialog';

export const WorkOrderCard: React.FC<{ work: WorkOrder; onDone: (id: string) => void; onStartStop: (id: string) => void }> = ({ work, onDone, onStartStop }) => {
  const [expanded, setExpanded] = useState(false);

  const allChecked = Object.values(work.checklist || {}).every(Boolean);
  const qaBlockReason = work.stage === 'QA_PACK' && (!work.packingListUrl || !(work.photos && work.photos.length > 0));

  return (
    <div className="p-3 border rounded bg-white shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium">{work.projectId} • {work.name}</div>
          <div className="text-sm text-muted-foreground">{STAGE_RU[work.stage as any] || work.stage}</div>
          <div className="mt-1">
            <Badge variant={work.status === 'IN_PROGRESS' ? 'default' : work.status === 'DONE' ? 'secondary' : 'outline'}>
              {work.status === 'IN_PROGRESS' ? 'В работе' : work.status === 'DONE' ? 'Завершено' : 'Ожидает'}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant={work.status === 'IN_PROGRESS' ? 'destructive' : 'default'} onClick={() => onStartStop(work.id)} disabled={work.status !== 'IN_PROGRESS' && !work.materialsReady} title={work.status !== 'IN_PROGRESS' && !work.materialsReady ? 'Материалы не подтверждены' : undefined}>
            {work.status === 'IN_PROGRESS' ? <Square className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
            {work.status === 'IN_PROGRESS' ? 'Стоп' : 'Старт'}
          </Button>
          <Button size="sm" onClick={() => onDone(work.id)} disabled={!allChecked || !!qaBlockReason} title={qaBlockReason ? 'Требуется packing list и хотя бы одно фото' : undefined}>
            <CheckCircle2 className="w-4 h-4 mr-1" /> Готово этап
          </Button>
        </div>
      </div>

      <div className="mt-2 text-sm text-muted-foreground flex items-center justify-between">
        <span>План/Факт: {work.planStart ?? '-'} / {work.actualStart ?? '-'}</span>
        <span className="inline-flex items-center"><Clock3 className="w-4 h-4 mr-1" /> {Math.round(work.timeMinutes)} мин</span>
      </div>

      <div className="mt-1 text-xs">
        {work.materialsReady ? (
          <span className="text-green-600">Материалы подтверждены</span>
        ) : (
          <span className="text-amber-600">Материалы не подтверждены</span>
        )}
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
        <WorkOrderDetailsDialog
          work={work}
          trigger={
            <Button variant="ghost" size="sm">
              {expanded ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
              Подробнее
            </Button>
          }
        />
      </div>
    </div>
  );
};

export default WorkOrderCard;
