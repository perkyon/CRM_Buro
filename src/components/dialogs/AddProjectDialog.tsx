import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { useMes } from '../../stores/mesContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface AddProjectDialogProps {
  trigger: React.ReactNode;
  onSuccess?: (project: any) => void;
}

export function AddProjectDialog({ trigger, onSuccess }: AddProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { pushEvent } = useMes();
  const [formData, setFormData] = useState({
    category: 'Кухонный гарнитур',
    title: '',
    clientName: '',
    manager: '',
    budget: 0,
    deadline: '',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // автонумерация из localStorage
    const key = 'projectSeqCounter';
    const current = Number(localStorage.getItem(key) || '150');
    const nextSeq = current + 1;
    localStorage.setItem(key, String(nextSeq));

    const projectCode = `${formData.category} ${nextSeq}`;
    const now = new Date();
    const project = {
      id: String(nextSeq),
      projectSeq: nextSeq,
      projectCode,
      title: formData.title || projectCode,
      clientName: formData.clientName,
      status: 'to_production' as const,
      manager: formData.manager || 'Менеджер',
      deadline: formData.deadline || now.toISOString().slice(0, 10),
      budget: Number(formData.budget) || 0,
      prepayment: 0,
      remaining: Number(formData.budget) || 0,
      progress: 0,
      createdAt: now.toISOString().slice(0, 10),
      category: formData.category,
      notes: formData.notes,
    } as any;

    setLoading(false);
    setOpen(false);
  pushEvent('project.created', { id: project.id, projectCode: project.projectCode, title: project.title, budget: project.budget });
  onSuccess?.(project);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Создать проект</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Категория</Label>
              <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Кухонный гарнитур">Кухонный гарнитур</SelectItem>
                  <SelectItem value="Барная стойка">Барная стойка</SelectItem>
                  <SelectItem value="Гардеробная система">Гардеробная система</SelectItem>
                  <SelectItem value="Офисная мебель">Офисная мебель</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="title">Название проекта</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="Барная стойка (Фролов)" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clientName">Клиент</Label>
              <Input id="clientName" name="clientName" value={formData.clientName} onChange={handleChange} placeholder="ИП Фролов" />
            </div>
            <div>
              <Label htmlFor="manager">Менеджер</Label>
              <Input id="manager" name="manager" value={formData.manager} onChange={handleChange} placeholder="Ваше имя" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="budget">Бюджет (₽)</Label>
              <Input id="budget" name="budget" type="number" value={String(formData.budget)} onChange={handleChange} placeholder="150000" />
            </div>
            <div>
              <Label htmlFor="deadline">Дедлайн</Label>
              <Input id="deadline" name="deadline" type="date" value={formData.deadline} onChange={handleChange} />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Заметки</Label>
            <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} placeholder="Барная стойка, бюджет 150к" />
          </div>

          <Button type="submit" disabled={loading} className="w-full">{loading ? 'Создание...' : 'Создать'}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
