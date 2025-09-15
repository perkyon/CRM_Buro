import React from 'react';
import { useMes } from '../../stores/mesContext';
import { ShopStage } from '../../domain/stages';
import WorkOrderCard from './WorkOrderCard';
import WipPanel from './WipPanel';
import { STAGE_RU, t } from '../../i18n/ru';

const STAGES: ShopStage[] = [
  ShopStage.PURCHASE,
  ShopStage.CUT_CNC,
  ShopStage.EDGE,
  ShopStage.DRILL,
  ShopStage.SANDING,
  ShopStage.PAINT,
  ShopStage.QA_PACK,
];

export const ShopKanban: React.FC = () => {
  const { workOrders, updateWorkOrder, startTimer, stopTimer } = useMes();

  const moveToNext = (id: string) => {
    const wo = workOrders.find(w => w.id === id);
    if (!wo) return;
    // блокируем переход, если чек-лист не 100%
    const allChecked = Object.values(wo.checklist || {}).every(Boolean);
    if (!allChecked) return;
    const idx = STAGES.indexOf(wo.stage);
    // compute next taking into account skip flags
    let nextIdx = idx + 1;
    // если noDrill — пропускаем DRILL
    if (wo.skipFlags?.noDrill) {
      while (STAGES[nextIdx] === ShopStage.DRILL) nextIdx++;
    }
    // если noPaint — пропускаем SANDING и PAINT
    if (wo.skipFlags?.noPaint) {
      while (STAGES[nextIdx] === ShopStage.SANDING || STAGES[nextIdx] === ShopStage.PAINT) nextIdx++;
    }
    if (nextIdx >= STAGES.length) {
      updateWorkOrder(id, { status: 'DONE' });
      return;
    }
    updateWorkOrder(id, { stage: STAGES[nextIdx], status: 'QUEUED' });
  };

  const toggleStartStop = (id: string) => {
    const wo = workOrders.find((w) => w.id === id);
    if (!wo) return;
    if (wo.status === 'IN_PROGRESS') stopTimer(id);
    else startTimer(id);
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
