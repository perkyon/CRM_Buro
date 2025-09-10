import React, { useState } from 'react';
import { useMes } from '../../stores/mesContext';
import { ShopStage } from '../../domain/stages';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

export const ProductionView: React.FC = () => {
  const { workOrders, addWorkOrder } = useMes();
  const [form, setForm] = useState({ projectId: '', name: '', stage: ShopStage.CUT_CNC });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newWO = {
      id: `wo-${Date.now()}`,
      projectId: form.projectId || `proj-${Date.now()}`,
      name: form.name || 'Новая партия',
      stage: form.stage as ShopStage,
      status: 'QUEUED' as const,
      timeMinutes: 0,
      checklist: {},
    };
    addWorkOrder(newWO as any);
    setForm({ projectId: '', name: '', stage: ShopStage.CUT_CNC });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Производство</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm mb-1">Project ID</label>
          <Input name="projectId" value={form.projectId} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm mb-1">Name</label>
          <Input name="name" value={form.name} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm mb-1">Stage</label>
          <select name="stage" value={form.stage} onChange={handleChange} className="w-full p-2 border rounded">
            {Object.values(ShopStage).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="col-span-3">
          <Button type="submit">Создать WorkOrder</Button>
        </div>
      </form>

      <div>
        <h3 className="text-lg mb-2">Список партий</h3>
        <div className="space-y-3">
          {workOrders.map(w => (
            <div key={w.id} className="p-3 border rounded bg-white">{w.projectId} • {w.name} — {w.stage}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductionView;
