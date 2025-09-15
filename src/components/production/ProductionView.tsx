import React, { useState } from 'react';
import { useMes } from '../../stores/mesContext';
import { ShopStage } from '../../domain/stages';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { STAGE_RU, UI_RU } from '../../i18n/ru';
import { CHECKLIST_BY_STAGE } from '../../checklists/templates';
import { PlusCircle } from 'lucide-react';

export const ProductionView: React.FC = () => {
  const { workOrders, addWorkOrder } = useMes();
  const [form, setForm] = useState({ projectId: '', name: '', stage: ShopStage.CUT_CNC });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stage = form.stage as ShopStage;
    const checklistTemplate = CHECKLIST_BY_STAGE[stage] || [];
    const checklist = Object.fromEntries(checklistTemplate.map((k) => [k, false]));
    const newWO = {
      id: `wo-${Date.now()}`,
      projectId: form.projectId || `proj-${Date.now()}`,
      name: form.name || 'Новая партия',
      stage,
      status: 'QUEUED' as const,
      timeMinutes: 0,
      checklist,
    };
    addWorkOrder(newWO as any);
    setForm({ projectId: '', name: '', stage: ShopStage.CUT_CNC });
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl">{UI_RU.production}</h2>

      <Card>
        <CardHeader>
          <CardTitle>{UI_RU.createWorkOrder}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-1">{UI_RU.projectId}</label>
              <Input name="projectId" value={form.projectId} onChange={handleChange} placeholder="PRJ-001" />
            </div>
            <div>
              <label className="block text-sm mb-1">{UI_RU.workName}</label>
              <Input name="name" value={form.name} onChange={handleChange} placeholder="Детали фасада" />
            </div>
            <div>
              <label className="block text-sm mb-1">{UI_RU.stage}</label>
              <select name="stage" value={form.stage} onChange={handleChange} className="w-full p-2 border rounded">
                {Object.values(ShopStage).map((s) => (
                  <option key={s} value={s}>
                    {STAGE_RU[s]}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-3">
              <Button type="submit"><PlusCircle className="w-4 h-4 mr-1" /> {UI_RU.createWorkOrder}</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{UI_RU.workList}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {workOrders.map((w) => (
              <div key={w.id} className="p-3 border rounded bg-white">
                {w.projectId} • {w.name} — {STAGE_RU[w.stage]}
              </div>
            ))}
            {workOrders.length === 0 && (
              <div className="text-sm text-muted-foreground">Пока нет нарядов</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionView;
