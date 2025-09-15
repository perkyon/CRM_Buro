import React from 'react';
import { useMes } from '../../stores/mesContext';
import { ShopStage } from '../../domain/stages';
import WorkOrderCard from './WorkOrderCard';
import WipPanel from './WipPanel';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Plus } from 'lucide-react';
import { CHECKLIST_BY_STAGE } from '../../checklists/templates';
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
  const { workOrders, updateWorkOrder, startTimer, stopTimer, pushEvent } = useMes();

  const moveToNext = (id: string) => {
    const wo = workOrders.find(w => w.id === id);
    if (!wo) return;
    // блокируем переход, если чек-лист не 100%
    const allChecked = Object.values(wo.checklist || {}).every(Boolean);
    if (!allChecked) return;
    // если текущий этап QA_PACK — проверяем обязательные вложения
    if (wo.stage === ShopStage.QA_PACK) {
      const hasPacking = !!wo.packingListUrl;
      const hasPhotos = (wo.photos && wo.photos.length >= 1) || false;
      if (!hasPacking || !hasPhotos) return;
    }
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
      pushEvent('workorder.done', { id, projectId: wo.projectId, name: wo.name, from: wo.stage, to: 'DONE' });
      return;
    }
    const toStage = STAGES[nextIdx];
    updateWorkOrder(id, { stage: toStage, status: 'QUEUED' });
    pushEvent('workorder.move', { id, projectId: wo.projectId, name: wo.name, from: wo.stage, to: toStage });
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
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded bg-white border">{items.length}</span>
                  {stage === ShopStage.PURCHASE && (
                    <AddWorkOrderButton onCreate={(wo) => updateWorkOrder(wo.id, wo)} />
                  )}
                </div>
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

// Быстрый диалог создания партии для колонки Закупка
const AddWorkOrderButton: React.FC<{ onCreate: (wo: any) => void }> = ({ onCreate }) => {
  const { addWorkOrder } = useMes();
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({ projectId: '', name: '', assignee: '', dueDate: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const checklistTemplate = CHECKLIST_BY_STAGE[ShopStage.PURCHASE] || [];
    const checklist = Object.fromEntries(checklistTemplate.map(k => [k, false]));
    const wo = {
      id: `wo-${Date.now()}`,
      projectId: form.projectId || `proj-${Date.now()}`,
      name: form.name || 'Новая партия',
      stage: ShopStage.PURCHASE,
      status: 'QUEUED' as const,
      timeMinutes: 0,
      checklist,
      assignee: form.assignee,
      dueDate: form.dueDate,
    };
    addWorkOrder(wo as any);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline"><Plus className="w-4 h-4" /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Добавить задачу (Закупка)</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label>Проект</Label>
            <Input value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })} placeholder="Барная стойка 151" />
          </div>
          <div>
            <Label>Компонент / Узел</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Стойка — корпус+фасады" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Ответственный</Label>
              <Input value={form.assignee} onChange={(e) => setForm({ ...form, assignee: e.target.value })} placeholder="Начальник цеха" />
            </div>
            <div>
              <Label>Срок</Label>
              <Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Отмена</Button>
            <Button type="submit">Создать</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
