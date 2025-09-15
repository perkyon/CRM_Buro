import React from 'react';
import { useMes } from '../../stores/mesContext';
import { ShopStage } from '../../domain/stages';
import WorkOrderCard from './WorkOrderCard';
import WipPanel from './WipPanel';
import { STAGE_RU, t } from '../../i18n/ru';

const STAGES: ShopStage[] = [
  ShopStage.CUT_CNC,
  ShopStage.EDGE,
  ShopStage.DRILL,
  ShopStage.SANDING,
  ShopStage.PAINT,
  ShopStage.QA_PACK,
];

export const ShopKanban: React.FC = () => {
  const { workOrders, updateWorkOrder } = useMes();

  const moveToNext = (id: string) => {
    const wo = workOrders.find(w => w.id === id);
    if (!wo) return;
    const idx = STAGES.indexOf(wo.stage);
    // compute next taking into account skip flags
    let nextIdx = idx + 1;
    if (wo.skipFlags?.noPaint && STAGES[nextIdx] === ShopStage.SANDING) nextIdx++;
    if (wo.skipFlags?.noDrill && STAGES[nextIdx] === ShopStage.DRILL) nextIdx++;
    if (nextIdx >= STAGES.length) {
      updateWorkOrder(id, { status: 'DONE' });
      return;
    }
    updateWorkOrder(id, { stage: STAGES[nextIdx], status: 'QUEUED' });
  };

  const toggleStartStop = (id: string) => {
    const wo = workOrders.find(w => w.id === id);
    if (!wo) return;
    if (wo.status === 'IN_PROGRESS') {
      // stop
      updateWorkOrder(id, { status: 'QUEUED', timeMinutes: (wo.timeMinutes || 0) + 15 });
    } else {
      updateWorkOrder(id, { status: 'IN_PROGRESS' });
    }
  };

  return (
    <div>
      <WipPanel />
      <div className="grid grid-cols-3 gap-4 mt-4">
        {STAGES.map((stage) => {
          const items = workOrders.filter((w) => w.stage === stage);
          return (
            <div key={stage} className="bg-slate-50 p-3 rounded">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{STAGE_RU[stage] || t(`stages.${stage}`)}</h3>
                <span className="text-xs px-2 py-0.5 rounded bg-white border">{items.length}</span>
              </div>
              <div className="space-y-3">
                {items.map((w) => (
                  <WorkOrderCard key={w.id} work={w} onDone={moveToNext} onStartStop={toggleStartStop} />
                ))}
              </div>
              {items.length === 0 && (
                <div className="text-sm text-slate-500 mt-2">{t('texts.noWorkOrders')}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShopKanban;
